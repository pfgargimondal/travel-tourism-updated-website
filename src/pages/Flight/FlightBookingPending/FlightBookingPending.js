import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./FlightBookingPending.css";

const POLL_INTERVAL_SECONDS = 30;

export const FlightBookingPending = () => {
  const location = useLocation();

  const state = location.state || {};

  const {
    bookingReference,
    paymentResponse,
    bookingStatus,
    bookingMessage,
    errorCode,
    errorInnerException,
  } = state;

  // =====================================================
  // PAYMENT AMOUNT
  // =====================================================

  const paidAmount =
    paymentResponse?.amount ||
    paymentResponse?.Amount ||
    paymentResponse?.data?.amount ||
    paymentResponse?.data?.Amount ||
    "";


  // =====================================================
  // PAGE TYPE
  // =====================================================

  const isTicketingFailed =
    bookingStatus === "ticketing_failed" ||
    errorCode === "0009";


  const isPaymentPending =
    bookingStatus === "payment_pending" ||
    errorCode === "0046";


  // =====================================================
  // TITLE
  // =====================================================

  let title = "Booking Under Process";

  if (isTicketingFailed) {
    title = "Ticketing Failed";
  }

  // =====================================================
  // MESSAGE
  // =====================================================

  let message =
    bookingMessage ||
    "Your booking is currently being processed. Please wait while we verify your ticket.";

  if (isPaymentPending) {
    message =
      "Your payment has been received and your booking is currently being processed. Please do not make another payment.";
  }

  if (isTicketingFailed) {
    message =
      "Your ticket request could not be completed with the airline. Please contact our support team with your booking reference.";
  }


  // =====================================================
  // COPY BOOKING REFERENCE
  // =====================================================

  const [copied, setCopied] = useState(false);

  const handleCopyReference = async () => {
    if (!bookingReference) return;

    try {
      await navigator.clipboard.writeText(bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — fail silently, reference is still visible on screen
    }
  };


  // =====================================================
  // LIVE STATUS COUNTDOWN
  // (purely a UI cue — wire this up to your real status-poll
  // call when one is available)
  // =====================================================

  const [secondsToNextCheck, setSecondsToNextCheck] = useState(
    POLL_INTERVAL_SECONDS
  );

  useEffect(() => {
    if (isTicketingFailed) return;

    if (secondsToNextCheck <= 0) {
      // TODO: replace with the real booking-status polling call
      setSecondsToNextCheck(POLL_INTERVAL_SECONDS);
      return;
    }

    const timer = setTimeout(
      () => setSecondsToNextCheck((s) => s - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [secondsToNextCheck, isTicketingFailed]);


  return (
    <div className="booking-status-page">

      <div className="booking-status-card">

        {/* ================================================= */}
        {/* ICON */}
        {/* ================================================= */}

        <div
          className={`booking-status-icon ${
            isTicketingFailed ? "failed" : "pending"
          }`}
        >
          {isTicketingFailed ? "!" : "✓"}
        </div>


        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <h1>{title}</h1>


        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        <p className="booking-status-message">
          {message}
        </p>


        {/* ================================================= */}
        {/* LIVE STATUS STRIP */}
        {/* ================================================= */}

        <div className="status-strip">
          <div className="status-track">
            <div
              className={`status-track-fill ${
                isTicketingFailed ? "failed" : ""
              }`}
            />
          </div>
          <div className="status-strip-labels">
            <span className="done">Booked</span>
            <span className={isTicketingFailed ? "failed" : "active"}>
              {isTicketingFailed ? "Not confirmed" : "Confirming"}
            </span>
            <span className="upcoming">Confirmed</span>
          </div>
        </div>


        {/* ================================================= */}
        {/* BOOKING REFERENCE */}
        {/* ================================================= */}

        {bookingReference && (
          <div className="booking-reference-box">

            <span>Booking Reference</span>

            <div className="reference-value-row">
              <strong>{bookingReference}</strong>

              <button
                type="button"
                className="copy-btn"
                onClick={handleCopyReference}
                aria-label="Copy booking reference"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* PAYMENT DETAILS */}
        {/* ================================================= */}

        <div className="booking-details">

          {paidAmount && (
            <div className="booking-detail-row">
              <span>Amount Paid</span>

              <strong>
                ₹{Number(paidAmount).toLocaleString("en-IN")}
              </strong>
            </div>
          )}


          <div className="booking-detail-row">
            <span>Status</span>

            <strong
              className={
                isTicketingFailed
                  ? "status-failed"
                  : "status-pending"
              }
            >
              {isTicketingFailed
                ? "Ticketing Failed"
                : "Processing"}
            </strong>
          </div>


          {errorCode && (
            <div className="booking-detail-row">
              <span>Reference Code</span>

              <strong>{errorCode}</strong>
            </div>
          )}

        </div>


        {/* ================================================= */}
        {/* IMPORTANT MESSAGE */}
        {/* ================================================= */}

        {!isTicketingFailed && (
          <div className="important-message">

            <strong>Please do not make another payment.</strong>

            <p>
              Your booking is already being processed. If you
              need assistance, please contact our support team
              and provide your booking reference.
            </p>

            <div className="poll-indicator">
              <span className="poll-dot" />
              Rechecking status in {secondsToNextCheck}s
            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* SUPPORT */}
        {/* ================================================= */}

        <div className="booking-actions">

          <Link
            to="/contact-us"
            className="btn btn-support"
          >
            Contact Support
          </Link> 


          <Link
            to="/"
            className="btn btn-tour"
          >
            Back To Home
          </Link>

        </div>


        {/* ================================================= */}
        {/* ERROR DETAILS - OPTIONAL */}
        {/* ================================================= */}

        {isTicketingFailed && errorInnerException && (
          <div className="technical-message">
            <small>
              Please mention reference <strong>{bookingReference}</strong>{" "}
              when contacting support.
            </small>
          </div>
        )}

      </div>

    </div>
  );
};
