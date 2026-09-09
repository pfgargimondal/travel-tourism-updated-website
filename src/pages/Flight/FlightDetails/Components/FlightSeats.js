import { useEffect, useMemo, useState } from "react";
import "./FlightSeats.css";

export const FlightSeats = ({
    seatMap,
    adultCount,
    childCount,
    infantCount,
    bookingPassengers,
    selectedSeats = [],
    setSelectedSeats,
    onSeatChange,
    onSeatSelectionComplete
}) => {

    const requiredSeats =
        Number(adultCount || 0) +
        Number(childCount || 0) +
        Number(infantCount || 0);

    const safeSelectedSeats = Array.isArray(selectedSeats)
        ? selectedSeats
        : [];

    const [activePassenger, setActivePassenger] = useState(null);
    const [seatError, setSeatError] = useState("");

    // Get passenger name
    const getPassengerName = (paxId) => {
        const passenger = bookingPassengers?.[paxId - 1];

        if (!passenger) {
            return `Pax ${paxId}`;
        }

        return `${passenger.firstName || ""} ${passenger.lastName || ""}`.trim();
    };

    const showSeatError = (message) => {
        setSeatError(message);

        setTimeout(() => {
            setSeatError("");
        }, 3000);
    };

    const findSeatSegments = (obj) => {
        if (!obj || typeof obj !== "object") {
            return null;
        }

        if (Array.isArray(obj)) {
            for (const item of obj) {
                const result = findSeatSegments(item);

                if (result) {
                    return result;
                }
            }

            return null;
        }

        if (obj.Seat_Segments) {
            return obj.Seat_Segments;
        }

        for (const key of Object.keys(obj)) {
            const result = findSeatSegments(obj[key]);

            if (result) {
                return result;
            }
        }

        return null;
    };

    const seatDetails = useMemo(() => {
        const seatSegments = findSeatSegments(seatMap);

        console.log("FOUND Seat_Segments:", seatSegments);

        if (!seatSegments) {
            console.log("Seat_Segments not found");
            return [];
        }

        const rows = seatSegments.flatMap(
            segment => segment?.Seat_Row || []
        );

        console.log("FOUND Seat Rows:", rows);
        console.log("Seat Row Count:", rows.length);

        const details = rows.flatMap(
            row => row?.Seat_Details || []
        );

        return details;

        // eslint-disable-next-line
    }, [seatMap]);

    const seats = useMemo(() => {

        const seatMapObject = {};

        console.log(seatDetails, "seatDetails");

        seatDetails.forEach(seat => {

            let seatName = seat.SSR_TypeName || "";

            /*
             * Convert:
             * 1A
             * 1B-NS
             * 1C
             * 1D
             *
             * Only take actual seat number + alphabet.
             */

            const match = seatName.match(/^(\d+)([A-F])/);

            if (!match) {
                return;
            }

            const row = Number(match[1]);
            const column = match[2];

            const id = `${row}${column}`;

            /*
             * Sometimes API contains duplicate records
             * for the same seat.
             */

            if (!seatMapObject[id]) {

                seatMapObject[id] = {
                    id,
                    row,
                    column,
                    status: seat.SSR_Status,
                    amount: Number(seat.Total_Amount || 0),
                    currency: seat.Currency_Code,
                    ssrKey: seat.SSR_Key,
                    type: seat.SSR_TypeName,
                    description: seat.SSR_TypeDesc,
                    flightId: seat.Flight_ID,
                    segmentId: seat.Segment_Id,

                    // IMPORTANT:
                    // Preserve ApplicablePaxTypes from API
                    ApplicablePaxTypes: Array.isArray(
                        seat.ApplicablePaxTypes
                    )
                        ? seat.ApplicablePaxTypes.map(Number)
                        : []
                };

            } else {

                /*
                 * If duplicate seat exists, prefer actual
                 * seat record instead of generic "SEAT".
                 */

                if (
                    seat.SSR_TypeName === id &&
                    seatMapObject[id].type !== id
                ) {

                    seatMapObject[id] = {
                        ...seatMapObject[id],
                        status: seat.SSR_Status,
                        amount: Number(seat.Total_Amount || 0),
                        ssrKey: seat.SSR_Key,
                        type: seat.SSR_TypeName,
                        description: seat.SSR_TypeDesc,

                        // IMPORTANT:
                        // Preserve passenger types
                        ApplicablePaxTypes: Array.isArray(
                            seat.ApplicablePaxTypes
                        )
                            ? seat.ApplicablePaxTypes.map(Number)
                            : seatMapObject[id].ApplicablePaxTypes
                    };

                }

            }

        });

        return Object.values(seatMapObject);

    }, [seatDetails]);

    const rows = useMemo(() => {

        const grouped = {};

        seats.forEach(seat => {

            if (!grouped[seat.row]) {
                grouped[seat.row] = [];
            }

            grouped[seat.row].push(seat);

        });

        return Object.keys(grouped)
            .map(Number)
            .sort((a, b) => a - b);

    }, [seats]);

    const getSeat = (row, column) => {

        return seats.find(
            seat =>
                seat.row === row &&
                seat.column === column
        );

    };

    const getPriceClass = (amount) => {

        amount = Number(amount || 0);

        if (amount === 0) {
            return "free";
        }

        if (amount <= 200) {
            return "price-200";
        }

        if (amount <= 400) {
            return "price-400";
        }

        if (amount <= 1000) {
            return "price-1000";
        }

        if (amount <= 1399) {
            return "price-1399";
        }

        if (amount <= 1499) {
            return "price-1499";
        }

        return "price-above-1500";

    };

    const isAvailable = (seat) => {

        if (!seat) {
            return false;
        }

        /*
         * Based on your API data:
         * SSR_Status = 1 -> actual available seat
         */

        return Number(seat.status) === 1;

    };

    // =========================================================
    // FINAL SEAT SELECTION FUNCTION
    // =========================================================

    const toggleSeat = (seat) => {

        if (!seat || !isAvailable(seat)) {
            return;
        }

        setSelectedSeats((prev) => {

            const currentSeats = Array.isArray(prev)
                ? prev
                : [];

            let paxId;

            // =================================================
            // 1. PASSENGER TAB SELECTED
            // =================================================

            if (activePassenger !== null) {

                paxId = activePassenger + 1;

            } else {

                // =================================================
                // 2. NO TAB SELECTED
                // AUTOMATICALLY ASSIGN NEXT UNASSIGNED PASSENGER
                // =================================================

                const assignedPaxIds = new Set(
                    currentSeats.map(
                        item => Number(item?.paxId)
                    )
                );

                paxId = null;

                for (let i = 1; i <= requiredSeats; i++) {

                    if (!assignedPaxIds.has(i)) {

                        paxId = i;

                        break;
                    }

                }

                // All passengers already have seats
                if (!paxId) {
                    return currentSeats;
                }

            }

            // =================================================
            // 3. DETERMINE PASSENGER TYPE
            // =================================================

            const adultTotal = Number(adultCount || 0);
            const childTotal = Number(childCount || 0);

            let paxType;
            let passengerType;

            if (paxId <= adultTotal) {

                // Adult = 0
                paxType = 0;
                passengerType = "Adult";

            } else if (
                paxId <= adultTotal + childTotal
            ) {

                // Child = 1
                paxType = 1;
                passengerType = "Child";

            } else {

                // Infant = 2
                paxType = 2;
                passengerType = "Infant";

            }

            // =================================================
            // 4. CHECK APPLICABLE PASSENGER TYPES
            // =================================================

            const applicablePaxTypes = Array.isArray(
                seat?.ApplicablePaxTypes
            )
                ? seat.ApplicablePaxTypes.map(Number)
                : [];

            /*
             * Adult  → 0
             * Child  → 1
             * Infant → 2
             *
             * [0, 1]       → Adult + Child
             * [2]          → Infant only
             * [0, 1, 2]     → Adult + Child + Infant
             */

            if (!applicablePaxTypes.includes(paxType)) {

                console.log(
                    "Seat not allowed for passenger:",
                    {
                        seatId: seat?.id,
                        paxId,
                        paxType,
                        passengerType,
                        applicablePaxTypes
                    }
                );

                showSeatError(
                    `Seat ${seat?.id} is not available for ${passengerType}.`
                );

                return currentSeats;

            }

            // =================================================
            // 5. DO NOT ALLOW SAME SEAT FOR ANOTHER PASSENGER
            // =================================================

            const seatAlreadyUsed = currentSeats.some(
                item =>
                    item?.id === seat?.id &&
                    Number(item?.paxId) !== paxId
            );

            if (seatAlreadyUsed) {
                return currentSeats;
            }

            setSeatError("");

            // =================================================
            // 6. CREATE SELECTED SEAT
            // =================================================

            const selectedSeat = {
                ...seat,
                paxId,
                paxType,
                passengerType
            };

            // =================================================
            // 7. REPLACE ONLY THIS PASSENGER'S PREVIOUS SEAT
            // =================================================

            const updatedSeats = currentSeats.filter(
                item =>
                    Number(item?.paxId) !== paxId
            );

            updatedSeats.push(selectedSeat);

            // =================================================
            // 8. SEND UPDATED SEATS TO PARENT
            // =================================================

            onSeatChange?.(updatedSeats);

            return updatedSeats;

        });

        // DO NOT RESET activePassenger HERE.
        // The selected passenger tab stays active.

    };

    const selectedTotal = safeSelectedSeats.reduce(
        (total, seat) =>
            total + Number(seat?.amount || 0),
        0
    );

    const renderSeat = (row, column) => {

        const seat = getSeat(row, column);

        // No seat at this position
        if (!seat) {

            return (
                <div
                    key={`${row}${column}`}
                    className="seat empty-seat"
                />
            );

        }

        const available = isAvailable(seat);

        const selected = safeSelectedSeats.some(
            item => item?.id === seat.id
        );

        return (
            <button
                key={seat.id}
                type="button"
                disabled={!available}
                onClick={() =>
                    available && toggleSeat(seat)
                }
                title={
                    available
                        ? `${seat.id} - ₹${seat.amount}`
                        : `${seat.id} - Not Available`
                }
                className={`
                    seat
                    ${available
                        ? getPriceClass(seat.amount)
                        : "booked"
                    }
                    ${selected ? "selected" : ""}
                `}
            >
                <span>{seat.column}</span>
            </button>
        );

    };

    const isSeatSelectionComplete =
        safeSelectedSeats.length === requiredSeats;

    useEffect(() => {

        onSeatSelectionComplete?.(
            isSeatSelectionComplete
        );

    }, [
        isSeatSelectionComplete,
        onSeatSelectionComplete
    ]);

    console.log(
        bookingPassengers,
        "bookingPassengers"
    );

    return (
        <div className="page-shell">

            {/* =====================================================
                SELECTION STATUS
            ===================================================== */}

            <div className="passenger-seat-tabs sticky-top d-inline-block">
                {seatError && (
                    <div
                        className="alert alert-warning alert-dismissible fade show mt-2 mb-3"
                        role="alert"
                    >
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {seatError}
                    </div>
                )}

                <span className="seat-select-label">
                    Select seat for:
                </span>

                {Array.from(
                    { length: requiredSeats },
                    (_, index) => {

                        const passengerSeat =
                            safeSelectedSeats.find(
                                seat =>
                                    Number(seat?.paxId) === index + 1
                            );

                        return (
                            <button
                                key={index}
                                type="button"
                                className={`
                                    passenger-seat-tab
                                    btn btn-tour ms-2
                                    ${
                                        activePassenger === index
                                            ? "active"
                                            : ""
                                    }
                                `}
                                onClick={() =>
                                    setActivePassenger(index)
                                }
                            >

                                <span className="pax-label">
                                    {/* Pax {index + 1} - */}
                                    {getPassengerName(index + 1)} -{" "}
                                </span>

                                <span className="pax-seat">
                                    {passengerSeat?.id || "--"}
                                </span>

                            </button>
                        );

                    }
                )}

            </div>

            <div className="selection-status">

                {safeSelectedSeats.length === 0 ? (

                    "No seat selected yet"

                ) : (

                    <>

                        <div className="mt-1">

                            Total Seat Fare:

                            <strong className="ms-1">
                                ₹{selectedTotal}
                            </strong>

                        </div>

                    </>

                )}

            </div>

            {/* =====================================================
                AIRCRAFT
            ===================================================== */}

            <div className="aircraft-wrapper">

                {/* YOUR EXISTING SVG */}
                <svg
                    className="fuselage-bg"
                    viewBox="-150 0 700 1620"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <defs>

                        <linearGradient
                            id="fuselageGrad"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                        >

                            <stop
                                offset="0"
                                stopColor="#e9edf1"
                            />

                            <stop
                                offset="0.5"
                                stopColor="#f8fafc"
                            />

                            <stop
                                offset="1"
                                stopColor="#e2e6eb"
                            />

                        </linearGradient>

                        <linearGradient
                            id="wingGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="0"
                                stopColor="#e3e7eb"
                            />

                            <stop
                                offset="1"
                                stopColor="#ccd2d8"
                            />

                        </linearGradient>

                    </defs>

                    {/* LEFT WING */}

                    <polygon
                        points="30,870 -110,970 -80,1110 30,1060"
                        fill="url(#wingGrad)"
                        stroke="#c3cad1"
                        strokeWidth="2.5"
                    />

                    {/* RIGHT WING */}

                    <polygon
                        points="370,870 510,970 480,1110 370,1060"
                        fill="url(#wingGrad)"
                        stroke="#c3cad1"
                        strokeWidth="2.5"
                    />

                    {/* LEFT ENGINE */}

                    <rect
                        x="-58"
                        y="970"
                        width="34"
                        height="86"
                        rx="14"
                        fill="#d9dee2"
                        stroke="#c3cad1"
                        strokeWidth="2"
                    />

                    {/* RIGHT ENGINE */}

                    <rect
                        x="424"
                        y="970"
                        width="34"
                        height="86"
                        rx="14"
                        fill="#d9dee2"
                        stroke="#c3cad1"
                        strokeWidth="2"
                    />

                    {/* TAIL */}

                    <polygon
                        points="60,1430 -30,1500 10,1540 90,1470"
                        fill="url(#wingGrad)"
                        stroke="#c3cad1"
                        strokeWidth="2"
                    />

                    <polygon
                        points="340,1430 430,1500 390,1540 310,1470"
                        fill="url(#wingGrad)"
                        stroke="#c3cad1"
                        strokeWidth="2"
                    />

                    {/* VERTICAL TAIL */}

                    <path
                        d="M200,1420 C210,1460 235,1500 260,1560 L200,1600 L150,1560 C170,1500 190,1460 200,1420 Z"
                        fill="url(#fuselageGrad)"
                        stroke="#c3cad1"
                        strokeWidth="2.5"
                    />

                    {/* FUSELAGE */}

                    <path
                        d="
                            M200,0
                            C300,0 372,58 372,142
                            L372,1290
                            C372,1385 342,1440 292,1470
                            Q200,1500 108,1470
                            C58,1440 28,1385 28,1290
                            L28,142
                            C28,58 100,0 200,0
                            Z
                        "
                        fill="url(#fuselageGrad)"
                        stroke="#c3cad1"
                        strokeWidth="3"
                    />

                </svg>

                <div className="cabin-content">

                    {/* COCKPIT */}

                    <div className="cockpit-zone">

                        <div className="cockpit-label">
                            Cockpit
                        </div>

                        <div className="door-pill"></div>

                    </div>

                    <div className="cabin-divider">

                        <span className="line"></span>

                        <span className="tag">
                            Front Galley
                        </span>

                        <span className="line"></span>

                    </div>

                    {/* =================================================
                        DYNAMIC SEAT MAP
                    ================================================= */}

                    <div className="seat-map">

                        {rows.map(rowNum => {

                            return (
                                <div
                                    key={rowNum}
                                    className="seat-row"
                                >

                                    {/* LEFT ROW NUMBER */}

                                    <div className="row-num">
                                        {rowNum}
                                    </div>

                                    {/* LEFT A B C */}

                                    {["A", "B", "C"].map(
                                        column =>
                                            renderSeat(
                                                rowNum,
                                                column
                                            )
                                    )}

                                    {/* AISLE */}

                                    <div className="aisle-gap"></div>

                                    {/* RIGHT D E F */}

                                    {["D", "E", "F"].map(
                                        column =>
                                            renderSeat(
                                                rowNum,
                                                column
                                            )
                                    )}

                                    {/* RIGHT ROW NUMBER */}

                                    <div className="row-num spacer">
                                        {rowNum}
                                    </div>

                                </div>
                            );

                        })}

                    </div>

                    <div className="uheiuwrwer">

                        <div className="cabin-divider">

                            <span className="line"></span>

                            <span className="tag">
                                Rear Galley · Lavatory
                            </span>

                            <span className="line"></span>

                        </div>

                        <div className="tail-zone">

                            <div className="cockpit-label">
                                Tail
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================================
                LEGEND
            ===================================================== */}

            <div className="legend">

                <div className="legend-item">
                    <span className="legend-swatch free"></span>
                    <span>Free</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-200"></span>
                    <span>₹1-200</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-400"></span>
                    <span>₹201-400</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-1000"></span>
                    <span>₹401-1000</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-1399"></span>
                    <span>₹1001-1399</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-1499"></span>
                    <span>₹1400-1499</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch price-above-1500"></span>
                    <span>Above ₹1500</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch selected"></span>
                    <span>Selected</span>
                </div>

                <div className="legend-item">
                    <span className="legend-swatch booked"></span>
                    <span>Not Available</span>
                </div>

            </div>

        </div>
    );
};