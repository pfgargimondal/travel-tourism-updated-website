import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";
import "./Css/UserBooking.css";
import Loader from "../../component/Loader/Loader";

const bookingStatus = (booking) => {
  const status = String(
    booking?.booking_status || booking?.status || booking?.payment_status || ""
  ).toLowerCase();

  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("pending") || status.includes("fail") || status.includes("unpaid")) {
    return "Pending Payment";
  }

  const endDate =
    booking?.checkout ||
    booking?.return_date ||
    booking?.arrival_date ||
    booking?.departure_date ||
    booking?.travel_date;
  if (endDate && new Date(endDate).getTime() < Date.now()) return "Completed";

  return "Upcoming";
};

const formatDate = (value) => {
  if (!value) return "Date not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `₹ ${amount.toLocaleString("en-IN")}`
    : "Amount not available";
};

const getBookingName = (booking, type) => {
  if (type === "hotel") {
    return (
      booking?.hotel?.name ||
      booking?.hotel?.hotel_name ||
      booking?.hotel_name ||
      booking?.hotel?.hotel ||
      "Hotel booking"
    );
  }

  return (
    booking?.airline_name ||
    booking?.airline ||
    booking?.flight?.airline_name ||
    booking?.flight?.Airline_Name ||
    "Flight booking"
  );
};

const getBookingLocation = (booking, type) => {
  if (type === "hotel") {
    return (
      booking?.hotel?.address ||
      booking?.hotel?.city ||
      booking?.city ||
      booking?.destination ||
      booking?.hotel_address||
      "Location not available"
    );
  }

  const origin =
    booking?.origin ||
    booking?.from ||
    booking?.flight?.origin ||
    booking?.flight?.Origin;
  const destination =
    booking?.destination ||
    booking?.to ||
    booking?.flight?.destination ||
    booking?.flight?.Destination;

  return origin && destination
    ? `${origin} to ${destination}`
    : destination || origin || "Route not available";
};

const getBookingDate = (booking, type) => {
  if (type === "hotel") {
    return `${formatDate(booking?.checkin || booking?.check_in)} - ${formatDate(
      booking?.checkout || booking?.check_out
    )}`;
  }

  return formatDate(
    booking?.departure_date ||
      booking?.travel_date ||
      booking?.journey_date ||
      booking?.flight?.departure_date
  );
};

const getBookingId = (booking) =>
  booking?.booking_reference ||
  booking?.booking_id ||
  booking?.reference ||
  booking?.id ||
  "Booking reference unavailable";

const getBookingAmount = (booking) =>
  booking?.payable_total ??
  booking?.total_amount ??
  booking?.total_fare ??
  booking?.amount ??
  booking?.final_amount;

const getTravelerCount = (booking) => {
  const passengers = booking?.passengers || booking?.passenger_details;
  if (Array.isArray(passengers)) return passengers.length;

  const adults = Number(booking?.adults || booking?.adult_count || 0);
  const children = Number(booking?.children || booking?.child_count || 0);
  const count = adults + children;
  return count || null;
};

const statusClass = (status) => {
  if (status === "Completed") return "badge-completed";
  if (status === "Cancelled") return "badge-cancelled";
  if (status === "Pending Payment") return "badge-pending-payment";
  return "badge-upcoming";
};


const parseBookingDetails = (ticket) => {
  const details =
    ticket?.temp_booking?.booking_details ||
    ticket?.booking_details;

  if (!details) return {};

  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return {};
    }
  }

  return details;
};

const getHeldFlightSegments = (ticket) => {
  const details = parseBookingDetails(ticket);
  return (
    details?.flight?.Segments ||
    details?.repriceFlight?.Segments ||
    details?.Segments ||
    details?.segments ||
    details?.flight_segments ||
    []
  );
};

// eslint-disable-next-line
const getHeldFlightRoute = (ticket) => {
  const segments = getHeldFlightSegments(ticket);

  if (!segments.length) return "Flight route unavailable";

  const first = segments[0];
  const last = segments[segments.length - 1];

  return `${first.Origin || first.Origin_Code || "Origin"} → ${
    last.Destination || last.Destination_Code || "Destination"
  }`;
};

// eslint-disable-next-line
const getHeldFlightDate = (ticket) => {
  const segments = getHeldFlightSegments(ticket);

  return segments.length
    ? formatDate(segments[0].Departure_DateTime)
    : "Date not available";
};

// eslint-disable-next-line
const getHeldAirline = (ticket) => {
  const segments = getHeldFlightSegments(ticket);

  return (
    segments[0]?.Airline_Name ||
    segments[0]?.Airline_Code ||
    "Airline not available"
  );
};

