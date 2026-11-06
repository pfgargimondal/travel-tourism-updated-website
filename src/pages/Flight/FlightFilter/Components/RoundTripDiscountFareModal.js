
import { useEffect, useState } from "react";
import "./RoundTripFareModal.css";

export const RoundTripDiscountFareModal = ({
  show,
  onClose,
  combinedFlight,
  selectedFare,
  adults = 1,
  onContinue,
}) => {
  const [activeTab, setActiveTab] = useState("onward");
  // eslint-disable-next-line
  const [fareRules, setFareRules] = useState(false);

  const segments = combinedFlight?.Segments || [];

  // Your combined API response contains onward and return
  // segments in the same Segments array.
  const onwardSegments = segments.filter(
    (segment) => segment?.Return_Flight !== true
  );

  const returnSegments = segments.filter(
    (segment) => segment?.Return_Flight === true
  );

  const currentSegments =
    activeTab === "onward" ? onwardSegments : returnSegments;

  const firstSegment = currentSegments[0];
  const lastSegment = currentSegments[currentSegments.length - 1];

  const fareDetails =
    selectedFare?.FareDetails?.find(
      (item) => Number(item?.PAX_Type) === 0
    ) || selectedFare?.FareDetails?.[0];

  const fareClasses = fareDetails?.FareClasses || [];

  // Segment_Id 0 = onward, Segment_Id 1 = return
  const onwardFareClass = fareClasses.find(
    (item) => Number(item?.Segment_Id) === 0
  );

  const returnFareClass = fareClasses.find(
    (item) => Number(item?.Segment_Id) === 1
  );

  const totalPrice = Number(fareDetails?.Total_Amount || 0);

  const baggage = fareDetails?.Free_Baggage || {};

  useEffect(() => {
    if (show) {
      setActiveTab("onward");
      setFareRules(false);
    }
  }, [show, combinedFlight?.Flight_Id, selectedFare?.Fare_Id]);

  const getCity = (city) => {
    if (!city) return "--";
    return city.match(/\((.*?)\)/)?.[1] || city;
  };

  const getTime = (dateTime) => {
    if (!dateTime) return "--";
    return dateTime.split(" ")[1] || "--";
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const getAirlineLogo = (code) =>
    `https://images.kiwi.com/airlines/64/${code}.png`;

  const getDuration = (flightSegments) => {
    let totalMinutes = 0;

    flightSegments.forEach((segment) => {
      const [hours, minutes] = (segment?.Duration || "00:00")
        .split(":")
        .map(Number);

      totalMinutes += (hours || 0) * 60 + (minutes || 0);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getStops = (flightSegments) => {
    if (flightSegments.length <= 1) return "Non stop";

    return `${flightSegments.length - 1} Stop${
      flightSegments.length > 2 ? "s" : ""
    }`;
  };

  const handleContinue = () => {
    if (!combinedFlight || !selectedFare || !fareDetails) {
      return;
    }

    onContinue({
      combinedFlight,
      selectedFare,
      fareDetails,
      onwardSegments,
      returnSegments,
      onwardFareClass,
      returnFareClass,
      totalPrice,
      adults,
    });
  };

  if (!show) return null;

  return (
    <div className="rt-fare-overlay" onClick={onClose}>
      <div
        className="rt-fare-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="rt-fare-header">
          <h5>Flight Details and Fare Options available for you!</h5>

          <button
            type="button"
            className="rt-fare-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* ONWARD / RETURN TABS */}
        <div className="rt-fare-tabs">
          <button
            type="button"
            className={activeTab === "onward" ? "active" : ""}
            onClick={() => {
              setActiveTab("onward");
              setFareRules(false);
            }}
          >
            DEPART: {getCity(onwardSegments[0]?.Origin_City)}
            {" - "}
            {getCity(
              onwardSegments[onwardSegments.length - 1]?.Destination_City
            )}
          </button>

          <button
            type="button"
            className={activeTab === "return" ? "active" : ""}
            onClick={() => {
              setActiveTab("return");
              setFareRules(false);
            }}
          >
            RETURN: {getCity(returnSegments[0]?.Origin_City)}
            {" - "}
            {getCity(
              returnSegments[returnSegments.length - 1]?.Destination_City
            )}
          </button>
        </div>

        {/* FLIGHT INFORMATION */}
        <div className="rt-fare-flight-info">
          {firstSegment ? (
            <>
              <img
                src={getAirlineLogo(firstSegment.Airline_Code)}
                alt={firstSegment.Airline_Name || "Airline"}
                onError={(event) => {
                  event.currentTarget.src = "/images/indigo.png";
                }}
              />

              <div className="rt-fare-airline">
                <strong>
                  {firstSegment.Airline_Code}{" "}
                  {firstSegment.Flight_Number}
                </strong>

                <span>{firstSegment.Airline_Name}</span>
              </div>

              <div className="rt-fare-flight-summary">
                <strong>
                  {getCity(firstSegment.Origin_City)}
                  {" → "}
                  {getCity(lastSegment?.Destination_City)}
                </strong>

                <span>
                  {getTime(firstSegment.Departure_DateTime)}
                  {" - "}
                  {getTime(lastSegment?.Arrival_DateTime)}
                </span>
              </div>

              <div className="rt-fare-duration">
                <strong>{getDuration(currentSegments)}</strong>
                <span>{getStops(currentSegments)}</span>
              </div>
            </>
          ) : (
            <p>No flight details available.</p>
          )}
        </div>

        {/* FARE DETAILS */}
        <div className="rt-fare-content">
          <div className="rt-fare-intro">
            <h6>
              {activeTab === "onward" ? "Departure" : "Return"} Flight Fare
            </h6>

            <p>
              This is a combined round-trip discount fare.
              The displayed price includes both flights.
            </p>
          </div>

          {selectedFare && fareDetails ? (
            <div className="rt-fare-grid">
              <div className="rt-fare-option selected">
                <div className="rt-fare-option-top">
                  <span className="rt-fare-radio">●</span>

                  <strong>₹ {formatPrice(totalPrice)}</strong>

                  <small>Round trip fare</small>
                </div>

                <h6>
                  {activeTab === "onward"
                    ? onwardFareClass?.CabinClass ||
                      onwardFareClass?.Class_Desc ||
                      onwardFareClass?.FareClass ||
                      "Onward Fare"
                    : returnFareClass?.CabinClass ||
                      returnFareClass?.Class_Desc ||
                      returnFareClass?.FareClass ||
                      "Return Fare"}
                </h6>

                <div className="rt-fare-feature">
                  <strong>Fare Details</strong>

                  <p>
                    Cabin Class:{" "}
                    {activeTab === "onward"
                      ? onwardFareClass?.CabinClass || "--"
                      : returnFareClass?.CabinClass || "--"}
                  </p>

                  <p>
                    Fare Class:{" "}
                    {activeTab === "onward"
                      ? onwardFareClass?.FareClass ||
                        onwardFareClass?.Class_Desc ||
                        "--"
                      : returnFareClass?.FareClass ||
                        returnFareClass?.Class_Desc ||
                        "--"}
                  </p>
                </div>

                <div className="rt-fare-feature">
                  <strong>Baggage</strong>

                  <p>
                    Check-in:{" "}
                    {baggage?.Check_In_Baggage || "As per airline rules"}
                  </p>

                  <p>
                    Cabin:{" "}
                    {baggage?.Hand_Baggage || "As per airline rules"}
                  </p>
                </div>

                <div className="rt-fare-option-footer">
                  ✓ Selected Combined Fare
                </div>
              </div>
            </div>
          ) : (
            <div className="rt-fare-empty">
              <h6>No fare details available</h6>
              <p>Please select another flight.</p>
            </div>
          )}

          {/* OPTIONAL FARE RULES */}
          {fareDetails?.Refundable !== undefined && (
            <div className="rt-fare-feature mt-3">
              <strong>Fare Conditions</strong>

              <p>
                {fareDetails.Refundable
                  ? "Refundable"
                  : "Non-refundable"}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="rt-fare-footer">
          <div className="rt-fare-total">
            <strong>₹ {formatPrice(totalPrice)}</strong>

            <small>
              ROUND TRIP FOR {adults} ADULT
              {adults !== 1 ? "S" : ""}
            </small>

            <span>
              Onward:{" "}
              {onwardFareClass?.CabinClass || "--"}
              {" + "}
              Return:{" "}
              {returnFareClass?.CabinClass || "--"}
            </span>
          </div>

          <button
            type="button"
            className="rt-fare-continue"
            disabled={!selectedFare || !fareDetails}
            onClick={handleContinue}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
