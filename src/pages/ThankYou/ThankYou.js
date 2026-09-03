import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import "./ThankYou.css";

const CONFETTI_COLORS = ["#2F5FE0", "#D98A2B", "#1B8A5A", "#0E1B33", "#C6453B"];

export const ThankYou = () => {
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    // =====================================================
    // GET DATA FROM NAVIGATION STATE
    // =====================================================

    let {
        ticketResponse,
        bookingReference,
        bookingStatus,
        bookingMessage,
        // paymentResponse,
    } = location.state || {};


    // =====================================================
    // FALLBACK TO SESSION STORAGE
    // =====================================================

    if (!bookingStatus || !bookingReference) {
        try {
            const savedBooking = sessionStorage.getItem(
                "flightBookingConfirmation"
            );

            if (savedBooking) {
                const parsedBooking = JSON.parse(savedBooking);

                ticketResponse =
                    ticketResponse || parsedBooking?.ticketResponse;

                bookingReference =
                    bookingReference || parsedBooking?.bookingReference;

                bookingStatus =
                    bookingStatus || parsedBooking?.bookingStatus;

                bookingMessage =
                    bookingMessage || parsedBooking?.bookingMessage;

                // paymentResponse =
                //     paymentResponse || parsedBooking?.paymentResponse;
            }
        } catch (error) {
            console.error(
                "Unable to read booking confirmation:",
                error
            );
        }
    }


    // =====================================================
    // TICKETING RESPONSE
    // =====================================================

    const ticketData =
        ticketResponse?.data || {};

    const airlinePNRDetails =
        ticketData?.AirlinePNRDetails || [];

    const responseHeader =
        ticketData?.Response_Header || {};

    const errorCode =
        String(responseHeader?.Error_Code || "");


    // =====================================================
    // DETERMINE FINAL STATUS
    // =====================================================

    const isConfirmed =
        bookingStatus === "confirmed" &&
        errorCode === "0000" &&
        airlinePNRDetails.length > 0;

    const isPaymentPending =
        bookingStatus === "payment_pending" ||
        errorCode === "0046";

    const isTicketingFailed =
        bookingStatus === "ticketing_failed" ||
        errorCode === "0009";


    // =====================================================
    // LOADER
    // =====================================================

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);


    // =====================================================
    // GET PNR
    // =====================================================

    const airlinePNR =
        airlinePNRDetails?.[0]?.Airline_PNR ||
        airlinePNRDetails?.[0]?.AirlinePNR ||
        airlinePNRDetails?.[0]?.PNR ||
        airlinePNRDetails?.[0]?.airlinePNR ||
        "";


    // =====================================================
    // PAGE CONTENT
    // =====================================================

    let title = "Your Booking is Being Processed";

    let message =
        bookingMessage ||
        "Your booking request is currently being processed. Please do not make another payment";

    let iconType = "pending";


    // -----------------------------------------------------
    // CONFIRMED
    // -----------------------------------------------------

    if (isConfirmed) {
        title = "Booking Confirmed!";

        message =
            "Your flight has been booked successfully. Thank you for choosing us for your journey.";

        iconType = "success";
    }


    // -----------------------------------------------------
    // PAYMENT PENDING
    // -----------------------------------------------------

    else if (isPaymentPending) {
        title = "Booking Under Process";

        message =
            "Your payment has been received and your booking is currently being processed. Please do not make another payment.";

        iconType = "pending";
    }


    // -----------------------------------------------------
    // TICKETING FAILED
    // -----------------------------------------------------

    else if (isTicketingFailed) {
        title = "Ticketing Failed";

        message =
            bookingMessage ||
            "Your ticket request could not be completed with the airline. Please contact our support team with your booking reference.";

        iconType = "failed";
    }


    // =====================================================
    // CONFETTI (confirmed bookings only)
    // =====================================================

    const confettiPieces = useMemo(() => {
        if (!isConfirmed) return [];

        return Array.from({ length: 28 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            duration: 2.2 + Math.random() * 1.4,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            rotate: Math.round(Math.random() * 360),
            size: 6 + Math.round(Math.random() * 5),
        }));
    }, [isConfirmed]);


    // =====================================================
    // COPY TO CLIPBOARD
    // =====================================================

    const [copiedField, setCopiedField] = useState("");

    const handleCopy = async (value, field) => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(""), 2000);
        } catch {
            // clipboard access denied — value is still visible on screen
        }
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {loading && <Loader />}

            <section className="thank-you-page">

                <div className="thank-you-card">

                    {/* ================================================= */}
                    {/* CONFETTI */}
                    {/* ================================================= */}

                    {confettiPieces.length > 0 && (
                        <div className="confetti-layer" aria-hidden="true">
                            {confettiPieces.map((piece) => (
                                <span
                                    key={piece.id}
                                    className="confetti-piece"
                                    style={{
                                        left: `${piece.left}%`,
                                        backgroundColor: piece.color,
                                        width: `${piece.size}px`,
                                        height: `${piece.size * 0.4}px`,
                                        animationDelay: `${piece.delay}s`,
                                        animationDuration: `${piece.duration}s`,
                                        transform: `rotate(${piece.rotate}deg)`,
                                    }}
                                />
                            ))}
                        </div>
                    )}


                    {/* ================================================= */}
                    {/* STATUS ICON */}
                    {/* ================================================= */}

                    <div className={`success-animation ${iconType}`}>

                        <div className="circle">

                            {iconType === "success" && (
                                <svg
                                    viewBox="0 0 52 52"
                                    className="checkmark"
                                >
                                    <circle
                                        className="checkmark-circle"
                                        cx="26"
                                        cy="26"
                                        r="25"
                                        fill="none"
                                    />

                                    <path
                                        className="checkmark-check"
                                        fill="none"
                                        d="M14 27l7 7 17-17"
                                    />
                                </svg>
                            )}


                            {iconType === "pending" && (
                                <span className="status-icon">
                                    ⏳
                                </span>
                            )}


                            {iconType === "failed" && (
                                <span className="status-icon">
                                    !
                                </span>
                            )}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TITLE */}
                    {/* ================================================= */}

                    <h1>{title}</h1>


                    {/* ================================================= */}
                    {/* MESSAGE */}
                    {/* ================================================= */}

                    <p>
                        {message}
                    </p>


                    {/* ================================================= */}
                    {/* BOOKING REFERENCE */}
                    {/* ================================================= */}

                    {bookingReference && (
                        <div className="booking-confirmation-box">

                            <div className="booking-label">
                                Booking Reference
                            </div>

                            <div className="booking-value-row">
                                <strong className="booking-reference">
                                    {bookingReference}
                                </strong>

                                <button
                                    type="button"
                                    className="copy-btn"
                                    onClick={() =>
                                        handleCopy(bookingReference, "reference")
                                    }
                                >
                                    {copiedField === "reference" ? "Copied" : "Copy"}
                                </button>
                            </div>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* CONFIRMED BOOKING */}
                    {/* ================================================= */}

                    {isConfirmed && (
                        <div className="booking-details-box">

                            {airlinePNR && (
                                <div className="booking-detail">

                                    <span>
                                        Airline PNR
                                    </span>

                                    <span className="booking-value-row">
                                        <strong>
                                            {airlinePNR}
                                        </strong>

                                        <button
                                            type="button"
                                            className="copy-btn"
                                            onClick={() =>
                                                handleCopy(airlinePNR, "pnr")
                                            }
                                        >
                                            {copiedField === "pnr" ? "Copied" : "Copy"}
                                        </button>
                                    </span>

                                </div>
                            )}

                            <div className="booking-detail">

                                <span>
                                    Booking Status
                                </span>

                                <strong className="confirmed-status">
                                    Confirmed
                                </strong>

                            </div>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* PENDING MESSAGE */}
                    {/* ================================================= */}

                    {isPaymentPending && (
                        <div className="booking-info pending-info">

                            <strong>
                                Please do not make another payment.
                            </strong>

                            <p>
                                Your booking is already being
                                processed. If you need assistance,
                                please contact our support team
                                using your booking reference.
                            </p>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* FAILED MESSAGE */}
                    {/* ================================================= */}

                    {isTicketingFailed && (
                        <div className="booking-info failed-info">

                            <strong>
                                Need assistance?
                            </strong>

                            <p>
                                Please contact our support team
                                and provide your booking reference.
                                Our team will check the booking
                                status with the airline.
                            </p>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* BUTTONS */}
                    {/* ================================================= */}

                    <div className="thank-you-buttons d-flex align-items-center justify-content-center gap-3">

                        <Link to="/">
                            <button className="btn btn-tour">
                                Back To Home
                            </button>
                        </Link>


                        {isConfirmed && (
                            <Link
                                to="/my-bookings"
                                className="contact-btn"
                            >
                                View Booking
                            </Link>
                        )}


                        {!isConfirmed && (
                            <Link
                                to="/contact-us"
                                className="btn btn-tour"
                            >
                                Contact Support
                            </Link>
                        )}

                    </div>

                </div>

            </section>
        </>
    );
};