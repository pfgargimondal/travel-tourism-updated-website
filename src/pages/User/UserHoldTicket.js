import { useCallback, useEffect, useState } from "react";
import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";
import "./Css/UserHoldTicket.css";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader/Loader";


export const UserHoldTicket = () => {

    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [heldTickets, setHeldTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    const getHeldTickets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await http.post(
                "/user/held-tickets",
                {
                    user_id: user?.id,
                }
            );
            if (response?.data?.success) {
                const tickets = response?.data?.data || [];
                // Only active HELD tickets
                const activeTickets = tickets.filter(
                    (ticket) =>
                        ticket?.status === "HELD"
                );
                setHeldTickets(activeTickets);
            }
        } catch (error) {
            console.error(
                "Failed to fetch held tickets:",
                error
            );
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            getHeldTickets();
        }
    }, [user?.id, getHeldTickets]);


    const handleContinueBooking = async (ticket) => {
        try {
            const bookingReference =
                ticket?.booking_reference;
            if (!bookingReference) {
                alert(
                    "Booking reference not found."
                );
                return;
            }
            const response = await http.post(
                "/user/held-ticket",
                {
                    booking_reference:
                        bookingReference,
                }
            );

            if (!response?.data?.success) {
                alert(
                    response?.data?.message ||
                    "Unable to continue booking."
                );
                return;
            }

            const heldBooking =
                response?.data?.data;

            navigate("/complete-held-booking", {
                state: {
                    heldBooking: heldBooking,
                },
            });

        } catch (error) {
            console.error(
                "Continue booking failed:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to continue booking."
            );
        }
    };


    if (loading) return <Loader />;


    if (!heldTickets.length) {
        return (
            <div className="held-tickets-page">

                <div className="held-tickets-header">
                    <h2>
                        My Held Bookings
                    </h2>

                    <p>
                        Tickets you have held will
                        appear here.
                    </p>
                </div>

                <div className="no-held-tickets">

                    <div className="no-held-icon">
                        ✈
                    </div>

                    <h4>
                        No Held Bookings
                    </h4>

                    <p>
                        You don't have any active
                        held tickets right now.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/flights")
                        }
                    >
                        Search Flights
                    </button>

                </div>

            </div>
        );
    }



  return (
    <div className="container">
      <div className="dejnwirwer d-flex">
        <UserSideNavbar isResUserNavOpen={isResUserNavOpen} setIsResUserNavOpen={setIsResUserNavOpen} />
        {/* ══════════ MAIN ══════════ */}
        <div className="main-wrap">
          <div className="held-tickets-page">
            <div className="held-tickets-header">

                <div>
                    <h2>
                        My Held Bookings
                    </h2>

                    <p>
                        Complete your booking before
                        the hold expires.
                    </p>
                </div>

                <div className="held-count">
                    {heldTickets.length}
                    <span>
                        Active Hold
                        {heldTickets.length > 1
                            ? "s"
                            : ""}
                    </span>
                </div>

            </div>
            <div className="held-ticket-list">

                {heldTickets.map((ticket) => (

                    <HeldTicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onContinue={
                            handleContinueBooking
                        }
                    />

                ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| Ticket Card
|--------------------------------------------------------------------------
*/

const HeldTicketCard = ({
    ticket,
    onContinue,
}) => {
  const getRemainingTime = () => {

      if (!ticket?.hold_validity) {
          return null;
      }

      const expiry = new Date(
          ticket.hold_validity
      );

      const now = new Date();

      const difference =
          expiry.getTime() -
          now.getTime();

      if (difference <= 0) {
          return {
              expired: true,
              text: "Expired",
          };
      }

      const totalMinutes =
          Math.floor(
              difference / 60000
          );

      const hours =
          Math.floor(
              totalMinutes / 60
          );

      const minutes =
          totalMinutes % 60;

      if (hours > 24) {

          const days =
              Math.floor(hours / 24);

          const remainingHours =
              hours % 24;

          return {
              expired: false,
              text:
                  `${days}d ${remainingHours}h left`,
          };
      }

      return {
          expired: false,
          text:
              `${hours}h ${minutes}m left`,
      };
  };
  const remainingTime =
      getRemainingTime();
  const expiryDate = ticket?.hold_validity
      ? new Date(ticket.hold_validity)
      : null;
  const formattedExpiry =
      expiryDate
          ? expiryDate.toLocaleString(
              "en-IN",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
              }
          )
          : "N/A";
  return (
      <div className="held-ticket-card">

          {/* Top */}

          <div className="held-card-top">

              <div className="airline-info">

                  <div className="airline-icon">
                      ✈
                  </div>

                  <div>
                      <span className="airline-name">
                          {ticket?.airline_code === "6E"
                              ? "IndiGo"
                              : ticket?.airline_code ||
                                "Airline"}
                      </span>

                      <small>
                          {ticket?.airline_code}
                      </small>
                  </div>

              </div>

              <div className="held-badge">
                  <span />
                  HELD
              </div>

          </div>

          {/* Booking details */}

          <div className="held-booking-info">

              <div className="booking-detail">

                  <span>
                      Booking Reference
                  </span>

                  <strong>
                      {ticket?.booking_reference}
                  </strong>

              </div>

              <div className="booking-detail">

                  <span>
                      Airline PNR
                  </span>

                  <strong>
                      {ticket?.airline_pnr || "—"}
                  </strong>

              </div>

          </div>

          {/* Expiry */}

          <div
              className={`hold-expiry ${
                  remainingTime?.expired
                      ? "expired"
                      : ""
              }`}
          >

              <div className="expiry-left">

                  <span className="expiry-label">
                      Hold expires
                  </span>

                  <strong>
                      {formattedExpiry}
                  </strong>

              </div>

              <div className="expiry-time">
                  {remainingTime?.text}
              </div>

          </div>

          {/* Footer */}

          <div className="held-card-footer">

              <span className="flight-id">
                  Flight ID:{" "}
                  {ticket?.flight_id}
              </span>

              {!remainingTime?.expired ? (

                  <button
                      className="continue-booking-btn"
                      onClick={() =>
                          onContinue(ticket)
                      }
                  >
                      Continue Booking
                      <span>
                          →
                      </span>
                  </button>

              ) : (

                  <button
                      className="expired-btn"
                      disabled
                  >
                      Hold Expired
                  </button>

              )}

          </div>

      </div>
  );
};