import React, { useEffect, useMemo, useState } from "react";
import "./RoundTripFareModal.css";

export const RoundTripFareModal = ({
  show,
  onClose,
  onwardFlight,
  returnFlight,
  onContinue,
  onwardFareApiData,
  returnFareApiData,
  adults = 1,
}) => {
  const [activeTab, setActiveTab] = useState("onward");

  const [selectedOnwardFareIndex, setSelectedOnwardFareIndex] =
    useState(0);

  const [selectedReturnFareIndex, setSelectedReturnFareIndex] =
    useState(0);

  // Reset modal selections when it opens for different flights.
  useEffect(() => {
    if (show) {
      setActiveTab("onward");
      setSelectedOnwardFareIndex(0);
      setSelectedReturnFareIndex(0);
    }
  }, [show, onwardFlight?.Flight_Id, returnFlight?.Flight_Id]);

  // Safely extract fare options from the flight response.
  const getFareOptions = (flight) => {
    const fares = flight?.Fares || [];

    return fares.flatMap((fare, fareIndex) => {
      const fareDetails = fare?.FareDetails || [];

      return fareDetails.map((details, detailsIndex) => ({
        id: `${fareIndex}-${detailsIndex}`,
        fareIndex,
        detailsIndex,
        fare,
        details,
        price: Number(details?.Total_Amount || 0),
        fareClass:
          details?.FareClasses?.[0]?.FareClass ||
          details?.FareClasses?.[0]?.Class_Desc ||
          "",
        cabinClass:
          details?.FareClasses?.[0]?.CabinClass || "",
        baggage: details?.Free_Baggage || {},
      }));
    });
  };

  const onwardFareOptions = useMemo(
    () => getFareOptions(onwardFlight),
    [onwardFlight]
  );

  const returnFareOptions = useMemo(
    () => getFareOptions(returnFlight),
    [returnFlight]
  );

  // Don't render the modal when closed.
  if (!show) {
    return null;
  }

  // Current tab data.
  const isOnwardTab = activeTab === "onward";

  const currentFlight = isOnwardTab
    ? onwardFlight
    : returnFlight;

  const currentFareOptions = isOnwardTab
    ? onwardFareOptions
    : returnFareOptions;

console.log(onwardFareApiData, 'onwardFareApiDataonwardFareApiData');
console.log(returnFareApiData, 'returnFareApiDatareturnFareApiData');
console.log(currentFlight, 'currentFlightcurrentFlight');

  const selectedFareIndex = isOnwardTab
    ? selectedOnwardFareIndex
    : selectedReturnFareIndex;

  const setSelectedFareIndex = isOnwardTab
    ? setSelectedOnwardFareIndex
    : setSelectedReturnFareIndex;

  const selectedOnwardFare =
    onwardFareOptions[selectedOnwardFareIndex] || null;

  const selectedReturnFare =
    returnFareOptions[selectedReturnFareIndex] || null;

  const onwardPrice = selectedOnwardFare?.price || 0;
  const returnPrice = selectedReturnFare?.price || 0;

  const totalPrice = onwardPrice + returnPrice;

  // Current flight segments.
  const segments = currentFlight?.Segments || [];

  const firstSegment = segments[0];

  const lastSegment = segments[segments.length - 1];

  // Helpers.
  const getCity = (city) => {
    if (!city) return "";

    return city.match(/\((.*?)\)/)?.[1] || city;
  };

  const getTime = (dateTime) => {
    if (!dateTime) return "--";

    return dateTime.split(" ")[1] || dateTime;
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const getAirlineLogo = (airlineCode) =>
    `https://images.kiwi.com/airlines/64/${airlineCode}.png`;

  const getDuration = () => {
    if (!segments.length) return "--";

    let totalMinutes = 0;

    segments.forEach((segment) => {
      const duration = segment?.Duration || "00:00";

      const [hours, minutes] = duration.split(":").map(Number);

      totalMinutes += (hours || 0) * 60 + (minutes || 0);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getStops = () => {
    if (segments.length <= 1) return "Non stop";

    return `${segments.length - 1} Stop${
      segments.length > 2 ? "s" : ""
    }`;
  };

  // Change selected fare for the currently active direction.
  const handleFareSelection = (index) => {
    setSelectedFareIndex(index);
  };

  // Continue with both selected flights and fares.
  const handleContinue = () => {
    if (!selectedOnwardFare || !selectedReturnFare) {
      return;
    }

    onContinue({
      onwardFlight,
      returnFlight,

      onwardFare: selectedOnwardFare.fare,
      returnFare: selectedReturnFare.fare,

      onwardFareDetails: selectedOnwardFare.details,
      returnFareDetails: selectedReturnFare.details,

      onwardFareIndex: selectedOnwardFare.fareIndex,
      returnFareIndex: selectedReturnFare.fareIndex,

      onwardFareDetailsIndex: selectedOnwardFare.detailsIndex,
      returnFareDetailsIndex: selectedReturnFare.detailsIndex,

      onwardPrice,
      returnPrice,
      totalPrice,

      adults,
    });
  };

  return (
    <div
      className="rt-fare-overlay"
      onClick={onClose}
    >
      <div
        className="rt-fare-modal"
        onClick={(event) => event.stopPropagation()}
      >
 
        <div className="rt-fare-header">
          <h5>
            Flight Details and Fare Options available for you!
          </h5>

          <button
            type="button"
            className="rt-fare-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* =====================================
            ONWARD / RETURN TABS
        ====================================== */}

        <div className="rt-fare-tabs">
          <button
            type="button"
            className={
              activeTab === "onward" ? "active" : ""
            }
            onClick={() => setActiveTab("onward")}
          >
            DEPART:{" "}
            {getCity(
              onwardFlight?.Segments?.[0]?.Origin_City
            )}
            {" - "}
            {getCity(
              onwardFlight?.Segments?.[
                (onwardFlight?.Segments?.length || 1) - 1
              ]?.Destination_City
            )}
          </button>

          <button
            type="button"
            className={
              activeTab === "return" ? "active" : ""
            }
            onClick={() => setActiveTab("return")}
          >
            RETURN:{" "}
            {getCity(
              returnFlight?.Segments?.[0]?.Origin_City
            )}
            {" - "}
            {getCity(
              returnFlight?.Segments?.[
                (returnFlight?.Segments?.length || 1) - 1
              ]?.Destination_City
            )}
          </button>
        </div>

        {/* =====================================
            SELECTED FLIGHT INFORMATION
        ====================================== */}

        <div className="rt-fare-flight-info">
          {firstSegment && (
            <>
              <img
                src={getAirlineLogo(
                  firstSegment?.Airline_Code
                )}
                alt={firstSegment?.Airline_Name || "Airline"}
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/indigo.png";
                }}
              />

              <div className="rt-fare-airline">
                <strong>
                  {firstSegment?.Airline_Code}{" "}
                  {firstSegment?.Flight_Number}
                </strong>

                <span>
                  {firstSegment?.Airline_Name}
                </span>
              </div>

              <div className="rt-fare-flight-summary">
                <strong>
                  {getCity(firstSegment?.Origin_City)}
                  {" → "}
                  {getCity(lastSegment?.Destination_City)}
                </strong>

                <span>
                  {getTime(
                    firstSegment?.Departure_DateTime
                  )}
                  {" - "}
                  {getTime(
                    lastSegment?.Arrival_DateTime
                  )}
                </span>
              </div>

              <div className="rt-fare-duration">
                <strong>{getDuration()}</strong>
                <span>{getStops()}</span>
              </div>
            </>
          )}
        </div>

        {/* =====================================
            FARE OPTIONS
        ====================================== */}

        <div className="rt-fare-content">
          <div className="rt-fare-intro">
            <h6>
              Choose your{" "}
              {isOnwardTab ? "departure" : "return"} fare
            </h6>

            <p>
              Select the fare that best suits your travel
              requirements.
            </p>
          </div>

          {currentFareOptions.length > 0 ? (
            <div className="rt-fare-grid">
              {currentFareOptions.map((item, index) => {
                const isSelected =
                  selectedFareIndex === index;
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`rt-fare-option ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleFareSelection(index)
                    }
                  >
                    {/* FARE PRICE */}

                    <div className="rt-fare-option-top">
                      <span className="rt-fare-radio">
                        {isSelected ? "●" : "○"}
                      </span>

                      <strong>
                        ₹ {formatPrice(item.price)}
                      </strong>

                      <small>
                        per adult
                      </small>
                    </div>

                    <h6>
                      {item.fareClass ||
                        item.cabinClass ||
                        `Fare Option ${index + 1}`}
                    </h6>

                    {/* BAGGAGE */}

                    <div className="rt-fare-feature">
                      <strong>Baggage</strong>

                      <p>
                        <span className="rt-fare-check">
                          ✓
                        </span>

                        Check-in:{" "}
                        {item.baggage
                          ?.Check_In_Baggage ||
                          "As per airline rules"}
                      </p>

                      <p>
                        <span className="rt-fare-check">
                          ✓
                        </span>

                        Cabin:{" "}
                        {item.baggage?.Hand_Baggage ||
                          "As per airline rules"}
                      </p>
                    </div>

                    {/* FARE DETAILS */}

                    <div className="rt-fare-feature">
                      <strong>Fare Details</strong>

                      <p>
                        Cabin Class:{" "}
                        {item.cabinClass || "Not specified"}
                      </p>

                      {item.fareClass && (
                        <p>
                          Fare Class: {item.fareClass}
                        </p>
                      )}
                    </div>

                    <div className="rt-fare-option-footer">
                      {isSelected
                        ? "✓ Selected"
                        : "Select this fare"}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rt-fare-empty">
              <h6>No fare options available</h6>

              <p>
                No fare details were found for this flight.
              </p>
            </div>
          )}
        </div>

        {/* =====================================
            MODAL FOOTER
        ====================================== */}

        <div className="rt-fare-footer">
          <div className="rt-fare-total">
            <strong>
              ₹ {formatPrice(totalPrice)}
            </strong>

            <small>
              ROUND TRIP FOR {adults} ADULT
              {adults !== 1 ? "S" : ""}
            </small>

            <span>
              Onward: ₹ {formatPrice(onwardPrice)}
              {" + "}
              Return: ₹ {formatPrice(returnPrice)}
            </span>
          </div>

          <button
            type="button"
            className="rt-fare-continue"
            disabled={
              !selectedOnwardFare ||
              !selectedReturnFare
            }
            onClick={handleContinue}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
