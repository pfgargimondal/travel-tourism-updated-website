// eslint-disable-next-line
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FlightPayment.css";
import Loader from "../../../component/Loader/Loader";
import http from "../../../http";

export const FlightPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  // eslint-disable-next-line
  const [flightTempBooking, setFlightTempBooking] = useState(null);
  // eslint-disable-next-line
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 17);

  const {
    search_key,
    flight,
    segment,
    repriceFlight,
    bookingPassengers = [],
    selectedSeatList = [],
    selectedMealList = [],
    selectedSSR = {},
    baseFare = 0,
    taxAmount = 0,
    seatCharges = 0,
    mealCharges = 0,
    extraBaggageCharges = 0,
    otherCharges = 0,
    totallAmountt = 0,
    cabinClassName = "",
    adultFare = "",
  } = location.state || {};

  console.log(repriceFlight, "repriceFlight");
  console.log(adultFare, "adultFare");
  console.log(bookingPassengers, "bookingPassengers");

  const allSegments = repriceFlight?.Segments;
  const firstSegment = allSegments[0];
  const lastSegment = allSegments[allSegments.length - 1];
  const destinationSegment = lastSegment || firstSegment;

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((previousTime) => {
  //       if (previousTime <= 0) {
  //         clearInterval(timer);
  //         return 0;
  //       }

  //       return previousTime - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  // const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");

  // const seconds = String(timeLeft % 60).padStart(2, "0");

  const formatAmount = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // eslint-disable-next-line
  const baggageList = Object.values(selectedSSR || {})
    .flatMap((passengerSSR) => Object.values(passengerSSR || {}))
    .filter((ssr) => ssr?.SSR_TypeName === "BAGGAGE");

  const formatTime = (dateTime) => {
    if (!dateTime) return "";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatFlightDate = (dateTime) => {
    if (!dateTime) return "";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const adultsList = bookingPassengers.filter(
    (passenger) => passenger?.passengerType === "Adult",
  );

  const childrenList = bookingPassengers.filter(
    (passenger) => passenger?.passengerType === "Child",
  );

  const infantsList = bookingPassengers.filter(
    (passenger) => passenger?.passengerType === "Infant",
  );

  const getPassengerName = (passenger) => {
    if (!passenger) {
      return "-";
    }

    const fullName = `${passenger?.title || ""} ${
      passenger?.firstName || ""
    } ${passenger?.lastName || ""}`;

    return fullName.replace(/\s+/g, " ").trim() || "-";
  };

  const getPassengerEmail = () => {
    return bookingPassengers?.[0]?.email || "-";
  };

  const getPassengerMobile = () => {
    const passenger = bookingPassengers?.[0];

    if (!passenger) {
      return "-";
    }

    return `${passenger?.countryCode || ""} ${passenger?.mobile || ""}`.trim();
  };

  const getPaxType = (passengerType) => {
    switch (passengerType) {
      case "Adult":
        return 0;

      case "Child":
        return 1;

      case "Infant":
        return 2;

      default:
        return 0;
    }
  };

  // =========================================================
  // GENDER
  //
  // Change according to your API:
  //
  // 0 = Male
  // 1 = Female
  //
  // =========================================================

  const getGender = (gender) => {
    // if (!gender) {
    //   return null;
    // }
    if (
      gender === "Female" ||
      gender === "F" ||
      gender === 1 ||
      gender === "1"
    ) {
      return 1;
    }

    return 0;
  };

  // =========================================================
  // CREATE PAX DETAILS
  // =========================================================

  const createPAXDetails = () => {
    return bookingPassengers.map((passenger, index) => ({
      Pax_Id: index + 1,

      Pax_type: getPaxType(
        passenger?.passengerType
      ),

      Title:
        passenger?.title || "",

      First_Name:
        passenger?.firstName || "",

      Last_Name:
        passenger?.lastName || "",

      Gender:
        getGender(passenger?.gender),

      Age:
        passenger?.age
          ? Number(passenger.age)
          : null,

      DOB:
        // passenger?.dob || null,
        passenger?.dob
        ? (() => {
            const [year, month, day] = passenger.dob.split("-");
            return `${month}/${day}/${year}`;
          })()
        : null,

      Passport_Number:
        passenger?.passportNumber || null,

      Passport_Issuing_Country:
        passenger?.passportCountry || null,

      Passport_Expiry:
        passenger?.passportExpiry || null,

      Nationality:
        passenger?.nationality || null,

      Pancard_Number:
        passenger?.panCardNo || null,

      FrequentFlyerDetails:
        passenger?.showFF &&
        passenger?.ffNumber
          ? {
              Airline_Code:
                passenger?.airline || "",

              FrequentFlyerNumber:
                passenger?.ffNumber || "",
            }
          : null,
    }));
  };

  // =========================================================
  // CREATE SSR DETAILS
  //
  // IMPORTANT:
  // You need to match the exact BookingSSRDetails
  // structure required by your flight API.
  //
  // For now we preserve the selected data.
  // =========================================================

  const createBookingSSRDetails = () => {
    const ssrDetails = [];

    if (Array.isArray(selectedSeatList)) {
      selectedSeatList.forEach((seat) => {
        ssrDetails.push({
          // Pax_Id: Number(seat?.passengerIndex) + 1,
          Pax_Id: Number(seat.paxId),
          SSR_Key: seat.ssrKey || "",
        });
      });
    }

    if (Array.isArray(selectedMealList)) {
      selectedMealList.forEach((meal) => {
        console.log(meal, 'mealsergderhpayment');
        ssrDetails.push({
          // SSR_Type: "MEAL",

          // Pax_Id: Number(meal?.passengerIndex) + 1,
          Pax_Id: meal?.paxId,
          SSR_Key: meal.SSR_Key || "",
          // SSR_Code: meal?.SSR_Code || meal?.Meal_Code || meal?.code || "",

          // Amount: Number(
          //   meal?.Total_Amount || meal?.Amount || meal?.price || 0,
          // ),
        });
      });
    }

    Object.values(selectedSSR || {}).forEach((passengerSSR) => {
      Object.values(passengerSSR || {}).forEach((ssr) => {
        if (!ssr) return;

        ssrDetails.push({
          // SSR_Type: ssr?.SSR_TypeName || ssr?.SSR_Type || "",
          Pax_Id: Number(ssr?.passengerIndex ?? ssr?.Pax_Id ?? 0) + 1,
          SSR_Key: ssr.ssrKey || "",
          // SSR_Code: ssr?.SSR_Code || ssr?.code || "",
          // Amount: Number(ssr?.Total_Amount || ssr?.Amount || ssr?.price || 0),
        });
      });
    });

    return ssrDetails;
  };

  const getFlightKey = () => {
    return (
      // flight?.Flight_Key ||
      repriceFlight?.Flight_Key ||
      repriceFlight?.AirRepriceResponses?.[0]?.Flight_Key ||
      ""
    );
  };

  // =========================================================
  // CREATE TEMP BOOKING PAYLOAD
  // =========================================================

  const createTempBookingPayload = () => {
    const firstPassenger =
      bookingPassengers?.[0] || {};

    const payload = {
      Customer_Mobile:
        firstPassenger?.mobile || "",

      Passenger_Mobile:
        firstPassenger?.mobile || "",

      WhatsAPP_Mobile:
        null,

      Passenger_Email:
        firstPassenger?.email || "",

      PAX_Details:
        createPAXDetails(),

      GST:
        false,

      GST_Number:
        "",

      GST_HolderName:
        "GST Holder Name",

      GST_Address:
        "GST Address",

      BookingFlightDetails: [
        {
          Search_Key:
            search_key || "",

          Flight_Key:
            getFlightKey(),

          BookingSSRDetails:
            createBookingSSRDetails(),
        },
      ],

      CostCenterId:
        0,

      ProjectId:
        0,

      BookingRemark:
        "Flight Booking",

      CorporateStatus:
        0,

      CorporatePaymentMode:
        0,

      MissedSavingReason:
        null,

      CorpTripType:
        null,

      CorpTripSubType:
        null,

      TripRequestId:
        null,

      BookingAlertIds:
        null,
    };

    return payload;
  };

  // =========================================================
  // TEMP BOOKING API
  // =========================================================

  const createTempBooking = async () => {
    const payload = createTempBookingPayload();
    const response = await http.post(
      "/flight-temp-booking",
      payload
    );

    console.log("================================");
    console.log("TEMP BOOKING RESPONSE");
    console.log(JSON.stringify(response?.data, null, 2));
    console.log("================================");

    return response?.data;
  };

  // =========================================================
  // GET TEMP BOOKING REFERENCE
  //
  // IMPORTANT:
  // Replace these fields after you show me the actual
  // Temp Booking API response.
  // =========================================================

  const getTempBookingReference = (response) => {
    return (
      response?.booking_reference ||
      response?.BookingId ||
      response?.booking_id ||
      response?.Booking_Reference ||
      response?.BookingReference ||
      response?.BookingRef ||
      response?.PNR ||
      response?.pnr ||
      response?.data?.Booking_Id ||
      response?.data?.BookingId ||
      response?.data?.Booking_Reference ||
      response?.data?.BookingReference ||
      ""
    );
  };

  // =========================================================
  // CREATE PAYMENT ORDER
  //
  // Your Laravel backend should call Razorpay API.
  //
  // React should NOT contain Razorpay secret key.
  // =========================================================

  const createPaymentOrder = async ({ amount, bookingReference }) => {
    const response = await http.post("/payment/create-order", {
      amount: Number(amount),

      bookingReference: bookingReference,

      paymentMethod: paymentMethod,
    });

    return response?.data;
  };

  // =========================================================
  // LOAD RAZORPAY
  // =========================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // =========================================================
  // START RAZORPAY
  // =========================================================

  const startPayment = async ({ amount, bookingReference }) => {
    // -------------------------------------------------------
    // Load Razorpay SDK
    // -------------------------------------------------------

    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      throw new Error("Unable to load payment gateway");
    }

    const order = await createPaymentOrder({
      amount,
      bookingReference,
    });

    console.log("PAYMENT ORDER:", order);

    // const razorpayKey = order?.key || order?.razorpay_key;

    const razorpayOrderId = order?.order_id || order?.razorpay_order_id;

    if (!razorpayOrderId) {
      throw new Error("Invalid payment order response");
    }

    const options = {
      key: "rzp_test_TSozd4D1q3j7ha",

      amount: order?.amount || Number(amount) * 100,

      currency: order?.currency || "INR",

      name: "Flight Booking",

      description: "Flight ticket booking",

      order_id: razorpayOrderId,

      prefill: {
        name: getPassengerName(bookingPassengers?.[0]),

        email: getPassengerEmail(),

        contact: bookingPassengers?.[0]?.mobile || "",
      },

      notes: {
        bookingReference: bookingReference,
      },

      theme: {
        color: "#0d6efd",
      },

      handler: async function (paymentResponse) {
        console.log("================================");

        console.log("PAYMENT SUCCESS:");

        console.log(paymentResponse);

        console.log("================================");

        await handlePaymentSuccess({
          bookingReference,
          paymentResponse,
        });
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");

          setPaymentLoading(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("PAYMENT FAILED:", response);

      setPaymentLoading(false);

      alert(response?.error?.description || "Payment failed");
    });

    razorpay.open();
  };

  // =========================================================
  // TICKETING PAYLOAD
  // =========================================================

  const createTicketingPayload = ({ bookingReference, paymentResponse }) => {

    return {
      BookingReference: bookingReference,
      Search_Key: search_key || "",
      Flight_Key: getFlightKey(),
      PaymentId: paymentResponse?.razorpay_payment_id || "",
      OrderId: paymentResponse?.razorpay_order_id || "",
      PaymentSignature: paymentResponse?.razorpay_signature || "",
      PAX_Details: createPAXDetails(),
      BookingFlightDetails: [
        {
          Search_Key: search_key || "",

          Flight_Key: getFlightKey(),

          BookingSSRDetails: createBookingSSRDetails(),
        },
      ],
      Passenger_Mobile: bookingPassengers?.[0]?.mobile || "",
      Passenger_Email: bookingPassengers?.[0]?.email || "",
      Ticketing_Type: "1",
    };
  };

  // =========================================================
  // PAYMENT SUCCESS
  // =========================================================

  const handlePaymentSuccess = async ({
    bookingReference,
    paymentResponse,
  }) => {
    try {
      setPaymentLoading(true);

      const verifyResponse = await http.post("/payment/verify", {
        razorpay_payment_id: paymentResponse?.razorpay_payment_id,

        razorpay_order_id: paymentResponse?.razorpay_order_id,

        razorpay_signature: paymentResponse?.razorpay_signature,

        bookingReference: bookingReference,
      });

      console.log("PAYMENT VERIFY RESPONSE:", verifyResponse?.data);

      if (verifyResponse?.data?.success === false) {
        throw new Error("Payment verification failed");
      }

      const addPaymentPayload = createTicketingPayload({
        bookingReference,
        paymentResponse,
      });

      const addPaymentResponse = await http.post(
          "/flight-add-payment", addPaymentPayload
      );

      console.log(addPaymentResponse, 'addPaymentResponse');

      if (!addPaymentResponse?.data?.success) {
        const paymentErrorMessage =
          addPaymentResponse?.data?.message ||
          "Payment could not be completed.";

        const confirmationData = {
          bookingReference,
          paymentResponse,
          ticketResponse: null,
          bookingStatus: "payment_failed",
          bookingMessage: paymentErrorMessage,
        };

        sessionStorage.setItem(
          "flightBookingConfirmation",
          JSON.stringify(confirmationData)
        );

        navigate("/flight-booking-pending", {
          state: {
            bookingReference,
            paymentResponse,
            ticketResponse: null,
            bookingPassengers,
            flight,
            segment,
            repriceFlight,
            totallAmountt,
            bookingStatus: "payment_failed",
            bookingMessage: paymentErrorMessage,
          },
        });

        return;
      }


      // =====================================================
      // 5. AIR TICKETING
      // =====================================================

      const ticketingPayload = createTicketingPayload({
        bookingReference,
        paymentResponse,
      });

      console.log("Ticketing Payload:", ticketingPayload);

      const ticketResponse = await http.post(
        "/flight-ticketing",
        ticketingPayload
      );

      console.log("Ticket Response:", ticketResponse);
      console.log("Ticket Response Data:", ticketResponse?.data);
      console.log("Ticket API Data:", ticketResponse?.data?.data);


      // =====================================================
      // 6. EXTRACT TICKETING RESPONSE
      // =====================================================

      const ticketData = ticketResponse?.data?.data || {};

      const airlinePNRDetails =
        ticketData?.AirlinePNRDetails || [];

      const responseHeader =
        ticketData?.Response_Header || {};

      const errorCode =
        String(responseHeader?.Error_Code || "");

      const errorDesc =
        responseHeader?.Error_Desc ||
        "Your booking is being processed.";

      const errorInnerException =
        responseHeader?.Error_InnerException || "";

      const statusId =
        responseHeader?.Status_Id || "";


      // =====================================================
      // 7. DETERMINE BOOKING STATUS
      // =====================================================

      let bookingStatus = "pending";


      // -----------------------------------------------------
      // CONFIRMED
      // -----------------------------------------------------

      if (
        errorCode === "0000" &&
        airlinePNRDetails.length > 0
      ) {
        bookingStatus = "confirmed";
      }

      // -----------------------------------------------------
      // PAYMENT / BOOKING PENDING
      // -----------------------------------------------------

      else if (errorCode === "0046") {
        bookingStatus = "payment_pending";
      }

      // -----------------------------------------------------
      // TICKETING FAILED
      // -----------------------------------------------------

      else if (errorCode === "0009") {
        bookingStatus = "ticketing_failed";
      }

      // -----------------------------------------------------
      // ANY OTHER ERROR
      // -----------------------------------------------------

      else if (errorCode !== "0000") {
        bookingStatus = "pending";
      }

      // =====================================================
      // 8. SAVE BOOKING CONFIRMATION
      // =====================================================

      const confirmationData = {
        bookingReference,
        paymentResponse,
        ticketResponse: ticketResponse?.data,

        bookingStatus,
        bookingMessage: errorDesc,

        airlinePNRDetails,

        errorCode,
        errorInnerException,
        statusId,
      };

      sessionStorage.setItem(
        "flightBookingConfirmation",
        JSON.stringify(confirmationData)
      );


      // =====================================================
      // 9. CONFIRMED BOOKING
      // =====================================================

      if (bookingStatus === "confirmed") {

        navigate("/thank-you", {
          state: {
            bookingReference,

            paymentResponse,

            ticketResponse: ticketResponse?.data,

            airlinePNRDetails,

            bookingPassengers,

            flight,

            segment,

            repriceFlight,

            totallAmountt,

            bookingStatus,
          },
        });

        return;
      }


      // =====================================================
      // 10. PAYMENT PENDING
      // =====================================================

      if (bookingStatus === "payment_pending") {

        navigate(`/flight-booking-pending/${bookingReference}`, {
          state: {
            bookingReference,

            paymentResponse,

            ticketResponse: ticketResponse?.data,

            airlinePNRDetails,

            bookingPassengers,

            flight,

            segment,

            repriceFlight,

            totallAmountt,

            bookingStatus,

            bookingMessage: errorDesc,
          },
        });
        return;
      }


      // =====================================================
      // 11. TICKETING FAILED
      // =====================================================

      if (bookingStatus === "ticketing_failed") {
        navigate(`/flight-booking-pending/${bookingReference}`, {
          state: {
            bookingReference,

            paymentResponse,

            ticketResponse: ticketResponse?.data,

            airlinePNRDetails,

            bookingPassengers,

            flight,

            segment,

            repriceFlight,

            totallAmountt,

            bookingStatus,

            bookingMessage: errorDesc,

            errorCode,

            errorInnerException,

            statusId,
          },
        });
        return;
      }

      // =====================================================
      // 12. OTHER PENDING RESPONSE
      // =====================================================

      navigate(`/flight-booking-pending/${bookingReference}`, {
        state: {
          bookingReference,

          paymentResponse,

          ticketResponse: ticketResponse?.data,

          airlinePNRDetails,

          bookingPassengers,

          flight,

          segment,

          repriceFlight,

          totallAmountt,

          bookingStatus,

          bookingMessage: errorDesc,

          errorCode,

          errorInnerException,

          statusId,
        },
      });
    } catch (error) {
      console.error("Ticketing Error:", error);

      navigate("/flight-booking-pending", {
        state: {
          bookingReference,
          paymentResponse,
          bookingPassengers,
          flight,
          segment,
          repriceFlight,
          totallAmountt,
          bookingStatus: "error",
          bookingMessage:
            error?.response?.data?.message ||
            "We could not confirm your ticket at this moment.",
        },
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // =========================================================
  // MAIN PROCEED TO PAY
  // =========================================================

  const handleProceedToPay = async () => {
    if (paymentLoading) {
      return;
    }
    try {
      setPaymentLoading(true);

      if (
        !bookingPassengers ||
        bookingPassengers.length === 0
      ) {
        alert("Passenger details are missing");
        setPaymentLoading(false);
        return;
      }

      if (!search_key) {
        alert("Search key is missing");
        setPaymentLoading(false);
        return;
      }

      const flightKey = getFlightKey();

      if (!flightKey) {
        alert("Flight key is missing");
        setPaymentLoading(false);
        return;
      }

      const tempBookingResponse =
        await createTempBooking();

      setFlightTempBooking(
        tempBookingResponse
      );

      // ---------------------------------------------
      // STEP 2
      // GET TEMP BOOKING REFERENCE
      // ---------------------------------------------

      const bookingReference =
        getTempBookingReference(
          tempBookingResponse
        );

      if (!bookingReference) {
        console.error(
          "Temp booking response:",
          tempBookingResponse
        );

        throw new Error(
          "Temp booking successful response does not contain booking reference."
        );
      }

      // ---------------------------------------------
      // STEP 3
      // PAYMENT
      // ---------------------------------------------

      console.log(
        "STEP 2 → PAYMENT"
      );

      await startPayment({
        amount: totallAmountt,
        bookingReference,
      });

    } catch (error) {
      console.error(
        "PROCEED TO PAY ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to proceed with payment"
      );

      setPaymentLoading(false);
    }
  };

  // =========================================================
  // LOGIN HANDLER
  // =========================================================

  const handleLogin = () => {
    console.log("Open Login Modal");
  };

  // =========================================================
  // GENERATE QR
  // =========================================================

  // const handleGenerateQR = () => {
  //   console.log("Generate QR Code");
  // };
  if (loading) return <Loader />;

  return (
    <div className="sdfsdf655 flight-details-wrapper">
      <div className="flight-payment-page">
        {/* ================= HEADER ================= */}
        <div className="payment-page-header">
          <div>
            <h4 className="mb-1 fw-bold">Review & Payment</h4>

            <small>Complete your booking securely</small>
          </div>

          <div className="booking-step">
            <span className="active">1</span>
            <span>Review</span>

            <div className="step-line"></div>

            <span>2</span>
            <span>Payment</span>

            <div className="step-line"></div>

            <span>3</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="container-fluid px-3 px-md-4">
          <div className="row g-4">
            {/* ================= LEFT ================= */}
            <div className="col-lg-8">
              <div className="flight-detail-card">
                {/* Top section */}
                <div className="flight-detail-top">
                  <div className="d-flex align-items-center gap-2">
                    <div className="flight-icon">
                      <i className="fa-solid fa-plane"></i>
                    </div>

                    <span className="departure-badge">DEPARTURE</span>

                    <h5 className="mb-0 fw-bold">
                      {segment?.Origin_City} →{" "}
                      {destinationSegment?.Destination_City}
                    </h5>
                  </div>

                  <button type="button" className="hide-details-btn">
                    Hide details
                    <i className="fa-solid fa-chevron-up ms-2"></i>
                  </button>
                </div>

                {/* Flight summary */}
                <div className="flight-summary">
                  <span>{formatFlightDate(segment?.Departure_DateTime)}</span>

                  <span>•</span>

                  <span>{segment?.Airline_Name}</span>

                  <span>•</span>

                  <span>
                    {formatTime(segment?.Departure_DateTime)}
                    {" - "}
                    {formatTime(destinationSegment?.Arrival_DateTime)}
                  </span>

                  <span>•</span>

                  <span>{cabinClassName}</span>

                  <span>•</span>

                  <span>
                    {allSegments.length === 1
                      ? "Non Stop"
                      : `${allSegments.length - 1} Stop`}
                  </span>

                  <span>•</span>

                  <strong>
                    {/* {segment?.Duration || "02h 45m"} */}
                    {allSegments
                      .map((segment) => {
                        const [hours, minutes] = segment.Duration.split(":");
                        return `${hours}h ${minutes}m`;
                      })
                      .join(" + ")}
                  </strong>
                </div>

                {allSegments.map((segment, index) => (
                  <div
                    className="flight-segment-wrapper"
                    key={segment?.Segment_Id ?? index}
                  >
                    {/* Sector Header */}
                    <div className="sector-section">
                      <div className="sector-title">
                        SECTOR {index + 1} OF {allSegments.length}
                      </div>

                      <div className="sector-route">
                        {segment?.Origin_City} → {segment?.Destination_City}
                      </div>

                      <div className="flight-number">
                        <i className="fa-solid fa-plane"></i>
                        {segment?.Airline_Code} -{" "}
                        {segment?.Flight_Number?.trim()}
                      </div>

                      <span className="saver-badge">
                        {repriceFlight?.Fares[0].ProductClass === "R"
                          ? "SAVER"
                          : repriceFlight?.Fares[0].ProductClass === "F"
                            ? "FLEXI"
                            : repriceFlight?.Fares[0].ProductClass === "P"
                              ? "PREMIUM"
                              : adultFare.FareClasses?.[0]?.CabinClass}
                      </span>
                    </div>

                    {/* Bottom Flight Information */}
                    <div className="flight-route-details">
                      {/* Departure */}
                      <div className="airport-detail">
                        <strong className="time">
                          {formatTime(segment?.Departure_DateTime)}
                        </strong>

                        <div>
                          {segment?.Origin_City} <span>{segment?.Origin}</span>
                        </div>

                        <small>
                          {formatFlightDate(segment?.Departure_DateTime)}
                        </small>

                        {segment?.Origin_Terminal && (
                          <small>Terminal - {segment.Origin_Terminal}</small>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="duration-detail">
                        <span>{segment?.Duration || "--"}</span>

                        <div className="duration-line"></div>

                        <small>• {cabinClassName}</small>
                      </div>

                      {/* Arrival */}
                      <div className="airport-detail arrival">
                        <strong className="time">
                          {formatTime(segment?.Arrival_DateTime)}
                        </strong>

                        <div>
                          {segment?.Destination_City}{" "}
                          <span>{segment?.Destination}</span>
                        </div>

                        <small>
                          {formatFlightDate(segment?.Arrival_DateTime)}
                        </small>

                        {segment?.Destination_Terminal && (
                          <small>
                            Terminal - {segment.Destination_Terminal}
                          </small>
                        )}
                      </div>

                      {/* Baggage */}
                      <div className="aircraft-info">
                        <div className="aircraft-title">ON THIS AIRCRAFT</div>

                        <div className="baggage-row">
                          <span>Cabin baggage</span>
                          <strong>
                            {adultFare?.Free_Baggage?.Hand_Baggage}
                          </strong>
                        </div>

                        <div className="baggage-row">
                          <span>Check-in baggage</span>
                          <strong>
                            {adultFare?.Free_Baggage?.Check_In_Baggage}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Connection information between segments */}
                    {index < allSegments.length - 1 && (
                      <div className="layover-section">
                        <span>
                          Change of plane / connection at{" "}
                          <strong>{segment?.Destination_City}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* =====================================================
                  TRAVELLER DETAILS
              ====================================================== */}

              <div className="traveller-details-card">
                <div className="traveller-details-header">
                  <h5>Traveller Details</h5>
                </div>

                <div className="traveller-details-body">
                  {/* Email */}
                  <div className="traveller-item">
                    <div className="traveller-label">E-mail</div>
                    <div className="traveller-value">{getPassengerEmail()}</div>
                  </div>

                  {/* Contact */}
                  <div className="traveller-item">
                    <div className="traveller-label">Contact No.</div>
                    <div className="traveller-value">
                      {getPassengerMobile()}
                    </div>
                  </div>

                  {/* Adult */}

                  <div className="traveller-item">
                    <div className="traveller-label">
                      Adult ({adultsList.length})
                    </div>

                    <div className="traveller-value">
                      {getPassengerName(adultsList[0])}
                    </div>
                  </div>

                  {/* Child */}

                  <div className="traveller-item">
                    <div className="traveller-label">
                      Child ({childrenList.length})
                    </div>

                    <div className="traveller-value">
                      {getPassengerName(childrenList[0])}
                    </div>
                  </div>

                  {/* Infant */}

                  <div className="traveller-item">
                    <div className="traveller-label">
                      Infant ({infantsList.length})
                    </div>

                    <div className="traveller-value">
                      {getPassengerName(infantsList[0])}
                    </div>
                  </div>
                </div>
              </div>
              {/* =====================================================
                  WALLET LOGIN
              ====================================================== */}
              <div className="wallet-login-card">
                <div className="wallet-login-icon">
                  <span className="wallet-emoji">💳</span>
                </div>

                <div className="wallet-login-text">
                  You have to login to use your <strong>wallet amount</strong>
                </div>

                <button
                  type="button"
                  className="wallet-login-btn"
                  onClick={handleLogin}
                >
                  LOG IN
                </button>
              </div>
              <div className="payment-mode-content">
                {/* =================================================
                      PAYMENT METHODS
                  ================================================== */}
                <div className="payment-method-list">
                  {/* UPI */}

                  <button
                    type="button"
                    className={`payment-method ${
                      paymentMethod === "upi" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <div className="payment-method-icon">
                      <i className="fa-solid fa-qrcode"></i>
                    </div>

                    <div>
                      <strong>UPI</strong>

                      <small>
                        Make Online Payments Directly
                        <br />
                        from Bank
                      </small>
                    </div>
                  </button>

                  {/* CARD */}

                  <button
                    type="button"
                    className={`payment-method ${
                      paymentMethod === "card" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="payment-method-icon">
                      <i className="fa-regular fa-credit-card"></i>
                    </div>

                    <div>
                      <strong>Credit/Debit/ATM Cards</strong>

                      <small>
                        Use VISA, Mastercard,
                        <br />
                        American Express etc.
                      </small>
                    </div>
                  </button>

                  {/* WALLET */}

                  <button
                    type="button"
                    className={`payment-method ${
                      paymentMethod === "wallet" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    <div className="payment-method-icon">
                      <i className="fa-solid fa-wallet"></i>
                    </div>

                    <div>
                      <strong>Wallets</strong>

                      <small>
                        Choose Mobikwik, Payzapp,
                        <br />
                        PhonePe or Amazon
                      </small>
                    </div>
                  </button>

                  {/* NET BANKING */}

                  <button
                    type="button"
                    className={`payment-method ${
                      paymentMethod === "netbanking" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    <div className="payment-method-icon">
                      <i className="fa-solid fa-building-columns"></i>
                    </div>

                    <div>
                      <strong>Net Banking</strong>

                      <small>All Major banks are supported</small>
                    </div>
                  </button>
                </div>
                {/* =================================================
                      PAYMENT CONTENT
                  ================================================== */}
                <div className="payment-content">
                  {paymentMethod === "upi" && (
                    <div className="payment-placeholder">
                      <h5>UPI Payment</h5>
                      <p>
                        Click "Proceed to Pay". Temp booking will be created
                        first and then Razorpay checkout will open.
                      </p>
                      <strong>Total: {formatAmount(totallAmountt)}</strong>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="payment-placeholder">
                      <h5>Credit / Debit Card</h5>

                      <p>
                        Your card details will be securely collected by the
                        payment gateway.
                      </p>

                      <strong>Total: {formatAmount(totallAmountt)}</strong>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="payment-placeholder">
                      <h5>Wallet Payment</h5>

                      <p>
                        Wallet payment will be handled by the payment gateway.
                      </p>

                      <strong>Total: {formatAmount(totallAmountt)}</strong>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="payment-placeholder">
                      <h5>Net Banking</h5>

                      <p>
                        Select Net Banking and continue to the payment gateway.
                      </p>

                      <strong>Total: {formatAmount(totallAmountt)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="col-lg-4">
              <div className="price-summary-card">
                <div className="price-summary-header">
                  <h5>Price Summary</h5>

                  <div>
                    <i className="fa-solid fa-person"></i>{" "}
                    {bookingPassengers.length}
                  </div>
                </div>

                <div className="price-row">
                  <span>Base Price</span>

                  <strong>{formatAmount(baseFare)}</strong>
                </div>

                <div className="price-row">
                  <span>Taxes & Services Fees</span>

                  <strong>{formatAmount(taxAmount)}</strong>
                </div>

                {seatCharges > 0 && (
                  <div className="price-row">
                    <span>Seat Charges</span>

                    <strong>{formatAmount(seatCharges)}</strong>
                  </div>
                )}

                {mealCharges > 0 && (
                  <div className="price-row">
                    <span>Meal Charges</span>

                    <strong>{formatAmount(mealCharges)}</strong>
                  </div>
                )}

                {extraBaggageCharges > 0 && (
                  <div className="price-row">
                    <span>Extra Baggage</span>

                    <strong>{formatAmount(extraBaggageCharges)}</strong>
                  </div>
                )}

                {otherCharges > 0 && (
                  <div className="price-row">
                    <span>Others</span>

                    <strong>{formatAmount(otherCharges)}</strong>
                  </div>
                )}

                <div className="grand-total">
                  <span>Grand Total</span>

                  <strong>{formatAmount(totallAmountt)}</strong>
                </div>

                <button
                  type="button"
                  className="btn btn-tour w-100 mt-3"
                  disabled={
                    paymentLoading
                  }
                  onClick={
                    handleProceedToPay
                  }
                >
                  {paymentLoading
                    ? "Processing..."
                    : "Proceed to Pay"}

                  {!paymentLoading && (

                    <i className="fa-solid fa-arrow-right ms-2"></i>

                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
