import { FollowUsInstagram } from "../../../component/FollowUsInstagram/FollowUsInstagram";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Slider } from "@mui/material";

import http from "../../../http";
import Loader from "../../../component/Loader/Loader";
import { useFlightFilters } from "../../../context/FlightFilterContext";

import "./FlightFilter.css";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";






const getTimeInMinutes = (dateTime) => {
  if (!dateTime) return null;

  const timePart = dateTime.split(" ")[1];

  if (!timePart) return null;

  const [hours, minutes] = timePart.split(":").map(Number);

  return hours * 60 + minutes;
};

const matchesTimeSlot = (minutes, selectedSlots) => {
  // No time filter selected = allow everything
  if (selectedSlots.length === 0) {
    return true;
  }

  if (minutes === null) {
    return false;
  }

  return selectedSlots.some((slot) => {
    switch (slot) {
      case "BEFORE_6AM":
        return minutes < 6 * 60;

      case "6AM_12PM":
        return minutes >= 6 * 60 && minutes < 12 * 60;

      case "12PM_6PM":
        return minutes >= 12 * 60 && minutes < 18 * 60;

      case "AFTER_6PM":
        return minutes >= 18 * 60;

      default:
        return false;
    }
  });
};

const getAdultFare = (flight) => {
  return flight?.Fares?.flatMap(
    (fare) => fare?.FareDetails || []
  ).find((detail) => detail?.PAX_Type === 0);
};

const getFlightPrice = (flight) => {
  const adultFare = getAdultFare(flight);

  return Number(adultFare?.Total_Amount || 0);
};

const isFlightRefundable = (flight) => {
  return flight?.Fares?.some((fare) =>
    fare?.FareDetails?.some(
      (detail) =>
        detail?.PAX_Type === 0 &&
        detail?.Refundable === true
    )
  );
};

const isSameDayArrival = (flight) => {
  const firstSegment = flight?.Segments?.[0];

  const lastSegment =
    flight?.Segments?.[flight?.Segments?.length - 1];

  if (!firstSegment || !lastSegment) {
    return false;
  }

  const departureDate =
    firstSegment.Departure_DateTime?.split(" ")[0];

  const arrivalDate =
    lastSegment.Arrival_DateTime?.split(" ")[0];

  return departureDate === arrivalDate;
};




