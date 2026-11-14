import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";
import "./Css/UserBooking.css";

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

export const UserBooking = () => {
  const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState({ flights: [], hotels: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingType, setBookingType] = useState("flights");
  const [statusFilter, setStatusFilter] = useState("All Bookings");
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
        { "Upcoming": 0, "Completed": 0, "Cancelled": 0, "Pending Payment": 0 }
      ),
    [allBookings]
  );

  const activeBookings = bookings[bookingType].filter((booking) => {
    const status = bookingStatus(booking);
    const matchesStatus =
      statusFilter === "All Bookings" || status === statusFilter;
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
    "All Bookings",
    "Upcoming",
    "Completed",
    "Cancelled",
    "Pending Payment",
  ];

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

            {!loading && !error && (
              <div className="table-footer">
                <div className="table-count">
                  Showing {activeBookings.length} {activeBookings.length === 1 ? "booking" : "bookings"}
                </div>
              </div>
            )}
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
