import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import "./ThankYou.css";



export const ThankYou = () => {
    const [loading, setLoading] = useState(false);

    const pathName = useLocation().pathname;
    const location = useLocation();

    const {
        ticketResponse = {},
    } = location.state || {};


    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pathName]);



    return (
        <>
            {loading && <Loader/>}
        
            <section className="thank-you-page">
                <div className="thank-you-card">
                    <div className="success-animation">
                        <div className="circle">
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
                        </div>
                    </div>

                    <h1>Booking Confirmed!</h1>

                        <p>
                            Your flight has been booked successfully. Thank you for choosing us
                            for your journey.
                        </p>

                        <div className="booking-confirmation-box">

                            <div className="booking-label">
                                Booking Reference
                            </div>

                            <div className="booking-reference">
                                {ticketResponse?.Booking_RefNo}
                            </div>

                            <p className="mb-0">
                                Your ticket details and booking information are available below.
                            </p>
                    </div>
                    <div className="thank-you-buttons d-flex align-items-center justify-content-center gap-3">

                            <Link to="/">
                                <button className="btn btn-tour">
                                    Back To Home
                                </button>
                            </Link>

                            <Link
                                to="/my-bookings"
                                className="contact-btn"
                            >
                                View Booking
                            </Link>

                        </div>
                </div>
            </section>
        </>
    )
}