// eslint-disable-next-line
const getHeldFlightNumber = (ticket) => {
  const segments = getHeldFlightSegments(ticket);

  return segments
    .map((segment) =>
      `${segment.Airline_Code || ""} ${segment.Flight_Number || segment.Flight_No || ""}`.trim()
    )
    .filter(Boolean)
    .join(" • ");
};

// eslint-disable-next-line
const getHeldDeparture = (ticket) => {
  const segments = getHeldFlightSegments(ticket);
  return segments[0]?.Departure_DateTime;
};

// eslint-disable-next-line
const getHeldArrival = (ticket) => {
  const segments = getHeldFlightSegments(ticket);
  return segments[segments.length - 1]?.Arrival_DateTime;
};

// eslint-disable-next-line
const getHeldBookingReference = (ticket) =>
  ticket?.Booking_RefNo ||
  ticket?.booking_reference ||
  ticket?.booking_id ||
  "Reference unavailable";

// eslint-disable-next-line
const getHeldValidity = (ticket) =>
  ticket?.Hold_Validity ||
  ticket?.hold_validity ||
  null;


export const UserBooking = () => {
  const navigate = useNavigate();
  const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState({ flights: [], hotels: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingType, setBookingType] = useState("flights");
  const [statusFilter, setStatusFilter] = useState("Upcoming");
  const [heldTickets, setHeldTickets] = useState([]);
  // const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setBookings({ flights: [], hotels: [] });
      setError("Please sign in to view your bookings.");
      return undefined;
    }

    let isCurrent = true;
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
       const response = await http.post(
          "/user/bookings-history",
          {},
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
              },
          }
      );

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Unable to load your bookings.");
        }

        const data = response.data.data || {};
        if (!isCurrent) return;

        setBookings({
          flights: Array.isArray(data.flight_bookings)
            ? data.flight_bookings
            : Array.isArray(data.flights)
              ? data.flights
              : [],
          hotels: Array.isArray(data.hotel_bookings)
            ? data.hotel_bookings
            : Array.isArray(data.hotels)
              ? data.hotels
              : [],
        });
      } catch (requestError) {
        console.error("Failed to fetch user bookings:", requestError);
        if (isCurrent) {
          setError(
            requestError?.response?.data?.message ||
              requestError.message ||
              "Unable to load your bookings. Please try again."
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !token) {
      setHeldTickets([]);
      return;
    }

    let isCurrent = true;

    const getHeldTickets = async () => {
      try {
        setLoading(true);

        const response = await http.post(
          "/user/held-tickets-list",
          {
            user_id: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response?.data?.success && isCurrent) {

          const responseData = response?.data?.data;

          const tickets = Array.isArray(responseData)
            ? responseData
            : responseData
              ? [responseData]
              : [];

          // Only active HELD tickets
          const activeTickets = tickets.filter(
            (ticket) =>
              String(ticket?.status || "").toUpperCase() === "HELD"
          );

          setHeldTickets(activeTickets);
        }
      } catch (error) {
        console.error("Failed to fetch held tickets:", error);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };
    getHeldTickets();
    return () => {
      isCurrent = false;
    };
  }, [user?.id, token]);

  const allBookings = useMemo(
    () => [
      ...bookings.flights.map((booking) => ({ ...booking, bookingType: "flight" })),
      ...bookings.hotels.map((booking) => ({ ...booking, bookingType: "hotel" })),
    ],
    [bookings]
  );

  const counts = useMemo(
    () =>
      allBookings.reduce(
        (result, booking) => {
          result[bookingStatus(booking)] += 1;
          return result;
        },
        // { "Upcoming": 0, "Completed": 0, "Cancelled": 0, "Pending Payment": 0 }
        { "Completed": 0, "Cancelled": 0, "Pending Payment": 0 }
      ),
    [allBookings]
  );

  const activeBookings = bookings[bookingType].filter((booking) => {
    const status = bookingStatus(booking);
    const matchesStatus =
      statusFilter === "Upcoming" || status === statusFilter;
    const text = [
      getBookingId(booking),
      getBookingName(booking, bookingType === "flights" ? "flight" : "hotel"),
      getBookingLocation(booking, bookingType === "flights" ? "flight" : "hotel"),
    ]
      .join(" ")
      .toLowerCase();

    return matchesStatus && text.includes(search.trim().toLowerCase());
  });

  const statusFilters = [
    // "All Bookings",
    "Upcoming",
    "Completed",
    "Cancelled",
    "Pending Payment",
  ];

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
              "/user/held-tickets",
              {
                  bookingReference: bookingReference,
                  user_id: user.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
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

          const fareDetailsData =
            heldBooking?.temp_booking?.booking_details?.repriceFlight
                ?.Fares?.[0]?.FareDetails;

          navigate(`/flight/personal/booking-hold/${bookingReference}`, {
                state: {
                    fareDetailsData,
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

  return (
    <div className="container">
      <div className="dejnwirwer d-flex">
        <UserSideNavbar
          isResUserNavOpen={isResUserNavOpen}
          setIsResUserNavOpen={setIsResUserNavOpen}
        />

        <div className="main-wrap">
          <div className="stat-cards sefshyeqqeqwe">
            {[
              { label: "Total Bookings", value: allBookings.length, icon: "bi-bag-check-fill", color: "blue" },
              { label: "Upcoming Trips", value: counts.Upcoming, icon: "bi-calendar3-fill", color: "green" },
              { label: "Completed Trips", value: counts.Completed, icon: "bi-check-circle-fill", color: "purple" },
              { label: "Cancelled Trips", value: counts.Cancelled, icon: "bi-x-circle-fill", color: "orange" },
            ].map((card) => (
              <div className="stat-card" key={card.label}>
                <div className="stat-card-top">
                  <div className={`stat-icon ${card.color}`}>
                    <i className={`bi ${card.icon}`} />
                  </div>
                  <div>
                    <div className="stat-label">{card.label}</div>
                    <div className="stat-value">{card.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bookings-card">
            <div className="filter-bar">
              <div className="filter-tab-content">
                <ul className="nav nav-tabs border-0" role="tablist" aria-label="Booking status">
                  {statusFilters.map((filter) => (
                    <li className="nav-item" role="presentation" key={filter}>
                      <button
                        className={`nav-link${statusFilter === filter ? " active" : ""}`}
                        type="button"
                        role="tab"
                        aria-selected={statusFilter === filter}
                        onClick={() => setStatusFilter(filter)}
                      >
                        {filter}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-right">
                <div className="search-wrap">
                  <i className="bi bi-search" />
                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search by booking or destination..."
                    aria-label="Search bookings"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="user-booking-inner-tabs">
              <ul className="nav nav-tabs border-0" role="tablist" aria-label="Booking type">
                {[
                  { key: "flights", label: "Flights" },
                  { key: "hotels", label: "Hotels" },
                ].map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.key}>
                    <button
                      className={`nav-link${bookingType === tab.key ? " active" : ""}`}
                      type="button"
                      role="tab"
                      aria-selected={bookingType === tab.key}
                      onClick={() => setBookingType(tab.key)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {bookingType === "flights" && statusFilter === "Upcoming" ? (

              <div className="held-flight-bookings">
                {heldTickets.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-airplane fs-2 text-muted"></i>
                    <p className="mt-2 mb-0">No held flight tickets found.</p>
                  </div>
                ) : (
                  heldTickets.map((ticket, index) => {
                    const segments = getHeldFlightSegments(ticket);
                    const first = segments[0];
                    const last = segments[segments.length - 1];

                    if (!first || !last) return null;

                    const bookingId =
                      ticket?.Booking_RefNo ||
                      ticket?.booking_reference ||
                      ticket?.booking_id ||
                      ticket?.id;

                    const departure = first?.Departure_DateTime;
                    const arrival = last?.Arrival_DateTime;

                    const origin =
                      first?.Origin || first?.Origin_Code || "N/A";

                    const destination =
                      last?.Destination || last?.Destination_Code || "N/A";

                    const airline =
                      first?.Airline_Name || first?.Airline_Code || "Airline";

                    const flightNumber =
                      `${first?.Airline_Code || ""} ${
                        first?.Flight_Number || first?.Flight_No || ""
                      }`.trim();

                    const holdValidity =
                      ticket?.Hold_Validity || ticket?.hold_validity;

                    const formatFlightTime = (date) => {
                      if (!date) return "Date unavailable";

                      const parsed = new Date(date);

                      if (Number.isNaN(parsed.getTime())) return "Date unavailable";

                      return parsed.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    };

                    return (
                      <div className="held-booking-card" key={bookingId || index}>

                        {/* Header Section */}
                        <div className="held-booking-header">
                          <div className="held-booking-icon">
                            <i className="bi bi-airplane-engines"></i>
                          </div>

                          <div className="held-booking-heading">

                            <div className="held-route-title">
                              <h5>
                                {origin} <i className="bi bi-arrow-right"></i> {destination}
                              </h5>

                              {holdValidity && (
                                <span className="held-booking-validity">
                                  Book Before: {formatFlightTime(holdValidity)}
                                </span>
                              )}
                            </div>

                            <div className="held-booking-reference">
                              <span>One Way Flight</span>
                              <span>•</span>
                              <span>Booking ID - {bookingId}</span>
                            </div>

                          </div>

                          <button type="button"
                            onClick={() => handleContinueBooking(ticket)}
                            className="held-manage-button"
                          >
                            VIEW & MANAGE BOOKING
                          </button>

                        </div>

                        {/* Flight Details Section */}
                        <div className="held-booking-body">

                          {/* From */}
                          <div className="held-location">
                            <span className="held-label">From</span>

                            <strong>{formatFlightTime(departure)}</strong>

                            <div className="held-airport-details">
                              <span>
                                {first?.Origin_Airport_Name || origin}
                              </span>

                              {first?.Departure_Terminal && (
                                <span className="held-terminal">
                                  Terminal {first.Departure_Terminal}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* To */}
                          <div className="held-location">
                            <span className="held-label">To</span>

                            <strong>{formatFlightTime(arrival)}</strong>

                            <div className="held-airport-details">
                              <span>
                                {last?.Destination_Airport_Name || destination}
                              </span>

                              {last?.Arrival_Terminal && (
                                <span className="held-terminal">
                                  Terminal {last.Arrival_Terminal}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Airline */}
                          <div className="held-airline">
                            <i className="bi bi-airplane"></i>

                            <span>
                              {airline} {flightNumber}
                            </span>
                          </div>

                          {/* Book Now */}
                          <button type="button"
                            onClick={() => handleContinueBooking(ticket)}
                            className="held-book-now"
                          >
                            <i className="bi bi-ticket-perforated"></i>
                            Book Now
                          </button>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>{bookingType === "flights" ? "Flight" : "Hotel"}</th>
                      <th>Travel Date</th>
                      <th>Travelers</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">Loading your bookings...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-danger">{error}</td>
                      </tr>
                    ) : activeBookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No {bookingType === "flights" ? "flight" : "hotel"} bookings found.
                        </td>
                      </tr>
                    ) : (
                      activeBookings.map((booking, index) => {
                        const type = bookingType === "flights" ? "flight" : "hotel";
                        const status = bookingStatus(booking);
                        const image =
                          booking?.hotel?.hotel_images?.[0] ||
                          booking?.hotel?.image ||
                          booking?.hotel_image ||
                          booking?.airline_logo ||
                          booking?.flight?.airline_logo;

                        return (
                          <tr key={`${getBookingId(booking)}-${index}`}>
                            <td>
                              <div className="booking-id">{getBookingId(booking)}</div>
                              <div className="booking-date">
                                {formatDate(booking?.created_at || booking?.booking_date)}
                              </div>
                            </td>
                            <td>
                              <div className="pkg-cell">
                                {image ? (
                                  <img className="pkg-img" src={image} alt="" />
                                ) : (
                                  <div className="pkg-img d-flex align-items-center justify-content-center">
                                    <i className={`bi ${type === "hotel" ? "bi-building" : "bi-airplane"}`} />
                                  </div>
                                )}
                                <div>
                                  <div className="pkg-name">{getBookingName(booking, type)}</div>
                                  <div className="pkg-location">{getBookingLocation(booking, type)}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="travel-date">
                                <i className="bi bi-calendar-event" />
                                {getBookingDate(booking, type)}
                              </div>
                            </td>
                            <td>
                              <div className="travelers-cell">
                                <i className="bi bi-people" />
                                {getTravelerCount(booking) || "Not available"}
                              </div>
                            </td>
                            <td>
                              <div className="amount-cell">{formatAmount(getBookingAmount(booking))}</div>
                            </td>
                            <td>
                              <span className={`badge-status ${statusClass(status)}`}>{status}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* {!loading && !error && (
              <div className="table-footer">
                <div className="table-count">
                  Showing {activeBookings.length} {activeBookings.length === 1 ? "booking" : "bookings"}
                </div>
              </div>
            )} */}
          </div>

          <div className="help-bar">
            <div className="help-left">
              <div className="help-avatar">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Support Agent"
                />
              </div>
              <div>
                <div className="help-title">Need Help?</div>
                <div className="help-sub">Our support team is here to help you 24/7</div>
              </div>
            </div>
            <Link to="/contact-us" className="btn btn-tour">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