export const FlightFilter = () => {
  const [searchParams] = useSearchParams();
  const [flightList, setFlightsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [fareApiData, setFareApiData] = useState({});
  const [airportList, setAirportList] = useState([]);
  const [fareRules, setFareRules] = useState(null);
  const [flightFilterResToggle, setFlightFilterResToggle] = useState(false);
  const [resFilterToggle, setResFilterToggle] = useState(false);
  // eslint-disable-next-line
  const [value, setValue] = useState([6115, 43746]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // clicking the same column again flips direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      // clicking a new column defaults to ascending
      return { key, direction: 'asc' };
    });
  }; 

  const { filters, toggleStop, toggleFarePolicy, setPriceRange, toggleDepartureTime, toggleArrivalTime, toggleAirline, toggleOtherFilter, setSelectedDate, resetFilters } = useFlightFilters();

  const allFlights = useMemo(() => {
    return (
      flightList?.TripDetails?.flatMap(
        (trip) => trip?.Flights || []
      ) || []
    );
  }, [flightList]);

  const parseFlightDateTime = (dateTime) => {
    if (!dateTime) return null;

    const [datePart, timePart] = dateTime.split(" ");
    if (!datePart || !timePart) return null;

    const [month, day, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // returns a real millisecond timestamp, not just minutes-in-day
    return new Date(year, month - 1, day, hours, minutes).getTime();
  };

  const getTotalDurationMinutes = (flight) => {
    const segments = flight?.Segments || [];

    return segments.reduce((total, segment) => {
      if (!segment?.Duration) return total;

      const [hours, minutes] = segment.Duration.split(":").map(Number);
      return total + (hours * 60 + minutes);
    }, 0);
  };

  const isSameDate = (dateTimeStr, targetDate) => {
    if (!dateTimeStr || !targetDate) return true; // no date selected = don't filter anything out

    const datePart = dateTimeStr.split(" ")[0]; // "MM/DD/YYYY"
    const [month, day, year] = datePart.split("/").map(Number);

    const target = new Date(targetDate);

    return (
      month === target.getMonth() + 1 &&
      day === target.getDate() &&
      year === target.getFullYear()
    );
  };

  const filteredFlights = useMemo(() => {
    const result = allFlights.filter((flight) => {
      const segments = flight?.Segments || [];

      if (!segments.length) {
        return false;
      }

      const firstSegment = segments[0];

      const lastSegment = segments[segments.length - 1];

      /*
      ==========================================
      1. STOPS
      ==========================================
      */

      const stopCount = Math.max(segments.length - 1, 0);

      const stopMatches =
        filters.stops.length === 0 ||
        filters.stops.some((stop) => {
          switch (stop) {
            case "NON_STOP":
              return stopCount === 0;

            case "1_CHANGE":
              return stopCount === 1;

            default:
              return false;
          }
        });

      if (!stopMatches) {
        return false;
      }


      /*
      ==========================================
      2. FARE POLICY
      ==========================================
      */

      const farePolicyMatches =
        filters.farePolicy.length === 0 ||
        filters.farePolicy.some((policy) => {
          if (policy === "REFUNDABLE") {
            return isFlightRefundable(flight);
          }

          if (policy === "NON_REFUNDABLE") {
            return !isFlightRefundable(flight);
          }

          return false;
        });

      if (!farePolicyMatches) {
        return false;
      }


      /*
      ==========================================
      3. PRICE RANGE
      ==========================================
      */

      const price = getFlightPrice(flight);

      const priceMatches =
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1];

      if (!priceMatches) {
        return false;
      }


      /*
      ==========================================
      4. DEPARTURE TIME
      ==========================================
      */

      const departureMinutes = getTimeInMinutes(
        firstSegment.Departure_DateTime
      );

      const departureMatches = matchesTimeSlot(
        departureMinutes,
        filters.departureTime
      );

      if (!departureMatches) {
        return false;
      }


      /*
      ==========================================
      5. ARRIVAL TIME
      ==========================================
      */

      const arrivalMinutes = getTimeInMinutes(
        lastSegment.Arrival_DateTime
      );

      const arrivalMatches = matchesTimeSlot(
        arrivalMinutes,
        filters.arrivalTime
      );

      if (!arrivalMatches) {
        return false;
      }


      /*
      ==========================================
      6. OTHER FILTERS
      ==========================================
      */

      const othersMatch =
        filters.others.length === 0 ||
        filters.others.every((option) => {
          switch (option) {
            case "SAME_DAY_ARRIVAL":
              return isSameDayArrival(flight);

            default:
              return true;
          }
        });

      if (!othersMatch) {
        return false;
      }

      /*
      ==========================================
      7. AIRLINES
      ==========================================
      */

      const airlineMatches =
        filters.airlines.length === 0 ||
        filters.airlines.includes(flight.Airline_Code);

      if (!airlineMatches) {
        return false;
      }

      /*
      ==========================================
      8. SELECTED DATE
      ==========================================
      */

      const dateMatches =
        !filters.selectedDate ||
        isSameDate(firstSegment.Departure_DateTime, filters.selectedDate);

      if (!dateMatches) {
        return false;
      }


      /*
      ==========================================
      FLIGHT PASSES ALL FILTERS
      ==========================================
      */

      return true;
    });

    return result.sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.key) {
        case 'Airline': {
          const nameA = a.Segments[0]?.Airline_Name || "";
          const nameB = b.Segments[0]?.Airline_Name || "";
          return nameA.localeCompare(nameB) * dir;
        }

        case 'Departure': {
          const tsA = parseFlightDateTime(a.Segments[0]?.Departure_DateTime) ?? 0;
          const tsB = parseFlightDateTime(b.Segments[0]?.Departure_DateTime) ?? 0;
          return (tsA - tsB) * dir;
        }

        case 'Duration': {
          const durationA = getTotalDurationMinutes(a);
          const durationB = getTotalDurationMinutes(b);
          return (durationA - durationB) * dir;
        }

        case 'Arrival': {
          const lastA = a.Segments[a.Segments.length - 1];
          const lastB = b.Segments[b.Segments.length - 1];
          const tsA = parseFlightDateTime(lastA?.Arrival_DateTime) ?? 0;
          const tsB = parseFlightDateTime(lastB?.Arrival_DateTime) ?? 0;
          return (tsA - tsB) * dir;
        }

        case 'Price': {
          return (getFlightPrice(a) - getFlightPrice(b)) * dir;
        }

        default:
          return 0; // no sort applied
      }
    });
  }, [
    allFlights,
    filters.stops,
    filters.farePolicy,
    filters.priceRange,
    filters.departureTime,
    filters.arrivalTime,
    filters.airlines,
    filters.others,
    filters.selectedDate,
    sortConfig
  ]);


  // useEffect(() => {
  //   const html = document.querySelector("html");

  //   if (html.classList.contains("overflow-hidden")) {
  //     html.classList.remove("overflow-hidden");
  //   } else {
  //     html.classList.add("overflow-hidden");
  //   }
  // }, [resFilterToggle]);

  const handleFareRules = (id) => {
    setFareRules(fareRules === id ? null : id);
  };

  const navigate = useNavigate();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const infants = searchParams.get("infants");
  const tripType = searchParams.get("tripType");
  const travelType = searchParams.get("travelType");
  const cabinClass = searchParams.get("cabinClass");

  const [selectedOrigin, setSelectedOrigin] = useState(origin || "");
  const [selectedDestination, setSelectedDestination] = useState(
    destination || "",
  );
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(
    departureDate || "",
  );
  const [selectedReturnDate, setSelectedReturnDate] = useState(
    returnDate || "",
  );

  const [adultCount, setAdultCount] = useState(Number(adults) || 1);
  const [childrenCount, setChildrenCount] = useState(Number(children) || 0);
  const [infantCount, setInfantCount] = useState(Number(infants) || 0);

  const [selectedCabinClass, setSelectedCabinClass] = useState(
    cabinClass || "0",
  );
  // eslint-disable-next-line
  const [selectedTripType, setSelectedTripType] = useState(tripType || "0");
  const [flightDrpdwn, setFlightDrpdwn] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const payload = {
          origin,
          destination,
          departureDate,
          returnDate,
          adults,
          children,
          infants,
          tripType,
          travelType,
          cabinClass,
        };
        const response = await http.post("/flight-search", payload);
        setFlightsList(response.data.flightList);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchFlights();
  }, [
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    tripType,
    travelType,
    cabinClass,
  ]);
    

  useEffect(() => {
    const fetchAirportList = async () => {
      try {
        const response = await http.get("/get-airport-list");

        if (response.data.status) {
          setAirportList(response.data.airportList || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAirportList();
  }, []);

  const origins = [
    ...new Map(
      airportList.map((item) => [
        item.origin,
        {
          code: item.origin,
          details: item.origin_details,
        },
      ]),
    ).values(),
  ];

  const destinations = [
    ...new Map(
      airportList
        .filter((item) => item.origin === selectedOrigin)
        .map((item) => [
          item.destination,
          {
            code: item.destination,
            details: item.destination_details,
          },
        ]),
    ).values(),
  ];

  const selectedOriginDetails = origins.find(
    (item) => item.code === selectedOrigin,
  );

  const selectedDestinationDetails = destinations.find(
    (item) => item.code === selectedDestination,
  );

  // eslint-disable-next-line
  const formatFlightDate = (dateTime) => {
    const [datePart] = dateTime.split(" ");
    const [month, day, year] = datePart.split("/");

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleFlightFareDetails = (flight) => {
    setSelectedFlight(flight);
    setShowFareModal(true);
  };

  useEffect(() => {
    const fetchFareData = async () => {
      if (!selectedFlight?.Fares?.length) return;
      try {
        const responses = await Promise.all(
          selectedFlight.Fares.map(async (fare) => {
            const fareId = fare.Fare_Id;
            const response = await http.post("/flight-fare-details", {
              fare_id: fareId,
              search_key: flightList.Search_Key,
              Flight_Key: selectedFlight.Flight_Key,
            });
            return {
              fareId,
              data: response.data,
            };
          }),
        );
        const mappedData = {};
        responses.forEach((item) => {
          mappedData[item.fareId] = item.data;
        });
        setFareApiData(mappedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFareData();
  }, [selectedFlight, flightList.Search_Key]);

  // eslint-disable-next-line
  const handleFlightDetails = (flight, search_key, fareId, apiFareDetails) => {
    const state = {
      flight,
      search_key,
      fareId,
      adults,
      children,
      infants,
      cabinClass,
      apiFareDetails,
    };

    sessionStorage.setItem(
      `flightDetails_${flight.Flight_Id}`,
      JSON.stringify(state),
    );

    window.open(`/flight-details/${flight.Flight_Id}`, "_blank");
  };

  const adultIncrease = () => {
    setAdultCount((prev) => prev + 1);
  };

  const adultDecrease = () => {
    setAdultCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChildrenCount = (type) => {
    if (type === "increase") {
      setChildrenCount((prev) => prev + 1);
    } else {
      setChildrenCount((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleInfantCount = (type) => {
    if (type === "increase") {
      setInfantCount((prev) => prev + 1);
    } else {
      setInfantCount((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleSearchFlight = () => {
    const formatDate = (date) => {
      if (!date) return "";

      const d = new Date(date);

      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const params = new URLSearchParams({
      origin: selectedOrigin,
      destination: selectedDestination,
      departureDate: formatDate(selectedDepartureDate),
      returnDate: formatDate(selectedReturnDate),
      adults: adultCount,
      children: childrenCount,
      infants: infantCount,
      tripType: selectedTripType,
      travelType,
      cabinClass: selectedCabinClass,
    });

    navigate(`/flight-filter?${params.toString()}`);
  };

  const handleSwap = () => {
    if (!selectedOrigin || !selectedDestination) return;

    const origin = selectedOrigin;
    const destination = selectedDestination;

    setSelectedOrigin(destination);
    setSelectedDestination(origin);
  };

  // const airlineCounts = useMemo(() => {
  //   const airlineMap = {};

  //   filteredFlights.forEach((flight) => {
  //     const segment = flight?.Segments?.[0];

  //     const airlineCode =
  //       segment?.Airline_Code || flight?.Airline_Code;

  //     const airlineName =
  //       segment?.Airline_Name || airlineCode;

  //     if (!airlineCode) {
  //       return;
  //     }

  //     if (!airlineMap[airlineCode]) {
  //       airlineMap[airlineCode] = {
  //         airlineCode,
  //         airlineName,
  //         count: 0,
  //       };
  //     }

  //     airlineMap[airlineCode].count += 1;
  //   });

  //   return Object.values(airlineMap);
  // }, [filteredFlights]);


  const cabinClassMap = {
    "0": "Economy",
    "3": "Premium Economy",
    "1": "Business",
    "2": "First Class",
  };


  const dates = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    
    return date;
  });


  if (loading) return <Loader />;

  return (
    <div>
      <div className="sdfsdf655 djinsdjkncv">
        {/* <!-- ================= FLIGHT SEARCH SECTION ================= --> */}
        <section className="menu-section srch-filtr-wrpper">
          {window.innerWidth <= 600 && (
            <>
              <div className="disnikjfisdf my-3">
                <div className="container">
                  <div className="duinushducsdc bg-white p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fvgdfvd">
                        <div className="docmosdfsdf">
                          <h4 className="mb-1">
                            {selectedOriginDetails?.details?.city} -{" "}
                            {selectedDestinationDetails?.details?.city}
                          </h4>

                          <p className="mb-0">16 Jul | 1 Adult | Economy</p>
                        </div>
                      </div>

                      <div className="bgujhgb">
                        <div className="docmosdfsdf">
                          <span
                            className="d-flex flex-column align-items-center gap-1"
                            onClick={() =>
                              setFlightFilterResToggle((prev) => !prev)
                            }
                          >
                            <i className="fa-solid fa-pencil"></i> Edit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${flightFilterResToggle ? "flight-filtr-responsve-backdrop" : "flight-filtr-responsve-backdrop flight-filtr-responsve-backdrop-hide"} position-fixed start-0 top-0 bottom-0 end-0`}
              ></div>
            </>
          )}

          <div
            className={`${flightFilterResToggle ? "xvbzcnvxbdvffg xvbzcnvxbdvffg-show" : "xvbzcnvxbdvffg"}`}
          >
            {window.innerWidth <= 600 && (
              <div className="jdhbjejndkjwerewr d-flex align-items-center justify-content-between position-relative text-center p-3">
                <h5 className="mb-0">Modify Flight Search</h5>

                <i
                  onClick={() => setFlightFilterResToggle(false)}
                  className="fa-solid fa-xmark"
                ></i>
              </div>
            )}

            <div className="flight-main-card p-0">
              <div className="flight-content-area">
                <div className="flight-trip-type">
                  <div className="container d-flex align-items-center">
                    <div className="checkbox-wrapper-15 me-4 py-2">
                      <input
                        className="inp-cbx"
                        id="cbx-15"
                        name="flight"
                        type="radio"
                        style={{ display: "none" }}
                      />

                      <label className="cbx" htmlFor="cbx-15">
                        <span className="iucfjsdccsd">
                          <i className="bi bi-airplane"></i>
                        </span>

                        <span className="knkjsdfsdfged">One Way</span>
                      </label>
                    </div>

                    <div className="checkbox-wrapper-15 mx-4 py-2">
                      <input
                        className="inp-cbx"
                        id="cbx-16"
                        name="flight"
                        type="radio"
                        style={{ display: "none" }}
                      />

                      <label className="cbx" htmlFor="cbx-16">
                        <span className="iucfjsdccsd">
                          <i className="bi bi-arrow-repeat"></i>
                        </span>

                        <span className="knkjsdfsdfged">Round Trip</span>
                      </label>
                    </div>

                    <div className="checkbox-wrapper-15 ms-4 py-2">
                      <input
                        className="inp-cbx"
                        id="cbx-17"
                        name="flight"
                        type="radio"
                        style={{ display: "none" }}
                      />

                      <label className="cbx" htmlFor="cbx-17">
                        <span className="iucfjsdccsd">
                          <i className="fa-solid fa-spinner"></i>
                        </span>

                        <span className="knkjsdfsdfged">Multi City</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="diauhsdlfskogf py-4">
                  <div className="container">
                    <div className="form row">
                      <div className="col-lg-10">
                        <div className="row mb-4">
                          <div className="col-lg-5">
                            <div className="row">
                              <div className="col-md-5 col-5">
                                <label className="form-label">
                                  Departure From
                                </label>

                                <select
                                  className="form-control"
                                  value={selectedOrigin}
                                  onChange={(e) => {
                                    setSelectedOrigin(e.target.value);
                                    setSelectedDestination("");
                                  }}
                                >
                                  <option value="">Select Origin</option>

                                  {origins.map((origin, index) => (
                                    <option key={index} value={origin.code}>
                                      {origin.details
                                        ? `${origin.code} - ${origin.details.city}, ${origin.details.country} - ${origin.details.airport_name}`
                                        : origin.code}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-md-2 col-2 text-center res-btwn-crcl">
                                <div
                                  className="circle"
                                  onClick={handleSwap}
                                  style={{
                                    cursor: "pointer",
                                    marginTop: "25px",
                                  }}
                                >
                                  <i className="fa-solid fa-right-left"></i>
                                </div>
                              </div>

                              <div className="col-md-5 col-5">
                                <div className="ps-3">
                                  <label className="form-label">Going To</label>

                                  <select
                                    className="form-control"
                                    value={selectedDestination}
                                    onChange={(e) =>
                                      setSelectedDestination(e.target.value)
                                    }
                                    disabled={!selectedOrigin}
                                  >
                                    <option value="">Select Destination</option>

                                    {destinations.map((destination, index) => (
                                      <option
                                        key={index}
                                        value={destination.code}
                                      >
                                        {destination.details
                                          ? `${destination.code} - ${destination.details.city}, ${destination.details.country} - ${destination.details.airport_name}`
                                          : destination.code}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-7">
                            <div className="row dnfggfshgjhfghdff">
                              <div className="col-md-4 col-md-4 col-sm-6 col-6">
                                <label className="form-label">
                                  Departure Date
                                </label>

                                <DatePicker
                                  selected={
                                    selectedDepartureDate
                                      ? new Date(selectedDepartureDate)
                                      : null
                                  }
                                  onChange={(date) =>
                                    setSelectedDepartureDate(date)
                                  }
                                  minDate={new Date()}
                                  dateFormat="dd MMM yyyy"
                                  className="form-control"
                                />
                              </div>

                              <div className="col-md-4 col-md-4 col-sm-6 col-6">
                                <label className="form-label">
                                  Return Date
                                </label>

                                <DatePicker
                                  selected={
                                    selectedReturnDate
                                      ? new Date(selectedReturnDate)
                                      : null
                                  }
                                  onChange={(date) =>
                                    setSelectedReturnDate(date)
                                  }
                                  minDate={new Date()}
                                  dateFormat="dd MMM yyyy"
                                  className="form-control"
                                />
                              </div>

                              <div className="col-md-4 col-md-4 col-sm-6 col-6 position-relative">
                                <label className="form-label">
                                  Travellers & Class
                                </label>

                                {/* <div className="form-control hotel-input" */}
                                {/* onClick={() => setFlightDrpdwn(prev => !prev)} */}
                                {/* > */}
                                {/* {adultCount} Adult{adultCount > 1 ? "s" : ""} •{" "} */}
                                {/* {childrenCount} Child{childrenCount > 0 ? "ren" : ""} */}
                                {/* {infantCount} Infant{infantCount > 0 ? "s" : ""} */}
                                {/* </div> */}

                                <div
                                  className="form-control hotel-input vdxbfcsffff"
                                  onClick={() =>
                                    setFlightDrpdwn((prev) => !prev)
                                  }
                                >
                                  {adultCount} Adult{adultCount > 1 ? "s" : ""}{" "}
                                  • {childrenCount} Child • {infantCount} Infant
                                </div>

                                {flightDrpdwn && (
                                  <div className="rg-drpdwn dfghdgfsfee position-absolute p-4 rounded-2 bg-white">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <div className="diweirkwer d-flex flex-column">
                                        <p className="mb-0 dnfreqer">Adults</p>

                                        <span>12+ Years</span>
                                      </div>

                                      <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                        <button
                                          type="button"
                                          onClick={adultDecrease}
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-dash-lg"></i>
                                        </button>

                                        <input
                                          type="number"
                                          value={adultCount}
                                          placeholder="1"
                                          className="form-control"
                                        />

                                        <button
                                          type="button"
                                          onClick={adultIncrease}
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-plus-lg"></i>
                                        </button>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <div className="diweirkwer d-flex flex-column">
                                        <p className="mb-0 dnfreqer">
                                          Children
                                        </p>

                                        <span>2 - 12 Years</span>
                                      </div>

                                      <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleChildrenCount("decrease")
                                          }
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-dash-lg"></i>
                                        </button>

                                        <input
                                          type="number"
                                          value={childrenCount}
                                          className="form-control"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleChildrenCount("increase")
                                          }
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-plus-lg"></i>
                                        </button>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <div className="diweirkwer d-flex flex-column">
                                        <p className="mb-0 dnfreqer">Infant</p>

                                        <span>0 - 2 Years</span>
                                      </div>

                                      <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleInfantCount("decrease")
                                          }
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-dash-lg"></i>
                                        </button>

                                        <input
                                          type="number"
                                          value={infantCount}
                                          placeholder="1"
                                          className="form-control"
                                        />

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleInfantCount("increase")
                                          }
                                          className="btn-transparent"
                                        >
                                          <i className="bi bi-plus-lg"></i>
                                        </button>
                                      </div>
                                    </div>

                                    <div className="doeiwjrpwere">
                                      <div className="checkbox-wrapper-15">
                                        <input
                                          className="inp-cbx"
                                          id="cbx-16c"
                                          name="flightad"
                                          type="radio"
                                          style={{ display: "none" }}
                                          checked={selectedCabinClass === "0"}
                                          onChange={() =>
                                            setSelectedCabinClass("0")
                                          }
                                          // onChange={() => setCabinClass("0")}
                                        />

                                        <label
                                          className="cbx"
                                          htmlFor="cbx-16c"
                                        >
                                          <span>
                                            <svg
                                              width="12px"
                                              height="9px"
                                              viewBox="0 0 12 9"
                                            >
                                              <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                          </span>
                                          <span>Economy</span>
                                        </label>
                                      </div>

                                      <div className="checkbox-wrapper-15">
                                        <input
                                          className="inp-cbx"
                                          id="cbx-16n"
                                          name="flightad"
                                          type="radio"
                                          style={{ display: "none" }}
                                          checked={selectedCabinClass === "3"}
                                          onChange={() =>
                                            setSelectedCabinClass("3")
                                          }
                                          // onChange={() => setCabinClass("3")}
                                        />

                                        <label
                                          className="cbx"
                                          htmlFor="cbx-16n"
                                        >
                                          <span>
                                            <svg
                                              width="12px"
                                              height="9px"
                                              viewBox="0 0 12 9"
                                            >
                                              <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                          </span>
                                          <span>Premium Economy</span>
                                        </label>
                                      </div>

                                      <div className="checkbox-wrapper-15">
                                        <input
                                          className="inp-cbx"
                                          id="cbx-16j"
                                          name="flightad"
                                          type="radio"
                                          style={{ display: "none" }}
                                          checked={selectedCabinClass === "1"}
                                          onChange={() =>
                                            setSelectedCabinClass("1")
                                          }
                                          // onChange={() => setCabinClass("1")}
                                        />

                                        <label
                                          className="cbx"
                                          htmlFor="cbx-16j"
                                        >
                                          <span>
                                            <svg
                                              width="12px"
                                              height="9px"
                                              viewBox="0 0 12 9"
                                            >
                                              <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                          </span>
                                          <span>Business</span>
                                        </label>
                                      </div>

                                      <div className="checkbox-wrapper-15">
                                        <input
                                          className="inp-cbx"
                                          id="cbx-16i"
                                          name="flightad"
                                          type="radio"
                                          style={{ display: "none" }}
                                          checked={selectedCabinClass === "2"}
                                          onChange={() =>
                                            setSelectedCabinClass("2")
                                          }
                                          // onChange={() => setCabinClass("2")}
                                        />

                                        <label
                                          className="cbx"
                                          htmlFor="cbx-16i"
                                        >
                                          <span>
                                            <svg
                                              width="12px"
                                              height="9px"
                                              viewBox="0 0 12 9"
                                            >
                                              <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                          </span>
                                          <span>First Class</span>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="text-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFlightDrpdwn(false);
                                          handleSearchFlight();
                                        }}
                                        className="btn btn-tour mt-3"
                                      >
                                        APPLY
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <h6 className="mb-3">
                            <b>SPECIAL FARES</b>
                          </h6>

                          <div className="d-flex gap-2 flex-wrap dfkmkdf">
                            <div className="asdfhgjhhghgf">
                              <input
                                className="inp-cbx"
                                id="cbx-lh"
                                name="aghfhrr"
                                type="radio"
                                style={{ display: "none" }}
                              />

                              <label className="cbx" htmlFor="cbx-lh">
                                <span>Regular</span>
                              </label>
                            </div>

                            <div className="asdfhgjhhghgf">
                              <input
                                className="inp-cbx"
                                id="cbx-ku"
                                name="aghfhrr"
                                type="radio"
                                style={{ display: "none" }}
                              />

                              <label className="cbx" htmlFor="cbx-ku">
                                <span>Student</span>
                              </label>
                            </div>

                            <div className="asdfhgjhhghgf">
                              <input
                                className="inp-cbx"
                                id="cbx-kh"
                                name="aghfhrr"
                                type="radio"
                                style={{ display: "none" }}
                              />

                              <label className="cbx" htmlFor="cbx-kh">
                                <span>Armed Forces</span>
                              </label>
                            </div>

                            <div className="asdfhgjhhghgf">
                              <input
                                className="inp-cbx"
                                id="cbx-gd"
                                name="aghfhrr"
                                type="radio"
                                style={{ display: "none" }}
                              />

                              <label className="cbx" htmlFor="cbx-gd">
                                <span>Senior Citizen</span>
                              </label>
                            </div>

                            <div className="asdfhgjhhghgf">
                              <input
                                className="inp-cbx"
                                id="cbx-asd"
                                name="aghfhrr"
                                type="radio"
                                style={{ display: "none" }}
                              />

                              <label className="cbx" htmlFor="cbx-asd">
                                <span>Doctor & Nurses</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2">
                        <button
                          className="searchbt"
                          onClick={handleSearchFlight}
                        >
                          Search Flight
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="cdsnxfggfsD pt-3">
          <div className="container">
            <div className="airlines-row">
                {airlineCounts.map((airline) => (
                  <div
                    className="airline-item"
                    key={airline.airlineCode}
                  >
                    <img
                        src={`https://images.kiwi.com/airlines/64/${airline.airlineCode}.png`}
                        className="airline-logo"
                        alt={airline.airlineName}
                        onError={(e) => {
                          e.target.src = "./images/indigo.png";
                        }}
                      />
                    <div>
                      <h6>{airline.airlineName}</h6>
                      <p>
                        {airline.count} {airline.count === 1 ? "Flight" : "Flights"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section> */}

        <section className="flight-results-section py-5">
          <div className="container">
            <div className="row g-4">
              {/* <!-- ================= LEFT FILTER SIDEBAR ================= --> */}
              <div className="col-lg-3 jiksnzjisd pe-0">
                {window.innerWidth <= 991 && (
                  <div
                    onClick={() => setResFilterToggle(false)}
                    className={`${resFilterToggle ? "filter-card-res-backdrop" : "filter-card-res-backdrop filter-card-res-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 end-0 bottom-0`}
                  ></div>
                )}

                <div className="filter-card sticky-top">
                  <div
                    onClick={() => setResFilterToggle((prev) => !prev)}
                    className="filter-header d-flex justify-content-between align-items-center mb-1 pb-2"
                  >
                    <h5 className="mb-0">
                      <i className="fa-solid d-none me-1 fa-sliders"></i>{" "}
                      Filters
                    </h5>

                    <div onClick={(e) => { e.stopPropagation(); resetFilters() }} className="reset-link">
                      <i className="fa-solid fa-arrow-rotate-left"></i>{" "}
                      Reset
                    </div>
                  </div>

                  <div
                    className={
                      resFilterToggle
                        ? "disennksjhkf"
                        : "disennksjhkf disennksjhkf-hide"
                    }
                  >
                    {window.innerWidth <= 991 && (
                      <div className="dimodjhiuhsdf d-flex align-items-center justify-content-between p-3">
                        <h5 className="mb-0">Filter</h5>

                        <div onClick={(e) => { e.stopPropagation(); resetFilters() }} className="reset-link">
                          <i className="fa-solid fa-arrow-rotate-left"></i>{" "}
                          Reset
                        </div>
                      </div>
                    )}

                    <div className={`${window.innerWidth <= 991 ? 'px-3 pt-3' : ''} dijnsihfsdlf`}>
                      {/* Stops */}
                      <div className="flight-filter-box flht-fltr-wrapper mt-0">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">Stops</span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="flight-filter-content">
                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="NON_STOP"
                                  checked={filters.stops.includes('NON_STOP')}
                                  onChange={() => toggleStop('NON_STOP')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg
                                    aria-hidden="true"
                                    className="icon-checkbox"
                                    width="28px"
                                    height="28px"
                                    viewBox="0 0 28 28"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper">Non-Stop</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="1_CHANGE"
                                  checked={filters.stops.includes('1_CHANGE')}
                                  onChange={() => toggleStop('1_CHANGE')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg
                                    aria-hidden="true"
                                    className="icon-checkbox"
                                    width="28px"
                                    height="28px"
                                    viewBox="0 0 28 28"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper">1 Change</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fare Policy */}
                      <div className="flight-filter-box flht-fltr-wrapper">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">Fare Policy</span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="flight-filter-content">
                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="NON_REFUNDABLE"
                                  checked={filters.farePolicy.includes('NON_REFUNDABLE')}
                                  onChange={() => toggleFarePolicy('NON_REFUNDABLE')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg
                                    aria-hidden="true"
                                    className="icon-checkbox"
                                    width="28px"
                                    height="28px"
                                    viewBox="0 0 28 28"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper">Non Refundable</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="REFUNDABLE"
                                  checked={filters.farePolicy.includes('REFUNDABLE')}
                                  onChange={() => toggleFarePolicy('REFUNDABLE')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg
                                    aria-hidden="true"
                                    className="icon-checkbox"
                                    width="28px"
                                    height="28px"
                                    viewBox="0 0 28 28"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper">Refundable</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fare Policy */}
                      <div className="flight-filter-box flht-fltr-wrapper">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">Search By Airlines</span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="flight-filter-content">
                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="SG"
                                  checked={filters.airlines.includes('SG')}
                                  onChange={() => toggleAirline('SG')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper"><img src="/images/SG.svg" alt="" /> SpiceJet</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="QP"
                                  checked={filters.airlines.includes('QP')}
                                  onChange={() => toggleAirline('QP')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper"><img src="/images/QP.svg" alt="" /> Akasa Air</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="IX"
                                  checked={filters.airlines.includes('IX')}
                                  onChange={() => toggleAirline('IX')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper"><img src="/images/IX.svg" alt="" /> Air India Express</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="AI"
                                  checked={filters.airlines.includes('AI')}
                                  onChange={() => toggleAirline('AI')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper"><img src="/images/AI.svg" alt="" /> Air India</p>
                              </label>
                            </div>
                          </div>

                          <div className="form-check suggested-item ps-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="6E"
                                  checked={filters.airlines.includes('6E')}
                                  onChange={() => toggleAirline('6E')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg aria-hidden="true" className="icon-checkbox" width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper"><img src="/images/6E.svg" alt="" /> IndiGo</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="flight-filter-box flht-fltr-wrapper">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">Price Range</span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="flight-filter-content">
                          <div className="price-filter">
                            <Slider
                              value={filters.priceRange}
                              min={0}
                              max={50000}
                              onChange={(e, newValue) => setPriceRange(newValue)}
                              valueLabelDisplay="off"
                            />
                            <div className="price-values">
                              <span>₹ {filters.priceRange[0].toLocaleString('en-IN')}</span>
                              <span>₹ {filters.priceRange[1].toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Departure Time */}
                      <div className="flight-filter-box flht-fltr-wrapper">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">
                              Departure Time <span>(BOM)</span>
                            </span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="uidnkmomkfsdf d-flex align-items-center gap-1 my-2">
                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="departure"
                              checked={filters.departureTime.includes('BEFORE_6AM')}
                              onChange={() => toggleDepartureTime('BEFORE_6AM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/dfrr.png" alt="" />
                            <p className="mb-0">Before <br /> 6 AM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="departure"
                              checked={filters.departureTime.includes('6AM_12PM')}
                              onChange={() => toggleDepartureTime('6AM_12PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/afternoon.png" alt="" />
                            <p className="mb-0">6 AM - <br /> 12 PM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="departure"
                              checked={filters.departureTime.includes('12PM_6PM')}
                              onChange={() => toggleDepartureTime('12PM_6PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/evening.png" alt="" />
                            <p className="mb-0">12 PM - <br /> 6 PM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="departure"
                              checked={filters.departureTime.includes('AFTER_6PM')}
                              onChange={() => toggleDepartureTime('AFTER_6PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/night.png" alt="" />
                            <p className="mb-0">After <br /> 6 PM</p>
                          </label>
                        </div>
                      </div>

                      {/* Arrival Time */}
                      <div className="flight-filter-box flht-fltr-wrapper">
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">
                              Arrival Time <span>(DEL)</span>
                            </span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="uidnkmomkfsdf d-flex align-items-center gap-1 my-2">
                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="arrival"
                              checked={filters.arrivalTime.includes('BEFORE_6AM')}
                              onChange={() => toggleArrivalTime('BEFORE_6AM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/dfrr.png" alt="" />
                            <p className="mb-0">Before <br /> 6 AM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="arrival"
                              checked={filters.arrivalTime.includes('6AM_12PM')}
                              onChange={() => toggleArrivalTime('6AM_12PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/afternoon.png" alt="" />
                            <p className="mb-0">6 AM - <br /> 12 PM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="arrival"
                              checked={filters.arrivalTime.includes('12PM_6PM')}
                              onChange={() => toggleArrivalTime('12PM_6PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/evening.png" alt="" />
                            <p className="mb-0">12 PM - <br /> 6 PM</p>
                          </label>

                          <label className="nihnuidnuiwehrwer">
                            <input
                              type="checkbox"
                              name="arrival"
                              checked={filters.arrivalTime.includes('AFTER_6PM')}
                              onChange={() => toggleArrivalTime('AFTER_6PM')}
                              className="d-none position-absolute"
                            />
                            <img src="/images/night.png" alt="" />
                            <p className="mb-0">After <br /> 6 PM</p>
                          </label>
                        </div>
                      </div>

                      {/* Others */}
                      <div className="flight-filter-box flht-fltr-wrapper" style={{ borderBottom: 0 }}>
                        <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                          <div className="flight-filter-left">
                            <span className="flight-filter-title">Others</span>
                          </div>
                          <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                        </div>

                        <div className="flight-filter-content">
                          <div className="form-check suggested-item ps-0 mb-0">
                            <div className="checkbox-wrapper-33">
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  value="SAME_DAY_ARRIVAL"
                                  checked={filters.others.includes('SAME_DAY_ARRIVAL')}
                                  onChange={() => toggleOtherFilter('SAME_DAY_ARRIVAL')}
                                  className="checkbox__trigger visuallyhidden"
                                />
                                <span className="checkbox__symbol">
                                  <svg
                                    aria-hidden="true"
                                    className="icon-checkbox"
                                    width="28px"
                                    height="28px"
                                    viewBox="0 0 28 28"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M4 14l8 7L24 7" />
                                  </svg>
                                </span>
                                <p className="checkbox__textwrapper">Same Day Arrival</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- ================= RIGHT SIDE GOES HERE ================= --> */}
              <div className="col-lg-9">
                <div className="ajhfbmuihehee d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">
                    {filteredFlights.length} Flights
                    Found on Your Search
                  </h5>

                  <div className="sort-area">
                    <p className="mb-0">Sort By :</p>

                    <select>
                      <option>Recommended</option>
                      <option>Lowest Price</option>
                      <option>Fastest</option>
                    </select>
                  </div>
                </div>

                <div className="save-banner mb-4">
                  <span>
                    Save an average of 15% on thousands of flights when you're
                    signed in
                  </span>
                  <button className="sign-btn">Sign In</button>
                </div>

                <div className="dubyasyufsdf sgsdgsfzsdf position-relative mb-3">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={7}
                    navigation
                    pagination={false}
                    loop={false}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      992: {
                        slidesPerView: 7,
                      },
                    }}
                  >
                    {dates.map((date, index) => {
                      const inputId = `date-${index}`;
                      const isSelected = Boolean(
                        filters.selectedDate &&
                        date.toDateString() === new Date(filters.selectedDate).toDateString()
                      );

                      return (
                        <SwiperSlide key={index}>
                          <label
                            htmlFor={inputId}
                            className="doihimfdsf d-flex flex-column align-items-center gap-1 position-relative px-2 py-1"
                          >
                            <input
                              id={inputId}
                              type="radio"
                              name="fdgdsvfv"
                              className="d-none position-absolute"
                              checked={isSelected}
                              onChange={() => setSelectedDate(date)}
                            />

                            <p className="mb-0">
                              {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </label>
                        </SwiperSlide>
                      )
                    })}                    
                  </Swiper>
                </div>

                <div className="dubyasyufsdf mb-3 p-1">
                  <div className="col-lg-10">
                    <table className="table mb-0">
                      <tbody>
                        <tr className="text-center">
                          <th className={`text-start ${(sortConfig.key === "Airline") ? "active" : ""}`} onClick={() => handleSort('Airline')}>
                            <img src="/images/flightdas.png" alt="" /> Airline <i className={`bi ${(sortConfig.direction === "desc") ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                          </th>

                          <th className={`text-start ${(sortConfig.key === "Departure") ? "active" : ""}`} onClick={() => handleSort('Departure')}>
                            <img src="/images/airplane.png" alt="" />{" "}
                            <span style={{ position: "relative", zIndex: 999 }}>
                              Departure  <i className={`bi ${(sortConfig.direction === "desc") ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                            </span>
                          </th>

                          <th className={`text-start ${(sortConfig.key === "Duration") ? "active" : ""}`} onClick={() => handleSort('Duration')}>
                            <img src="/images/repeat.png" alt="" /> Duration <i className={`bi ${(sortConfig.direction === "desc") ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                          </th>

                          <th className={`text-start ${(sortConfig.key === "Arrival") ? "active" : ""}`} onClick={() => handleSort('Arrival')}>
                            <img src="/images/airplane.png" alt="" />{" "}
                            <span style={{ position: "relative", zIndex: 999 }}>
                              Arrival <i className={`bi ${(sortConfig.direction === "desc") ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                            </span>
                          </th>

                          <th className={`text-end ${(sortConfig.key === "Price") ? "active" : ""}`} onClick={() => handleSort('Price')}>
                            <img src="/images/money.png" alt="" /> Price <i className={`bi ${(sortConfig.direction === "desc") ? "bi-arrow-up" : "bi-arrow-down"}`}></i>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flight-filtr-wrppr">
                  {filteredFlights?.length > 0 ? (
                    filteredFlights.map((flight, index) => {
                      const firstSegment = flight.Segments[0];
                      const lastSegment =
                        flight.Segments[flight.Segments.length - 1];

                      const cheapestFare = flight.Fares[0]?.FareDetails[0];

                      const destinationSegment =
                        lastSegment || firstSegment;

                      return (
                        <div className="flight-card" key={index}>
                          <div className="flight-body">
                            <div className="duihnjaka">
                              <div className="row">
                                {/* Airline Details */}
                                <div className="col-lg-10">
                                  <div className="d-flex align-items-center justify-content-between gap-2">
                                    <div className="uiajsdkcoijzczx d-flex gap-3 align-items-center justify-content-between">
                                      <img
                                        src={`https://images.kiwi.com/airlines/64/${firstSegment.Airline_Code}.png`}
                                        className="airline-logo"
                                        alt=""
                                        onError={(e) => {
                                          e.target.src = "./images/indigo.png";
                                        }}
                                      />

                                      <div className="gfjh55">
                                        <div className="fw-semibold">
                                          {firstSegment.Airline_Name}
                                        </div>

                                        <p className="mb-0">
                                          <small className="sjkdnfslfs text-muted">
                                            {firstSegment.Airline_Code}{" "}
                                            {firstSegment.Flight_Number}
                                          </small>
                                        </p>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="price-section d-flex flex-column align-items-end">
                                        <p className="mb-0">
                                          <small className="sjkdnfslfs">
                                            From
                                          </small>
                                        </p>

                                        <h4 className="mb-0">
                                          <strong>
                                            ₹{" "}
                                            {cheapestFare?.Total_Amount?.toLocaleString()}
                                          </strong>
                                        </h4>

                                        <small>per traveller</small>
                                      </div>
                                    </div>
                                  </div>

                                  {/* <a href="/" className="compare-link">
                                                      Add to compare +
                                                  </a> */}

                                  <div className="icsnduhh row align-items-center mt-2">
                                    {/* Airline Details */}
                                    <div className="col-2">
                                      <div className="gfjh55 text-start">
                                        <h5 className="fw-semibold mb-0 d-flex flex-column gap-1">
                                          <span>
                                            {firstSegment.Origin_City.match(
                                              /\((.*?)\)/,
                                            )?.[1] || ""}
                                          </span>

                                          <span>
                                            {firstSegment.Origin_City.replace(
                                              /\s*\(.*?\)/g,
                                              "",
                                            ).trim()}
                                          </span>

                                          {/* to
                                        {firstSegment.Destination_City.replace(
                                          /\s*\(.*?\)/g,
                                          "",
                                        ).trim()} */}
                                          {/* {formatFlightDate(firstSegment.Departure_DateTime)} */}
                                        </h5>

                                        <small
                                          style={{
                                            fontWeight: 500,
                                            color:
                                              "var(--light-highlighted-text-color)",
                                          }}
                                        >
                                          Terminal{" "}
                                          {firstSegment.Origin_Terminal}
                                        </small>
                                      </div>

                                      {/* <a href="/" className="compare-link">
                                                          Add to compare +
                                                      </a> */}
                                    </div>

                                    {/* Time Section */}
                                    <div className="col-8">
                                      <div className="time-wrapper d-flex justify-content-between gap-4 ps-3">
                                        <div className="text-center pt-1">
                                          <h5 className="mb-0">
                                            {
                                              firstSegment.Departure_DateTime.split(
                                                " ",
                                              )[1]
                                            }
                                          </h5>
                                        </div>

                                        <div className="duration-wrapper flex-fill text-center">
                                          <small className="dyusbnbsdhfc ufsidnfijsdfsdf">
                                            {/* {flight.Segments
                                                                      .map(segment => segment.Duration)
                                                                      .join(" + ")} */}
                                            {flight.Segments.map((segment) => {
                                              const [hours, minutes] =
                                                segment.Duration.split(":");
                                              return `${hours}h ${minutes}m`;
                                            }).join(" + ")}
                                          </small>

                                          <div className="dinsjihfnsidhfsdf d-flex align-items-center justify-content-center position-relative my-2">
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

                                          <small className="dyusbnbsdhfc">
                                            <div className="stop-info mt-2">
                                              {/* <img src="./images/stop.png" alt="" /> */}

                                              {flight.Segments.length === 1
                                                ? "Non Stop"
                                                : `${flight.Segments.length - 1} Stop, ${flight.Segments.slice(
                                                  0,
                                                  -1,
                                                )
                                                  .map((s) => s.Destination)
                                                  .join(", ")}`}
                                            </div>
                                          </small>
                                        </div>

                                        <div className="text-center pt-1">
                                          <h5 className="mb-0">
                                            {
                                              lastSegment.Arrival_DateTime.split(
                                                " ",
                                              )[1]
                                            }
                                          </h5>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-2">
                                      <div className="gfjh55 text-end">
                                        <h5 className="fw-semibold d-flex flex-column mb-0 gap-1">
                                          <span>
                                            {destinationSegment.Destination_City.match(
                                              /\((.*?)\)/,
                                            )?.[1] || ""}
                                          </span>

                                          <span>
                                            {destinationSegment.Destination_City.replace(
                                              /\s*\(.*?\)/g,
                                              "",
                                            ).trim()}
                                          </span>

                                          {/* {formatFlightDate(firstSegment.Departure_DateTime)} */}
                                        </h5>

                                        <small
                                          style={{
                                            fontWeight: 500,
                                            color:
                                              "var(--light-highlighted-text-color)",
                                          }}
                                        >
                                          Terminal{" "} 
                                          {destinationSegment.Destination_Terminal}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="col-lg-2">
                                  <div className="dikijasdlfdsf d-inline-flex flex-column justify-content-between align-items-end w-100">
                                    <div className="offer-strip d-flex justify-content-between align-items-center">
                                      <div className="doasjjishnidchsd dhzdfsFsdf d-flex align-items-center gap-2">
                                        <div className="dosncjknzkczxc position-relative rounded-circle">
                                          <img
                                            src="./images/fire.png"
                                            className="position-absolute top-50 start-50 translate-middle img-fluid"
                                            alt=""
                                          />
                                        </div>

                                        <div className="dinsdlcjiodsfc">
                                          <small>Seats Left</small>{" "}
                                          <p className="mb-0">
                                            {flight.Fares[0]?.Seats_Available} Seats Left
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      className="btn btn-tour mb-2"
                                      onClick={() =>
                                        handleFlightFareDetails(flight)
                                      }
                                    >
                                      View Price
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flight-top d-flex justify-content-between align-items-center mt-2">
                            <div className="uhncoikcdf d-flex align-items-center">
                              <div className="heart bg-white">
                                <img src="./images/likeicon.png" alt="" />
                              </div>

                              {/* <span className="cheapest">
                                                {cheapestFare?.Refundable ? "Refundable" : "Cheapest"}
                                            </span> */}
                              <p className="mb-0">
                                {flight.IsLCC
                                  ? "Low Cost Carrier"
                                  : "Full Service Airline"}
                              </p>
                            </div>

                            <div className="offer-strip d-flex justify-content-between align-items-center">
                              <div className="doasjjishnidchsd dfhdbdfsff d-flex align-items-center gap-2">
                                <div className="dosncjknzkczxc position-relative rounded-circle">
                                  <img
                                    src="./images/seatb.png"
                                    className="position-absolute top-50 start-50 translate-middle img-fluid"
                                    alt=""
                                  />
                                </div>

                                <div className="dinsdlcjiodsfc">
                                  <small>Cabin</small>{" "}
                                  <p className="mb-0">
                                    {cheapestFare?.FareClasses?.[0]?.CabinClass}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="offer-strip d-flex justify-content-between align-items-center">
                              <div className="doasjjishnidchsd cbdfzadsd d-flex align-items-center gap-2">
                                <div className="dosncjknzkczxc position-relative rounded-circle">
                                  <img
                                    src="./images/luggageb.png"
                                    className="position-absolute top-50 start-50 translate-middle img-fluid"
                                    alt=""
                                  />
                                </div>

                                <div className="dinsdlcjiodsfc">
                                  <small>Baggage</small>{" "}
                                  <p className="mb-0">
                                    {cheapestFare?.Free_Baggage?.Check_In_Baggage}{" "}
                                    Check-In
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="offer-strip d-flex justify-content-between align-items-center">
                              <div className="doasjjishnidchsd dgcfghbgsef d-flex align-items-center gap-2">
                                <div className="dosncjknzkczxc position-relative rounded-circle">
                                  <img
                                    src="./images/school-bag.png"
                                    className="position-absolute top-50 start-50 translate-middle img-fluid"
                                    alt=""
                                  />
                                </div>

                                <div className="dinsdlcjiodsfc">
                                  <small>Cabin Baggage</small>{" "}
                                  <p className="mb-0">
                                    {cheapestFare?.Free_Baggage?.Hand_Baggage}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* <span className="rating">5.0</span> */}

                            {/* <div className="stop-info"> */}
                            {/* <img src="./images/stop.png" alt="" /> */}

                            {/* {flight.Segments.length === 1
                                ? "Non Stop"
                                : `${flight.Segments.length - 1} Stop, ${flight.Segments.slice(
                                    0,
                                    -1,
                                  )
                                    .map((s) => s.Destination)
                                    .join(", ")}`}
                            </div> */}
                          </div>
                        </div>
                      );
                    },
                    )
                  ) : (
                    <div className="text-center p-5">
                      <h5 className="mb-3"><b>No Matching Flights Available</b></h5>

                      <p className="mb-0">Unfortunately, there are no flights available for your selected route and dates. <br /> Try adjusting your search to explore more options.</p>
                    </div>
                  )}
                </div>

                {/*flight fare modal*/}

                <div
                  className={`${showFareModal && selectedFlight ? "flight-fare-modal-backdrop" : "flight-fare-modal-backdrop flight-fare-modal-backdrop-hide"} position-fixed top-0 start-0 end-0 bottom-0 w-100 h-100`}
                ></div>

                {showFareModal && selectedFlight && (
                  <div
                    className={`${showFareModal && selectedFlight ? "flight-fare-modal" : "flight-fare-modal flight-fare-modal-hide"} bg-white position-fixed start-50 top-50 translate-middle`}
                  >
                    <div className="flight-modal-content">
                      <div className="flight-modal-header d-flex align-items-center justify-content-between px-4 py-3">
                        <h5 className="flight-modal-title mb-0">
                          <img
                            src="./images/favicon.png"
                            className="me-1"
                            alt=""
                          />{" "}
                          <b>
                            Flight Details and Fare Options available for you!
                          </b>
                        </h5>

                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowFareModal(false)}
                        />
                      </div>

                      <div className="flight-modal-body px-4 py-3">
                        <h5>
                          <b>
                            {selectedFlight.Segments[0].Origin} -{" "}
                            {
                              selectedFlight.Segments[
                                selectedFlight.Segments.length - 1
                              ].Destination
                            }
                          </b>
                        </h5>

                        <p className="nfkjiuiewnjer mb-4">
                          <img
                            src={`https://images.kiwi.com/airlines/64/${selectedFlight.Segments[0].Airline_Code}.png`}
                            className="airline-logo m-0 me-2"
                            alt=""
                            onError={(e) => {
                              e.target.src = "./images/indigo.png";
                            }}
                          />
                          {selectedFlight.Segments[0].Airline_Name} · Departure
                          at{" "}
                          {
                            selectedFlight.Segments[0].Departure_DateTime.split(
                              " ",
                            )[1]
                          }{" "}
                          - Arrival at{" "}
                          {
                            selectedFlight.Segments[
                              selectedFlight.Segments.length - 1
                            ].Arrival_DateTime.split(" ")[1]
                          }
                        </p>

                        <div className="icsklmdjfisdfsdf row">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={3}
                            navigation
                            pagination={false}
                            loop={false}
                            breakpoints={{
                              320: {
                                slidesPerView: 1,
                              },
                              768: {
                                slidesPerView: 2,
                              },
                              992: {
                                slidesPerView: 3,
                              },
                            }}
                          >
                         {selectedFlight.Fares
                            ?.filter((fare) => {
                              const adultFare = fare.FareDetails?.find(
                                (detail) => detail.PAX_Type === 0
                              );

                              const fareCabinClass =
                                adultFare?.FareClasses?.[0]?.CabinClass;

                              const selectedCabinName =
                                cabinClassMap[selectedCabinClass];

                              return (
                                !selectedCabinClass ||
                                fareCabinClass?.toLowerCase() ===
                                  selectedCabinName?.toLowerCase()
                              );
                            })
                            .map((fare, fareIndex) => {
                                  const adultFare = fare.FareDetails?.find(
                                    (detail) => detail.PAX_Type === 0
                                  );

                                  const apiFareDetails = fareApiData[fare.Fare_Id];


                              return (
                                <SwiperSlide>
                                  <label
                                    htmlFor={fareIndex}
                                    key={fareIndex}
                                    className="iujnefjwrwer position-relative rounded mb-3 h-100"
                                  >
                                    <input
                                      type="radio"
                                      id={fareIndex}
                                      value=""
                                      name="cfsdvfvsf"
                                      className="position-absolute d-none"
                                    />

                                    <div className="djiasndkcsi d-flex justify-content-between flex-column h-100">
                                      {/* {fare.FareDetails[0].map((detail, detailIndex) => ( */}
                                      {adultFare && (
                                        <div className="ifuejwifhuer">
                                          <div className="sgdhsfasdff position-relative">
                                            <h5 className="fw-bold mb-0 p-3">
                                              ₹{" "}
                                              {adultFare.Total_Amount.toLocaleString()}
                                              <span
                                                className="cdhnzdfsfzxdd text-muted ms-1"
                                                style={{ fontSize: "14px" }}
                                              >
                                                per adult
                                              </span>
                                            </h5>

                                            <div
                                              className="ijcdsknejke position-absolute top-50 text-uppercase text-white px-3"
                                              style={{ fontSize: "13px" }}
                                            >
                                              {fare.ProductClass === "R"
                                                ? "SAVER"
                                                : fare.ProductClass === "F"
                                                  ? "FLEXI"
                                                  : fare.ProductClass === "P"
                                                    ? "PREMIUM"
                                                    : adultFare.FareClasses?.[0]
                                                        ?.CabinClass}
                                            </div>
                                          </div>

                                          <div className="doieasjdlmsoijf p-3">
                                            {/* Baggage */}
                                            <div className="djnskmlfdsf mb-3">
                                              <h6 className="mb-2">Baggage</h6>

                                              <div className="nxcvxfdcdd mb-1">
                                                <p className="mb-0 d-flex align-items-center">
                                                  <i className="bi me-2 bi-check-circle-fill"></i>
                                                  {
                                                    adultFare.Free_Baggage
                                                      ?.Hand_Baggage
                                                  }{" "}
                                                  Cabin Baggage
                                                </p>
                                              </div>

                                              <div className="nxcvxfdcdd">
                                                <p className="mb-0 d-flex align-items-center">
                                                  <i className="bi me-2 bi-check-circle-fill"></i>
                                                  {
                                                    adultFare.Free_Baggage
                                                      ?.Check_In_Baggage
                                                  }{" "}
                                                  Check-in Baggage
                                                </p>
                                              </div>
                                            </div>

                                            {/* Flexibility */}
                                            <div className="djnskmlfdsf">
                                              <h6 className="mb-2">
                                                Flexibility
                                              </h6>

                                              <div className="duihsfijsd py-2">
                                                <h6 className="mb-2">
                                                  Cancellation Charges
                                                </h6>

                                                {adultFare.CancellationCharges?.map(
                                                  (charge, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="ccnxdfdzsd d-flex mt-1"
                                                    >
                                                      <i className="bi me-2 bi-dash-circle-fill"></i>

                                                      <p className="mb-0">
                                                        {charge.ValueType === 1
                                                          ? `${charge.Value}% of fare`
                                                          : isNaN(
                                                                Number(
                                                                  charge.Value,
                                                                ),
                                                              )
                                                            ? charge.Value
                                                            : `₹${Number(charge.Value).toLocaleString()}`}{" "}
                                                        if cancelled between{" "}
                                                        <strong>
                                                          {charge.DurationFrom}
                                                        </strong>{" "}
                                                        {charge.DurationTypeFrom ===
                                                        0
                                                          ? "hrs"
                                                          : "days"}{" "}
                                                        to{" "}
                                                        <strong>
                                                          {charge.DurationTo}
                                                        </strong>{" "}
                                                        {charge.DurationTypeTo ===
                                                        0
                                                          ? "hrs"
                                                          : "days"}{" "}
                                                        before departure
                                                      </p>
                                                    </div>
                                                  ),
                                                )}
                                              </div>

                                              {/* Reschedule Charges */}
                                              <div className="duihsfijsd py-2">
                                                <h6 className="mb-2">
                                                  Date Change Charges
                                                </h6>

                                                {adultFare.RescheduleCharges?.map(
                                                  (charge, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="ccnxdfdzsd d-flex mt-1"
                                                    >
                                                      <i className="bi me-2 bi-dash-circle-fill"></i>

                                                      <p className="mb-0">
                                                        {charge.ValueType === 1
                                                          ? `${charge.Value}% of fare`
                                                          : isNaN(
                                                                Number(
                                                                  charge.Value,
                                                                ),
                                                              )
                                                            ? charge.Value
                                                            : `₹${Number(charge.Value).toLocaleString()}`}{" "}
                                                        if changed between{" "}
                                                        <strong>
                                                          {charge.DurationFrom}
                                                        </strong>{" "}
                                                        {charge.DurationTypeFrom ===
                                                        0
                                                          ? "hrs"
                                                          : "days"}{" "}
                                                        to{" "}
                                                        <strong>
                                                          {charge.DurationTo}
                                                        </strong>{" "}
                                                        {charge.DurationTypeTo ===
                                                        0
                                                          ? "hrs"
                                                          : "days"}{" "}
                                                        before departure
                                                      </p>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </div>

                                            {/* Seats & Meals */}
                                            <div className="djnskmlfdsf zbzbszdsad py-2">
                                              <h6 className="mb-2">
                                                Seats, Meals & More
                                              </h6>

                                              <div className="mb-1">
                                                <i className="bi me-2 bi-check-circle-fill"></i>
                                                Chargeable Seats
                                              </div>

                                              <div>
                                                <i className="bi me-2 bi-check-circle-fill"></i>

                                                {fare.Food_onboard === "P"
                                                  ? "Chargeable Meals"
                                                  : "Complimentary Meals"}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {/* ))} */}

                                      {apiFareDetails?.status && (
                                        <>
                                          <div className="djnskmlfdsf">
                                            <div className="imdiajojidsf">
                                              <div
                                                onClick={() =>
                                                  handleFareRules(fareIndex)
                                                }
                                                className="d-flex align-items-center justify-content-between px-3 pb-3"
                                              >
                                                <h6 className="d-flex align-items-center mb-0">
                                                  <i className="bi me-1 text-center text-white bi-info-lg"></i>{" "}
                                                  Fare Rules
                                                </h6>

                                                {window.innerWidth > 991 && (
                                                  <i className={`${fareRules === fareIndex ? "bi-chevron-up" : "bi-chevron-right"} bi`}
                                                  ></i>
                                                )}

                                                {window.innerWidth <= 991 && (
                                                  <i
                                                    onClick={() =>
                                                      handleFareRules(fareIndex)
                                                    }
                                                    className={`${fareRules === fareIndex ? "bi-x-lg" : "bi-chevron-down"} uinjocjso-icon bi`}
                                                  ></i>
                                                )}
                                              </div>

                                              {fareRules === fareIndex && (
                                                <div className="xnfgsfsdcfe sdjkcnsidjcije position-absolute bg-white w-100 rounded-2 border-top p-3 pe-0">
                                                  <div className="unjcisdosidd me-3 d-flex align-items-center justify-content-between mb-4">
                                                    <h6 className="mb-0 d-flex align-items-center">
                                                      <i className="bi me-1 d-inline-block text-center text-white bi-info-lg"></i>{" "}
                                                      Fare Rules
                                                    </h6>

                                                    <i
                                                      className="fa-solid fa-xmark"
                                                      onClick={() =>
                                                        setFareRules(false)
                                                      }
                                                    ></i>
                                                  </div>

                                                  {apiFareDetails?.fareDetails?.FareRules?.map(
                                                    (rule, ruleIndex) => (
                                                      <div
                                                        key={ruleIndex}
                                                        className="jifjisiudj"
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            rule.FareRuleDesc,
                                                        }}
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      <div className="okcmksxdcmkvsoij text-end p-3">
                                        <button
                                          className="btn-tour py-2"
                                          onClick={() =>
                                            handleFlightDetails(
                                              selectedFlight,
                                              flightList?.Search_Key,
                                              fare.Fare_Id,
                                              apiFareDetails,
                                            )
                                          }
                                        >
                                          Book Now
                                        </button>
                                      </div>
                                    </div>
                                  </label>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </div>
                      </div>

                      {/* <div className="flight-modal-footer text-center px-4 py-2">
                        <button className="btn-tour">Book Now</button>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div> 

      <FollowUsInstagram />
    </div>
  );
};
