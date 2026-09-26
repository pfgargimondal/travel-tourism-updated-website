import { useEffect, useState } from "react";
import http from "../../../http";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../component/Loader/Loader";


export const FlightPaymentConfirmation = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || null;
    const [loading, setLoading] = useState(false);
    const [lockTicketDetails, setLockTicketDetails] = useState([]);
    const [flightDetailsShowMoreToggle, setFlightDetailsShowMoreToggle] = useState(false);
    const { bookingReference } = useParams();
    const { user} = useAuth();
    const fareDetailsData = state?.fareDetailsData;

    useEffect(() => {
        const fetchLockTicket = async () => {
            try {
                setLoading(true);
                const response = await http.post("/user/held-tickets", 
                    {
                        user_id: user?.id,
                        bookingReference: bookingReference
                    });
                setLockTicketDetails(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLockTicket();
    }, [bookingReference, user?.id]);

    const createdAt = lockTicketDetails?.created_at;
    const formattedBookingDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        })
    : "-";

    const tempBookingDetails = lockTicketDetails?.temp_booking || null;
    let allFlightDetails = tempBookingDetails?.allFlightDetails || null;

    const bookingDetails = tempBookingDetails?.booking_details || null;

    if (typeof allFlightDetails === "string") {
        try {
            allFlightDetails = JSON.parse(allFlightDetails);
        } catch (error) {
            console.error("Failed to parse allFlightDetails:", error);
            allFlightDetails = null;
        }
    }
    const segments = allFlightDetails?.Segments || [];
    const fares = allFlightDetails?.Fares || [];
    const firstSegment = allFlightDetails?.Segments?.[0];
    const lastSegment = segments[segments.length - 1];

    const flightId = lockTicketDetails?.flight_id;
    const fareId = fares?.[0]?.Fare_Id;

    const travelDate = allFlightDetails?.TravelDate
        ? new Date(allFlightDetails.TravelDate)
        : null;
    const formattedTravelDate =
        travelDate?.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        }) || "";

    // First fare detail
    const fareDetails = fares?.[0]?.FareDetails?.[0] || null;
    // Price
    const totalAmount = fareDetails?.Total_Amount || 0;
    // Duration
    const totalDuration = segments.reduce((total, segment) => {
        const [hours, minutes] = (segment.Duration || "00:00")
            .split(":")
            .map(Number);

        return total + (hours * 60) + minutes;
    }, 0);
    const durationHours = Math.floor(totalDuration / 60);
    const durationMinutes = totalDuration % 60;
    const formattedDuration = `${durationHours}h ${durationMinutes}m`;

    const parseDate = (dateStr) => {
        if (!dateStr) return null;

        const [datePart, timePart] = dateStr.split(" ");
        const [month, day, year] = datePart.split("/");

        return new Date(`${year}-${month}-${day}T${timePart}`);
    };
    // Stops
    const stops = Math.max(segments.length - 1, 0);

    const getOneHourBefore = (dateTime) => {
        if (!dateTime) return "";

        const date = new Date(dateTime.replace(" ", "T"));
        date.setHours(date.getHours() - 1);

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handelPayConfirm = () => {
        navigate(`/flight/reviewDetails/${bookingReference}/${flightId}/${fareId}`, {
            state: {
                fareDetailsData,
            },
        });
    }

    if (loading) return <Loader />;
    return (
        <>
            <style>
                {`
                    .uindjksnuihfsdf li{
                        font-size: 12px;
                        color: var(--blue-primary-color);
                        list-style: none;
                        font-weight: 600;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid var(--border);
                        transition: 0.2s ease-in-out;
                    }

                    .uindjksnuihfsdf li i{
                        color: var(--blue-primary-color);
                        font-size: 12px;
                    }

                    .uindjksnuihfsdf li:hover{
                        background: var(--light-blue-highlighted-background-color);
                        transition: 0.2s ease-in-out;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul{
                        // position: relative;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li{
                        padding-top: 10px;
                        padding-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;   
                        border-bottom: 1px solid var(--border);   
                        list-style: none;     
                        padding-inline: 1rem;    
                        position: relative;         
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li p{
                        font-weight: 600;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child{
                        background: var(--light-green-highlighted-background-color);
                        border-radius: 25px;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child p{
                        color: var(--blue-secondary-color) !important;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul:before{
                        height: 50%;
                        content: "";
                        position: absolute;
                        border: 1px dashed var(--blue-primary-color);
                        left: -3.6%;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    .bdfsdf855e{
                        max-height: 20rem;
                        overflow-y: hidden;
                    }
                    .ubnejhruiwer{
                        max-height: 30rem;
                        overflow-y: auto;
                    }
                        
                    .oijnodijsdef p{
                        color: var(--blue-primary-color) !important;
                        font-weight: 600;
                        cursor: pointer;
                    }

                    .flight-payment-confirmation-wrapper .hotel-card:first-child{
                        border-left: 5px solid var(--blue-primary-color);
                    }

                    .ihsmdcsdcfdf p span{
                        font-size: 30px;
                        color: var(--blue-secondary-color);
                    }

                    .ihsmdcsdcfdf p{
                        font-weight: 600;
                    }

                    .ihsmdcsdcfdf p i{
                        color: var(--main-green-color);
                    }
                        
                    

                    @media only screen and (max-width: 991px){
                        .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child{
                            gap: 5rem;
                        }
                    }


                    @media only screen and (max-width: 600px){
                        .ihsmdcsdcfdf.text-end{
                            text-align: center !important;
                        }

                        .ihsmdcsdcfdf .btn-tour.mb-1{
                            margin-bottom: 1.2rem !important;
                        }

                        .flight-payment-confirmation-wrapper .hotel-card:first-child{
                            text-align: center;
                        }

                        .flight-payment-confirmation-wrapper .hotel-card:first-child .ciuajmcokzxc{
                            justify-content: center;
                        }
                    }

                    @media only screen and (max-width: 393px){
                        .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child {
                            gap: 2rem;
                        }
                    }

                    @media only screen and (max-width: 379px){
                        .flight-payment-confirmation-wrapper .flight-card {
                            width: 334px;
                        }

                        .flight-segments > div{
                            overflow-x: auto;
                        }
                    }     
                        
                    @media only screen and (max-width: 346px){
                        .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child p {
                            font-size: 12px;
                        }
                    }

                    @media only screen and (max-width: 332px){
                        .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child {
                            gap: 1rem;
                        }
                    }
                `}
            </style>

            <div className="sdfsdf655 flight-details-wrapper flight-payment-confirmation-wrapper">
                <div className="container">
                    <div className="asfdgsqwe col-lg-12">
                        <div className="pb-3 row align-items-end">
                            <div className="idnmfser col-lg-9">
                                <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--blue-secondary-color) !important" }} className="mb-1">Ticket is on Hold, Pay to Confirm</p>

                                <h6 style={{ fontSize: "14px" }} className="mb-0">Booking ID {lockTicketDetails?.booking_reference || "-"}</h6>                            
                            </div>

                            <div className="col-lg-3 text-end">
                                <h6 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-0">Booked on {formattedBookingDate}</h6>
                            </div>
                        </div>
                    </div>

                    <div className="fgerfer88 flight-wrppr">
                        <div className="row">
                            {/* Main Content - Left Column */}
                            <div className="col-lg-12">
                                <div className="sdfhgfrfrftr">
                                    <div className="hotel-card">
                                        <div className="card-box">
                                            {/* HEADER */}
                                            <div className="flight-header flex-column pb-3">
                                                <p className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>COMPLETE YOUR BOOKING</p>

                                                <div className="diwehidmsad">
                                                    <p style={{ fontSize: "14px" }} className="mb-0">Your fare is locked. Pay ₹{totalAmount} to confirm this booking before it expires.</p>
                                                </div>
                                            </div>

                                            <div className="insdjifncsidm mt-3">
                                                <div className="row">
                                                    <div className="col-lg-8">
                                                        <div className="ihsmdcsdcfdf">
                                                            <div className="py-2 rounded-2">
                                                                <h6 className="mb-1" style={{ fontSize: "14px" }}>AMOUNT DUE</h6>

                                                                <p className="mb-0" style={{ fontSize: "14px" }}><i className="fa-solid me-1 fa-lock"></i> Price locked at <span>₹{totalAmount}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4">
                                                        <div className="ihsmdcsdcfdf text-end">
                                                            <button className="btn-tour mb-1" onClick={handelPayConfirm} style={{ fontSize: "14px" }}>PAY & CONFIRM BOOKING</button>

                                                            {/* <p style={{ fontSize: "11px" }} className="mb-0">Vouchers will be available after full payment</p> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ciuajmcokzxc d-flex gap-2">
                                                <div className="col-lg-6">
                                                    <ul className="mb-0 ps-0 ms-4">
                                                        {/* <li>
                                                            <p className="mb-0">Fare Lock Charges</p>

                                                            <p className="mb-0">398</p>
                                                        </li> */}

                                                        <li>
                                                            <p className="mb-0">Pay by {getOneHourBefore(lockTicketDetails?.hold_validity)}</p>
                                                            <p className="mb-0">{totalAmount}</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hotel-card mt-3">
                                        <div className="card-box">
                                            {/* HEADER */}
                                            <div className="flight-header mb-3">
                                                <div className="ciuajmcokzxc d-flex gap-2">
                                                    <div>
                                                        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                                            {firstSegment?.Origin_City.replace(/\s*\(.*?\)/g, "")}
                                                            <img
                                                                src="/images/planesmallicon.png"
                                                                width={25}
                                                                alt=""
                                                            />
                                                            {lastSegment?.Destination_City.replace(/\s*\(.*?\)/g, "",)}
                                                        </h5>

                                                        <p className="uineiokee mb-0">
                                                            <i className="bi me-2 bi-calendar3"></i>
                                                            <span>{formattedTravelDate} ·</span>
                                                            <span>
                                                                <span style={{ color: "var(--blue-primary-color)" }}>
                                                                    {" "}
                                                                    {stops === 0
                                                                    ? "Non Stop"
                                                                    : `${stops} Stop`}{" "}
                                                                    ·{" "}
                                                                </span>
                                                                {formattedDuration}
                                                            </span>
                                                        </p>
                                                        <p className="uineiokee mb-0">
                                                            PNR: {lockTicketDetails?.airline_pnr}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SEGMENTS */}
                                            <div className="flight-segments">
                                                {segments?.map((segment, index) => {
                                                    const departure = new Date(
                                                    parseDate(segment.Departure_DateTime),
                                                    );
                                                    const arrival = new Date(
                                                    parseDate(segment.Arrival_DateTime),
                                                    );

                                                    const departureTime = departure.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    });

                                                    const arrivalTime = arrival.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    });

                                                    const totalMinutes = Math.floor(
                                                    (arrival - departure) / (1000 * 60),
                                                    );

                                                    const hours = Math.floor(totalMinutes / 60);
                                                    const minutes = totalMinutes % 60;

                                                    const totalDuration = `${hours}h ${minutes}m`;

                                                    return (
                                                    <div key={index}>
                                                        <div className="flight-card mb-3 py-3 px-2">
                                                            <div className="gfjh55 d-flex align-items-center gap-2 text-start mb-2">
                                                                <img
                                                                    src={`https://images.kiwi.com/airlines/64/${segment.Airline_Code}.png`}
                                                                    width={45}
                                                                    alt=""
                                                                />
                                                                <div className="dihuewoirwerwer">
                                                                    <h6 className="mb-0">{segment.Airline_Name}</h6>
                                                                    <p className="odmlksjfmdf mb-0">
                                                                        {segment.Airline_Code}{" "}
                                                                        {segment.Flight_Number}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="icsnduhh row">
                                                                <div className="time-wrapper d-flex justify-content-between gap-5">
                                                                    <div className="pt-1">
                                                                        <h5 className="mb-1">{departureTime}</h5>
                                                                        <div className="udnehnewr d-flex flex-column">
                                                                            <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                                                                <span>{segment.Origin_City}</span>
                                                                            </p>
                                                                            {segment.Origin_Terminal && (
                                                                                <small
                                                                                style={{
                                                                                    fontWeight: 500,
                                                                                    color:
                                                                                    "var(--light-highlighted-text-color)",
                                                                                }}
                                                                                >
                                                                                Terminal{" "}
                                                                                {segment.Origin_Terminal || "-"}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="duration-wrapper flex-fill text-center">
                                                                        <small className="dyusbnbsdhfc ufsidnfijsdfsdf">
                                                                            <i className="bi bi-clock"></i> {totalDuration}
                                                                        </small>

                                                                        <div className="dinsjihfnsidhfsdf d-flex align-items-center justify-content-center position-relative my-3">
                                                                            <span className="flgt-drtn-circle d-block"></span>
                                                                            <span className="flgt-drtn-line d-block"></span>
                                                                            <span className="flgt-drtn-circle d-block"></span>
                                                                            <div className="dijsenifjsdf hide-ini position-absolute text-center">
                                                                                <i className="bi bi-airplane-engines d-block text-white"></i>
                                                                            </div>
                                                                            <div className="dijsenifjsdf show-ini position-absolute text-center">
                                                                                <i className="bi bi-airplane-engines d-block text-white"></i>
                                                                            </div>
                                                                        </div>

                                                                        <small className="dyusbnbsdhfc px-3 stop-info">
                                                                            {segment.Aircraft_Type}
                                                                        </small>
                                                                    </div>

                                                                    <div className="text-end pt-1">
                                                                        <h5 className="mb-1">{arrivalTime}</h5>
                                                                        <div className="udnehnewr d-flex flex-column">
                                                                            <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                                                                <span>{segment.Destination_City}</span>
                                                                            </p>
                                                                            {segment.Destination_Terminal && (
                                                                                <small
                                                                                style={{
                                                                                    fontWeight: 500,
                                                                                    color:
                                                                                    "var(--light-highlighted-text-color)",
                                                                                }}
                                                                                >
                                                                                Terminal{" "}
                                                                                {segment.Destination_Terminal || "-"}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                     );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Important Information */}
                                    <div className="fgdfgdfg">
                                        <div className="sdfgsdf">
                                            <h5 className="mb-3">
                                            <span className="me-3 text-center">
                                                <i class="fa-solid fa-info"></i>
                                            </span>
                                            Important Information
                                            </h5>
                                        </div>

                                        <div className={flightDetailsShowMoreToggle ? "ubnejhruiwer" : "bdfsdf855e"}>
                                            {fareDetailsData?.status && (
                                            <div className="dfgf555 bg-white py-3">
                                                {/* <div className="sdfsdf text-center rounded-circle">
                                                    <i className="bi bi-suitcase"></i>
                                                </div> */}

                                                {fareDetailsData?.fareDetails?.FareRules?.map(
                                                    (rule, ruleIndex) => (
                                                    <div
                                                        key={ruleIndex}
                                                        className="dfxgbdczdcd position-relative px-3"
                                                        dangerouslySetInnerHTML={{
                                                        __html:
                                                            rule.FareRuleDesc,
                                                        }}
                                                    />
                                                    ),
                                                )}
                                                {/* <div className="dfxgbdczdcd position-relative px-3">
                                                    <h6 className="mb-2">
                                                    Check travel guidelines and baggage information
                                                    below:
                                                    </h6>
                                                    <p className="mb-0">
                                                    Carry no more than 1 check-in baggage and 1 hand
                                                    baggage per passenger. If violated, airline may
                                                    levy extra charges.
                                                    </p>
                                                </div> */}
                                            </div>
                                            )}
                                        </div>

                                        <div className="oijnodijsdef text-end">
                                            <p onClick={() => setFlightDetailsShowMoreToggle(prev => !prev)} className="mb-0">{flightDetailsShowMoreToggle ? "See less" : "...See more"}</p>
                                        </div>
                                    </div>

                                    {/* Traveller Details (static display only) */}
                                    <div className="fgdfgdfg">
                                        <div className="sdfgsdf">
                                            <h5 className="mb-3">Primary Contact Details</h5>
                                        </div>

                                        <div className="bdfsdf855e">
                                            <div className="dfgf555 bg-white py-3">
                                                <div className="dfxgbdczdcd position-relative">
                                                    <h6 className="mb-2">
                                                        This is your primary contact, you can not change it. You can however send the ticket to other emails.
                                                    </h6>

                                                    <p className="mb-0"><b>{bookingDetails?.Passenger_Email ?? user?.email}</b></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Right Column */}
                            {/* <div className="col-lg-3">
                                <div className="sticky-top">
                                    <div className="fgdfgdf mb-3">
                                        <div className="summary overflow-hidden p-0">
                                            <h6 className="mb-0 px-3 py-2">
                                                <i className="bi me-1 bi-wallet"></i> Payment Details
                                            </h6>

                                            <div className="diewnjrjwer p-3 py-0">
                                                <table className="table mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td>UPI</td>
                                                            
                                                            <td>398</td>
                                                        </tr>

                                                        <tr>
                                                            <td className="asdfsdfsdf">Amount Paid</td>
                                                            
                                                            <td>398</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dfdff5585">
                                        <div className="coupon-box">
                                            <div className="hjhjk">
                                                <h6 className="mb-0 px-3 py-2">
                                                    <i className="bi me-1 bi-tags"></i>
                                                    Price Breakup
                                                </h6>

                                                <div className="diewnjrjwer p-3 py-0">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>Price Lock Charge</td>
                                                                
                                                                <td>398</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="asdfsdfsdf">Total Amount</td>
                                                                
                                                                <td>398</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}