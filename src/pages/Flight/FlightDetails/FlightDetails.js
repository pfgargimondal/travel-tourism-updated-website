import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./FlightDetails.css";
import http from "../../../http";
import Loader from "../../../component/Loader/Loader";
import { FlightSeats } from "./Components/FlightSeats";
import { AdultFields } from "./Components/AdultFields";
import { ChildFields } from "./Components/ChildFields";
import { InfantsFields } from "./Components/InfantsFields";
import { Meal } from "./Components/Meal";

export const FlightDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imprtntInfoModal, setImprtntInfoModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [allCouponModal, setAllCouponModal] = useState(false);
  const [flightRePrice, setflightRePrice] = useState(null);
  const [ssrData, setSsrData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSSR, setSelectedSSR] = useState({});
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [flightBookingModal, setFlightBookingModal] = useState(false);
  const [flightDetailsShowMoreToggle, setFlightDetailsShowMoreToggle] = useState(false);
  const { flightId } = useParams();
  const location = useLocation();

  const storedData = sessionStorage.getItem(`flightDetails_${flightId}`);

  const state = location.state || (storedData ? JSON.parse(storedData) : null);

  const search_key = state?.search_key;
  const flight = state?.flight;
  const fareId = state?.fareId;

  const adults = state?.adults;
  const children = state?.children;
  const infants = state?.infants;
  const cabinClass = state?.cabinClass;
  const fareDetailsData = state?.apiFareDetails;

  console.log(fareDetailsData, 'fareDetailsData');

  const cabinClassMap = {
    0: "Economy",
    3: "Premium Economy",
    1: "Business",
    2: "First Class",
  };

  const cabinClassName = cabinClassMap[cabinClass] || "Economy";

  const adultCount = adults || 1;
  const childCount = children || 0;
  const infantCount = infants || 0;

  

  const [fareRuleModal, setFareRuleModal] = useState(false);
  const [activeTab, setActiveTab] = useState("cancel");

  const [addBaggageModal, setAddBaggageModal] = useState(false);
  const [countryCode, setCountryCode] = useState([]);

  const [showGST, setShowGST] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [companyName, setcompanyName] = useState("");

  const [showCabinBaggage, setShowCabinBaggage] = useState(false);
  const [showCheckinBaggage, setShowCheckinBaggage] = useState(false);

  const [seatMap, setSeatMap] = useState([]);
  const [showSeatMealSection, setShowSeatMealSection] = useState(false);
  const [isSeatSelectionComplete, setIsSeatSelectionComplete] = useState(false);

  const [activeSeatMealTab, setActiveSeatMealTab] = useState();

  const [selectedMeals, setSelectedMeals] = useState({});
  const [activeMealFilter, setActiveMealFilter] = useState("all");

  const [showSeatRecommendationModal, setShowSeatRecommendationModal] =
    useState(false);
  // const [seatSelectionSkipped, setSeatSelectionSkipped] = useState(false);
  // const [mealSelectionSkipped, setMealSelectionSkipped] = useState(false);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        setLoading(true);

        const response = await http.get("/fetch-countries-code");

        setCountryCode(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryCode();
  }, []);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      // console.log("fetchFlightDetails called");
      try {
        setLoading(true);
        const [repriceRes, ssrRes] = await Promise.all([
          http.post("/flight-reprice-details", {
            fare_id: fareId,
            search_key,
            Flight_Key: flight.Flight_Key,
          }),
          http.post("/flight-get-ssr", {
            search_key,
            Flight_Key: flight.Flight_Key,
          }),
        ]);

        // console.log(repriceRes.data);
        // console.log(ssrRes.data);

        setflightRePrice(repriceRes.data.rePriceDetails);
        setSsrData(ssrRes.data.ssrDetails.SSRFlightDetails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (fareId && search_key && flight?.Flight_Key) {
      fetchFlightDetails();
    } else {
      console.log("Missing values");
    }
  }, [fareId, search_key, flight?.Flight_Key]);

  console.log(flightRePrice, 'flightRePrice');

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    const [datePart, timePart] = dateStr.split(" ");
    const [month, day, year] = datePart.split("/");

    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

  useEffect(() => {
    const html = document.querySelector("html");

    imprtntInfoModal
      ? html.classList.add("overflow-hidden")
      : html.classList.remove("overflow-hidden");

    return () => {
      html.classList.remove("overflow-hidden");
    };
  }, [imprtntInfoModal]);
  // eslint-disable-next-line
  const handleImprtntInfoModalToggle = () => {
    setImprtntInfoModal((prev) => !prev);
  };

  const handleSelectedModal = (value) => {
    setSelectedCoupon((prev) => (prev === value ? null : value));
  };
 
  useEffect(() => {
    const html = document.querySelector("html");

    allCouponModal
      ? html.classList.add("overflow-hidden")
      : html.classList.remove("overflow-hidden");

    return () => {
      html.classList.remove("overflow-hidden");
    };
  }, [allCouponModal]);

  const handleAllModalToggle = () => {
    setAllCouponModal((prev) => !prev);
  };

  const repriceFlight = flightRePrice?.AirRepriceResponses?.[0]?.Flight;

  const isBlockAllowed = repriceFlight?.Block_Ticket_Allowed;

  const fare = repriceFlight?.Fares?.[0];

  const allfareDetails = fare?.FareDetails || [];

  const fareDetail = fare?.FareDetails?.[0];

  const segment = repriceFlight?.Segments?.[0];
  // const cancellationCharges = fareDetail?.CancellationCharges || [];

  const paxRules =
    flightRePrice?.AirRepriceResponses?.[0]?.Required_PAX_Details || [];

  const cancellationCharges = (() => {
    const grouped = {};

    allfareDetails.forEach((passenger) => {
      const passengerFare = Number(passenger.Total_Amount || 0);

      (passenger.CancellationCharges || []).forEach((charge) => {
        const key = [
          charge.DurationFrom,
          charge.DurationTo,
          charge.DurationTypeFrom,
          charge.DurationTypeTo,
        ].join("-");

        if (!grouped[key]) {
          grouped[key] = {
            ...charge,
            totalValue: 0,
          };
        }

        let penalty = 0;

        if (charge.ValueType === 1) {
          // Percentage based cancellation charge
          penalty = (passengerFare * Number(charge.Value || 0)) / 100;
        } else {
          // Fixed amount
          penalty = Number(charge.Value || 0);
        }

        grouped[key].totalValue += penalty;
      });
    });

    return Object.values(grouped);
  })();

  // eslint-disable-next-line
  const formatTotalPenalty = (item) => {
    return `₹${Number(item.totalValue || 0).toLocaleString("en-IN")}`;
  };

  const adultRule = paxRules.find((x) => Number(x?.Pax_type) === 0);

  const childRule = paxRules.find((x) => Number(x?.Pax_type) === 1);

  const infantRule = paxRules.find((x) => Number(x?.Pax_type) === 2);

  const emptyPassenger = {
    // Basic details
    title: "Mr",
    firstName: "",
    lastName: "",
    gender: "",

    // Contact
    countryCode: "+91",
    mobile: "",
    email: "",

    // Date / age
    dob: "",
    age: "",

    // Nationality
    nationality: "",

    // Passport
    passportNumber: "",
    passportCountry: "",
    passportExpiry: "",

    // PAN
    panCardNo: "",

    // ID proof
    idProofNumber: "",

    // Student
    studentId: "",

    // Defence
    defenceServiceId: "",
    defenceIssueDate: "",
    defenceExpiryDate: "",

    // SSR
    mandatorySSR: "",

    // Frequent flyer
    airline: "",
    ffNumber: "",
    showFF: false,
  };

  const [adultForms, setAdultForms] = useState([]);
  const [childForms, setChildForms] = useState([]);
  const [infantForms, setInfantForms] = useState([]);

  const handleAddAdult = () => {
    if (adultForms.length >= adultCount) {
      return;
    }

    setAdultForms((prev) => [
      ...prev,
      {
        ...emptyPassenger,
      },
    ]);
  };

  const handleRemoveAdult = (index) => {
    setAdultForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdultChange = (index, field, value) => {
    setAdultForms((prev) =>
      prev.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger,
      ),
    );
  };

  const handleAddChild = () => {
    if (childForms.length >= childCount) {
      return;
    }

    setChildForms((prev) => [
      ...prev,
      {
        ...emptyPassenger,
      },
    ]);
  };

  const handleRemoveChild = (index) => {
    setChildForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index, field, value) => {
    setChildForms((prev) =>
      prev.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger,
      ),
    );
  };

  const handleAddInfant = () => {
    if (infantForms.length >= infantCount) {
      return;
    }

    setInfantForms((prev) => [
      ...prev,
      {
        ...emptyPassenger,
      },
    ]);
  };

  const handleRemoveInfant = (index) => {
    setInfantForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInfantChange = (index, field, value) => {
    setInfantForms((prev) =>
      prev.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger,
      ),
    );
  };

  const toggleFF = (type, index) => {
    if (type === "adult") {
      const data = [...adultForms];
      data[index].showFF = !data[index].showFF;
      setAdultForms(data);
    }
    if (type === "child") {
      const data = [...childForms];
      data[index].showFF = !data[index].showFF;
      setChildForms(data);
    }
    if (type === "infant") {
      const data = [...infantForms];
      data[index].showFF = !data[index].showFF;
      setInfantForms(data);
    }
  };

  const mealsType = ["COMPLIMENTORY_MEALS", "MEALS"];

  const mealsList =
    ssrData?.[0]?.SSRDetails?.filter((item) =>
      mealsType.includes(item.SSR_TypeName),
    ) || [];

  const [billingDetails, setBillingDetails] = useState({
    billingCountryCode: "",
    billingMobile: "",
    billingEmail: "",
    billingState: "West Bengal",
  });

  const [saveBilling, setSaveBilling] = useState(false);
  const [billingError, setBillingError] = useState("");

  const validatePassengerDetails = () => {
    // =========================
    // ADULT
    // =========================
    for (let i = 0; i < adultForms.length; i++) {
      const passenger = adultForms[i];

      if (adultRule) {
        if (adultRule.Title && !passenger.title?.trim()) {
          return false;
        }

        if (adultRule.First_Name && !passenger.firstName?.trim()) {
          return false;
        }

        if (adultRule.Last_Name && !passenger.lastName?.trim()) {
          return false;
        }

        if (adultRule.Gender && !passenger.gender?.trim()) {
          return false;
        }

        if (adultRule.DOB && !passenger.dob) {
          return false;
        }

        if (adultRule.Age && !passenger.Age?.trim()) {
          return false;
        }

        if (adultRule.Nationality && !passenger.Nationality?.trim()) {
          return false;
        }

        if (adultRule.Passport_Number && !passenger.Passport_Number?.trim()) {
          return false;
        }

        if (adultRule.passportExpiry && !passenger.passportExpiry?.trim()) {
          return false;
        }

        if (
          adultRule.Passport_Issuing_Country &&
          !passenger.Passport_Issuing_Country?.trim()
        ) {
          return false;
        }

        if (adultRule.PanCard_No && !passenger.PanCard_No?.trim()) {
          return false;
        }

        if (adultRule.IdProof_Number && !passenger.IdProof_Number?.trim()) {
          return false;
        }

        if (adultRule.Student_Id && !passenger.Student_Id?.trim()) {
          return false;
        }

        if (adultRule.DefenceServiceId && !passenger.DefenceServiceId?.trim()) {
          return false;
        }

        if (adultRule.DefenceIssueDate && !passenger.DefenceIssueDate?.trim()) {
          return false;
        }

        if (
          adultRule.DefenceExpiryDate &&
          !passenger.DefenceExpiryDate?.trim()
        ) {
          return false;
        }

        if (adultRule.Mandatory_SSRs && !passenger.Mandatory_SSRs?.trim()) {
          return false;
        }
      }
    }

    // =========================
    // CHILD
    // =========================
    for (let i = 0; i < childForms.length; i++) {
      const passenger = childForms[i];

      if (childRule) {
        if (childRule.Title && !passenger.title?.trim()) {
          return false;
        }

        if (childRule.First_Name && !passenger.firstName?.trim()) {
          return false;
        }

        if (childRule.Last_Name && !passenger.lastName?.trim()) {
          return false;
        }

        if (childRule.DOB && !passenger.dob) {
          return false;
        }
      }
    }

    // =========================
    // INFANT
    // =========================
    for (let i = 0; i < infantForms.length; i++) {
      const passenger = infantForms[i];

      if (infantRule) {
        if (infantRule.Title && !passenger.title?.trim()) {
          return false;
        }

        if (infantRule.First_Name && !passenger.firstName?.trim()) {
          return false;
        }

        if (infantRule.Last_Name && !passenger.lastName?.trim()) {
          return false;
        }

        if (infantRule.DOB && !passenger.dob) {
          return false;
        }
      }
    }

    return true;
  };

  const handleContinue = () => {
    // Clear previous billing error
    setBillingError("");

    const isPassengerValid = validatePassengerDetails();
    if (!isPassengerValid) {
      return;
    }

    if (!billingDetails.billingCountryCode) {
      setBillingError("Please select billing country code.");
      return;
    }

    if (!billingDetails.billingMobile) {
      setBillingError("Please enter billing mobile number.");
      return;
    }

    if (billingDetails.billingMobile.length < 10) {
      setBillingError("Please enter a valid billing mobile number.");
      return;
    }

    if (!billingDetails.billingEmail) {
      setBillingError("Please enter billing email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(billingDetails.billingEmail)) {
      setBillingError("Please enter a valid billing email address.");
      return;
    }

    if (!billingDetails.billingState) {
      setBillingError("Please select billing state.");
      return;
    }

    if (!saveBilling) {
      setBillingError(
        "Please check the confirmation box to save your billing details and continue.",
      );
      return;
    }
    handlePassengerDetails();
  };

  const handlePassengerDetails = async () => {
    if (!saveBilling) {
      return;
    }

    setLoading(true);
    try {
      const passengerDetails = {
        adults: adultForms,
        children: childForms,
        infants: infantForms,
        gst: {
          enabled: showGST,
          gstNumber: showGST ? gstNumber : "",
          companyName: showGST ? companyName : "",
        },
      };
      const requestData = {
        adults: adultForms,
        children: childForms,
        infants: infantForms,
        gst_number: showGST ? gstNumber : "",
        company_name: showGST ? companyName : "",
        flight_key: repriceFlight?.Flight_Key || "",
        search_key: search_key || "",
      };

      const response = await http.post("/get-seatMap-details", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = response.data.data;

      // setSeatMap(responseData.AirSeatMaps);
      const airSeatMaps = responseData?.AirSeatMaps;

      const seatAvailable =
        Array.isArray(airSeatMaps) && airSeatMaps.length > 0;

      if (seatAvailable) {
        setSeatMap(airSeatMaps);
      } else {
        setSeatMap([]);
      }

      // Meal availability
      const mealAvailable = Array.isArray(mealsList) && mealsList.length > 0;

      console.log("Seat Available:", seatAvailable);
      console.log("Meal Available:", mealAvailable);

      if (!seatAvailable && !mealAvailable) {
        // NO SEAT + NO MEAL
        setShowSeatMealSection(false);

        // Open booking modal directly
        setFlightBookingModal(true);

        return;
      }

      // At least one is available
      setShowSeatMealSection(true);

      // Seat available → show Seat first
      if (seatAvailable) {
        setActiveSeatMealTab("seats");
        setShowSeatRecommendationModal(true);
      }
      // Only meal available → show Meal first
      else if (mealAvailable) {
        setActiveSeatMealTab("meals");
      }

      localStorage.setItem(
        "savedPassengerDetails",
        JSON.stringify(passengerDetails),
      );
    } catch (error) {
      console.error(
        "Passenger API error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSkip = () => {
    console.log("User skipped seat selection");

    // Clear selected seats
    setSelectedSeats([]);

    // Mark as completed so user can continue
    setIsSeatSelectionComplete(true);

    // Close seat recommendation popup
    setShowSeatRecommendationModal(false);

    // Go to meals if available
    if (hasMeal) {
        setShowSeatMealSection(true);
        setActiveSeatMealTab("meals");
        return;
    }

    // No meals → continue to booking
    handleSeatMealContinue();
  };

  const handleMealSkip = () => {
    console.log("User skipped meal selection");

    // Clear selected meals
    setSelectedMeals({});

    // Close seat/meal section
    setShowSeatMealSection(false);

    // Continue to booking
    handleSeatMealContinue();
  };

  const handleChooseSeat = () => {
    console.log("User wants to choose seat manually");

    // Close recommendation popup
    setShowSeatRecommendationModal(false);

    // Open seat/meal section
    setShowSeatMealSection(true);

    // Open seat tab
    setActiveSeatMealTab("seats");
  };

  const handleAcceptRecommendedSeat = (recommendedSeat) => {
    console.log("Recommended seat selected:", recommendedSeat);

    if (!recommendedSeat) {
        console.log("No recommended seat available");
        return;
    }

    // Select recommended seat
    setSelectedSeats([recommendedSeat]);

    // Mark seat selection completed
    setIsSeatSelectionComplete(true);

    // Close popup
    setShowSeatRecommendationModal(false);

    // Go to meals
    if (hasMeal) {
        setShowSeatMealSection(true);
        setActiveSeatMealTab("meals");
        return;
    }

    // No meals → continue booking
    handleSeatMealContinue();
  };

  const recommendedSeat = seatMap?.find((seat) => {
    return (
        seat?.SSR_TypeName?.toUpperCase() === "SEAT" &&
        Number(seat?.SSR_Status) === 2
    );
  });

  const totalPassengers =
    Number(adultCount || 0) +
    Number(childCount || 0) +
    Number(infantCount || 0);

  const hasSeatMap = Array.isArray(seatMap)
    ? seatMap.length > 0
    : seatMap && typeof seatMap === "object"
      ? Object.keys(seatMap).length > 0
      : false;

  useEffect(() => {
    if (!hasSeatMap) {
      setActiveSeatMealTab("meals");
    } else {
      setActiveSeatMealTab("seats");
    }
  }, [hasSeatMap]);

  const travelDate = repriceFlight?.TravelDate
    ? new Date(repriceFlight.TravelDate)
    : null;

  const formattedDate =
    travelDate?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }) || "";

  const segments = repriceFlight?.Segments || [];
  const lastSegment = segments[segments.length - 1];


  const formatPenalty = (item) => {
    if (item.ValueType === 1) {
      return `${item.Value}%`;
    }

    return `₹ ${Number(item.Value).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const getBoundaryDate = (item) => {
    const [datePart, timePart] = segment.Departure_DateTime.split(" ");

    const [month, day, year] = datePart.split("/");

    const departure = new Date(`${year}-${month}-${day}T${timePart}`);

    const d = new Date(departure);

    if (item.DurationTypeTo === 0) {
      d.setHours(d.getHours() - item.DurationTo);
    } else {
      d.setDate(d.getDate() - item.DurationTo);
    }

    return d;
  };

  //   const firstSegment = segments[0];


  const stops = Math.max(0, segments.length - 1);
  const departureDate = parseDate(segment?.Departure_DateTime);
  const arrivalDate = parseDate(segment?.Arrival_DateTime);
  const totalMinutes = Math.floor((arrivalDate - departureDate) / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const totalDuration = `${hours}h ${minutes}m`;

  const excludedTypes = ["SEAT", "COMPLIMENTORY_MEALS", "MEALS"];

  const baggageList =
    ssrData?.[0]?.SSRDetails?.filter(
      (item) => !excludedTypes.includes(item.SSR_TypeName),
    ) || [];

  const hasMeal = Array.isArray(mealsList) && mealsList.length > 0;

  const hasSeat = Array.isArray(seatMap) && seatMap.length > 0;

  const hasSeatOrMeal = hasSeat || hasMeal;

  const handleSelectSSR = (bag) => {
    if (!selectedPassenger) {
      return;
    }

    const passengerKey = selectedPassenger.key;
    const baggageKey = bag.SSR_Key;

    setSelectedSSR((prev) => ({
      ...prev,
      [passengerKey]: {
        ...(prev[passengerKey] || {}),
        [baggageKey]: {
          ...bag,
          quantity: 1,
        },
      },
    }));
  };

  const handleIncreaseSSR = (bag) => {
    if (!selectedPassenger) {
      return;
    }

    const passengerKey = selectedPassenger.key;
    const baggageKey = bag.SSR_Key;

    setSelectedSSR((prev) => {
      const current = prev[passengerKey]?.[baggageKey];

      if (!current) {
        return prev;
      }

      return {
        ...prev,
        [passengerKey]: {
          ...prev[passengerKey],
          [baggageKey]: {
            ...current,
            quantity: (current.quantity || 1) + 1,
          },
        },
      };
    });
  };

  const handleRemoveSSR = (bag) => {
    if (!selectedPassenger) {
      return;
    }

    const passengerKey = selectedPassenger.key;
    const baggageKey = bag.SSR_Key;

    setSelectedSSR((prev) => {
      const current = prev[passengerKey]?.[baggageKey];

      if (!current) {
        return prev;
      }

      // Reduce quantity
      if ((current.quantity || 1) > 1) {
        return {
          ...prev,
          [passengerKey]: {
            ...prev[passengerKey],
            [baggageKey]: {
              ...current,
              quantity: current.quantity - 1,
            },
          },
        };
      }

      // Remove baggage completely
      const updatedPassenger = {
        ...prev[passengerKey],
      };

      delete updatedPassenger[baggageKey];

      const updated = {
        ...prev,
        [passengerKey]: updatedPassenger,
      };

      // Remove passenger if no baggage remains
      if (Object.keys(updatedPassenger).length === 0) {
        delete updated[passengerKey];
      }

      return updated;
    });
  };

  const adultFare = allfareDetails.find((item) => item.PAX_Type === 0);

  const childFare = allfareDetails.find((item) => item.PAX_Type === 1);

  const infantFare = allfareDetails.find((item) => item.PAX_Type === 2);

  // Base fare
  const baseFare = allfareDetails.reduce(
    (total, item) => total + Number(item.Basic_Amount || 0),
    0,
  );

  // Taxes
  const taxesAndSurcharges = allfareDetails.reduce(
    (total, item) => total + Number(item.AirportTax_Amount || 0),
    0,
  );

  // Total
  const totalAmount = allfareDetails.reduce(
    (total, item) => total + Number(item.Total_Amount || 0),
    0,
  );

  const handleMealSelect = (meal) => {
    if (totalPassengers <= 0) {
      return;
    }

    setSelectedMeals((prev) => {
      const next = { ...prev };

      // Check if this meal is already selected
      const existingPassengerIndex = Object.keys(next).find(
        (key) => next[key]?.SSR_Code === meal?.SSR_Code
      );

      if (existingPassengerIndex !== undefined) {
        delete next[existingPassengerIndex];

        const rearranged = {};

        Object.values(next).forEach((item, index) => {
          rearranged[index] = {
            ...item,
            paxId: index + 1,
          };
        });

        return rearranged;
      }

      // Find first passenger without meal
      let passengerIndex = -1;

      for (let i = 0; i < totalPassengers; i++) {
        if (!next[i]) {
          passengerIndex = i;
          break;
        }
      }

      // All passengers already selected
      if (passengerIndex === -1) {
        return prev;
      }

      // Add pax_id based on passenger number
      next[passengerIndex] = {
        ...meal,
        paxId: passengerIndex + 1,
      };

      return next;
    });
  };

  console.log(selectedMeals, 'selectedMeals'); 

  const handleMealRemove = (passengerIndex) => {
    setSelectedMeals((prev) => {
      const next = { ...prev };

      delete next[passengerIndex];

      const rearranged = {};

      Object.values(next).forEach((meal, index) => {
        rearranged[index] = meal;
      });

      return rearranged;
    });
  };

  const selectedMealCount = Object.keys(selectedMeals).length;

  const getMealName = (meal) => {
    return (
      meal?.SSR_TypeDesc ||
      meal?.SSR_TypeName ||
      meal?.SSR_Name ||
      meal?.Meal_Name ||
      meal?.MealName ||
      meal?.Description ||
      meal?.SSR_Code ||
      "Meal"
    );
  };

  const getMealPrice = (meal) => {
    return Number(
      meal?.Total_Amount ??
        meal?.Amount ??
        meal?.Price ??
        meal?.SSR_Amount ??
        meal?.SSR_Price ??
        meal?.Fare ??
        0,
    );
  };

  const getMealType = (meal) => {
    const text = `
      ${meal?.SSR_TypeName || ""}
      ${meal?.SSR_TypeDesc || ""}
      ${meal?.SSR_Name || ""}
      ${meal?.Meal_Name || ""}
      ${meal?.MealName || ""}
      ${meal?.Description || ""}
      ${meal?.SSR_Code || ""}
    `.toLowerCase();

    if (
      text.includes("non veg") ||
      text.includes("non-veg") ||
      text.includes("nonveg")
    ) {
      return "nonveg";
    }

    if (text.includes("veg") || text.includes("vegetarian")) {
      return "veg";
    }

    return "other";
  };

  const totalMealPrice = Object.values(selectedMeals).reduce((total, meal) => {
    return total + getMealPrice(meal);
  }, 0);

  const baggagePassengers = [
    ...Array.from({ length: Number(adultCount || 0) }, (_, index) => {
      const passenger = adultForms[index];

      return {
        key: `Adult-${index}`,
        paxType: 0,
        label: `Adult ${index + 1}`,
        name:
          `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim() ||
          `Adult ${index + 1}`,
      };
    }),

    ...Array.from({ length: Number(childCount || 0) }, (_, index) => {
      const passenger = childForms[index];

      return {
        key: `Child-${index}`,
        paxType: 1,
        label: `Child ${index + 1}`,
        name:
          `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim() ||
          `Child ${index + 1}`,
      };
    }),

    ...Array.from({ length: Number(infantCount || 0) }, (_, index) => {
      const passenger = infantForms[index];

      return {
        key: `Infant-${index}`,
        paxType: 2,
        label: `Infant ${index + 1}`,
        name:
          `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim() ||
          `Infant ${index + 1}`,
      };
    }),
  ];

  const handleSeatMealContinue = () => {
    if (activeSeatMealTab === "seats") {
      // Seat validation
      if (!isSeatSelectionComplete) {
        return;
      }

      if (hasMeal) {
        // Go to meal tab
        setActiveSeatMealTab("meals");
      } else {
        // No meal → open booking modal
        setShowSeatMealSection(true);
        setFlightBookingModal(true);
      }
    }

    if (activeSeatMealTab === "meals") {
      // Meal completed → open booking modal
      setShowSeatMealSection(true);
      setFlightBookingModal(true);
    }
  };

  const formatDepartureDateTime = (dateTime) => {
    if (!dateTime) return "";

    const date = new Date(dateTime);

    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const year = date.getFullYear();

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} • ${time}`;
  };

  const selectedSeatList = selectedSeats || [];
  const selectedSeatCount = selectedSeatList?.length || 0;

  const bookingPassengers = [
    ...(adultForms || []).map((passenger, index) => ({
      ...passenger,
      passengerType: "Adult",
      passengerIndex: index,
    })),

    ...(childForms || []).map((passenger, index) => ({
      ...passenger,
      passengerType: "Child",
      passengerIndex: adultForms?.length + index,
    })),

    ...(infantForms || []).map((passenger, index) => ({
      ...passenger,
      passengerType: "Infant",
      passengerIndex:
        (adultForms?.length || 0) +
        (childForms?.length || 0) +
        index,
    })),
  ];

  const seatCharges = selectedSeatList.reduce(
    (total, seat) =>
      total +
      Number(
        seat?.Total_Amount ??
        seat?.TotalAmount ??
        seat?.Amount ??
        seat?.Price ??
        seat?.amount ??
        0
      ),
    0
  );

  const selectedMealList = Array.isArray(selectedMeals)
    ? selectedMeals
    : selectedMeals
      ? Object.values(selectedMeals)
      : [];

  const mealCharges = selectedMealList.reduce(
    (total, meal) => {
      // Ignore invalid/null values
      if (!meal || typeof meal !== "object") {
        return total;
      }

      return (
        total +
        Number(
          meal?.Total_Amount ??
          meal?.TotalAmount ??
          meal?.Amount ??
          meal?.Price ??
          0
        )
      );
    },
    0
  );

  console.log(selectedMealList, 'selectedMealList');


  const extraBaggageCharges = Object.values(selectedSSR || {}).reduce(
    (total, passengerSSR) => {
      const ssrItems = Object.values(passengerSSR || {});
      return (
        total +
        ssrItems.reduce((passengerTotal, ssr) => {
          // Only calculate baggage
          if (ssr?.SSR_TypeName !== "BAGGAGE") {
            return passengerTotal;
          }
          const price = Number(ssr?.Total_Amount || 0);
          const quantity = Number(ssr?.quantity || 1);
          return passengerTotal + price * quantity;
        }, 0)
      );
    },
    0
  );
  // ============================================================
  // FARE
  // ============================================================

  let baseFareTotal = 0;
  let taxAmount = 0;
  let otherCharges = 0;

  allfareDetails.forEach((fare) => {
    baseFareTotal += Number(
      fare?.Basic_Amount ??
      fare?.BasicAmount ??
      fare?.BaseFare ??
      fare?.Base_Fare ?? 
      0
    );

    taxAmount += Number(
      fare?.AirportTax_Amount ??
      fare?.TaxAmount ??
      fare?.Taxes ??
      0
    );

    otherCharges += Number(
      fare?.Other_Charges ??
      fare?.OtherCharges ??
      0
    );
  });

  // ============================================================
  // DISCOUNT
  // ============================================================

  // const discountAmount = Number(
  //   appliedDiscount ??
  //   discountAmountValue ??
  //   0
  // );

  // ============================================================
  // TOTAL
  // ============================================================

  const totallAmountt =
    baseFareTotal +
    taxAmount +
    otherCharges +
    seatCharges +
    mealCharges + Number(extraBaggageCharges || 0);
    // discountAmount;

  // ============================================================
  // CURRENCY
  // ============================================================

  const currency =
    fareDetail?.Currency_Code ||
    fareDetail?.CurrencyCode ||
    "INR";


  const formatAmount = (amount) => {
    return `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const handleProceedToPayment = () => {
    setFlightBookingModal(false);

    const paymentData = {
      search_key,
      flight,
      segment,
      repriceFlight,
      bookingPassengers,
      selectedSeatList: Array.isArray(selectedSeatList)
        ? selectedSeatList
        : [],
      selectedMealList: Array.isArray(selectedMealList)
        ? selectedMealList
        : [],
      selectedSSR: Array.isArray(selectedSSR)
        ? selectedSSR
        : [],
      baseFare,
      taxAmount,
      seatCharges,
      mealCharges,
      extraBaggageCharges,
      otherCharges,
      totallAmountt,
      cabinClassName,
      adultFare,
    };

    sessionStorage.setItem(
      `flightPayment_${fareId}`,
      JSON.stringify(paymentData)
    );

    navigate(`/flight-payment/${fareId}`, {
      state: paymentData,
    });
  };

  const getFlightKey = () => {
    return (
      repriceFlight?.Flight_Key ||
      repriceFlight?.AirRepriceResponses?.[0]?.Flight_Key ||
      ""
    );
  };

  const getGender = (gender) => {
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

  const handleHoldTicket = async () => {
    try {
        setFlightBookingModal(false);

        const payload = createTempBookingPayload();
        const response = await http.post(
          "/flight-temp-booking",
          payload
        );

        console.log(response, 'response temp booking');

      const bookingReference =  response?.booking_reference ||
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
                response?.data?.BookingReference || "";

        if (!bookingReference) {
            throw new Error("Booking reference not found from Temp Booking response.");
        }

        const ticketingType = "0";

        const ticketingPayload = {
            Booking_RefNo: bookingReference,
            Ticketing_Type: ticketingType,
        };


        const ticketResponse = await http.post(
          "/flight-ticketing",
          ticketingPayload,
        );
  
        console.log(ticketResponse, 'ticketResponse');
        console.log(ticketResponse?.data, 'ticketResponsedata');
        console.log(ticketResponse?.data?.data, 'ticketResponsedatadata');

        // Call your Laravel API
        // Laravel:
        // Air_TempBooking
        //      ↓
        // Air_Ticketing (Ticketing_Type = 0)

        // After successful block:
        // navigate to Hold Ticket Success page

    } catch (error) {
        console.error("Hold ticket failed:", error);
    }
};

console.log(selectedSeats, 'selectedSeats');

  if (loading) return <Loader />;

  return (
    <div className="sdfsdf655 flight-details-wrapper">
      <div className="container">
        <div className="asfdgsqwe">
          <ul className="ps-0 d-flex align-items-center gap-3">
            <li className="active">Flights</li>

            <li>
              <i className="bi bi-arrow-right"></i>
            </li>

            <li>Flight Details</li>
          </ul>
        </div>

        <div className="fgerfer88 flight-wrppr">
          <div className="row">
            {/* Main Content - Left Column */}
            <div className="col-lg-9">
              <div className="sdfhgfrfrftr">
                <div className="hotel-card">
                  <div className="card-box">
                    {/* HEADER */}
                    <div className="flight-header mb-3">
                      <div className="ciuajmcokzxc d-flex gap-2 align-items-center">
                        {/* <img
                          src={`https://images.kiwi.com/airlines/64/${segment?.Airline_Code}.png`}
                          className="airline-logo m-0"
                          alt=""
                          onError={(e) => {
                            e.target.src = "./images/indigo.png";
                          }}
                        /> */}

                        <div>
                          <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                            {segment?.Origin_City.replace(/\s*\(.*?\)/g, "")}

                            <img
                              src="/images/planesmallicon.png"
                              width={25}
                              alt=""
                            />

                            {lastSegment?.Destination_City.replace(
                              /\s*\(.*?\)/g,
                              "",
                            )}
                          </h5>

                          <p className="uineiokee mb-0">
                            <i className="bi me-2 bi-calendar3"></i>

                            <span>{formattedDate} ·</span>

                            <span>
                              <span
                                style={{ color: "var(--blue-primary-color)" }}
                              >
                                {" "}
                                {stops === 0
                                  ? "Non Stop"
                                  : `${stops} Stop`}{" "}
                                ·{" "}
                              </span>
                              {totalDuration}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="diwehidmsad d-flex flex-column text-end gap-1">
                        {fareDetail?.CancellationCharges?.length > 0 && (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-lightning-charge-fill"></i>{" "}
                            Cancellation Charges Apply
                          </span>
                        )}

                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setFareRuleModal(true)}
                        >
                          View Fare Rules{" "}
                          <i className="fa-solid ms-1 fa-angle-right"></i>
                        </button>
                      </div>
                    </div>

                    {/* AIRLINE */}
                    <div className="flight-segments">
                      {segments?.map((segment, index) => {
                        const departure = new Date(
                          parseDate(segment.Departure_DateTime),
                        );
                        const arrival = new Date(
                          parseDate(segment.Arrival_DateTime),
                        );

                        const departureTime = departure.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        const arrivalTime = arrival.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        const totalMinutes = Math.floor(
                          (arrival - departure) / (1000 * 60),
                        );

                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;

                        const totalDuration = `${hours}h ${minutes}m`;

                        return (
                          <div key={index}>
                            <div className="flight-card mb-3 py-3 px-2">
                              <div className="gfjh55 d-flex align-items-center gap-2 text-start mb-2">
                                <img
                                  src={`https://images.kiwi.com/airlines/64/${segment.Airline_Code}.png`}
                                  width={45}
                                  alt=""
                                />

                                <div className="dihuewoirwerwer">
                                  <h6 className="mb-0">
                                    {segment.Airline_Name}
                                  </h6>

                                  <p className="odmlksjfmdf mb-0">
                                    {segment.Airline_Code}{" "}
                                    {segment.Flight_Number}
                                  </p>
                                </div>
                              </div>

                              <div className="icsnduhh row">
                                <div className="time-wrapper d-flex justify-content-between gap-5">
                                  <div className="pt-1">
                                    <h5 className="mb-1">{departureTime}</h5>

                                    <div className="udnehnewr d-flex flex-column">
                                      <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                        <span>{segment.Origin_City}</span>
                                      </p>

                                      <small
                                        style={{
                                          fontWeight: 500,
                                          color:
                                            "var(--light-highlighted-text-color)",
                                        }}
                                      >
                                        Terminal{" "}
                                        {segment.Origin_Terminal || "-"}
                                      </small>
                                    </div>
                                  </div>

                                  <div className="duration-wrapper flex-fill text-center">
                                    <small className="dyusbnbsdhfc ufsidnfijsdfsdf">
                                      <i className="bi bi-clock"></i>{" "}
                                      {totalDuration}
                                    </small>

                                    <div className="dinsjihfnsidhfsdf d-flex align-items-center justify-content-center position-relative my-3">
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

                                    <small className="dyusbnbsdhfc px-3 stop-info">
                                      {segment.Aircraft_Type}
                                    </small>
                                  </div>

                                  <div className="text-end pt-1">
                                    <h5 className="mb-1">{arrivalTime}</h5>

                                    <div className="udnehnewr d-flex flex-column">
                                      <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                        <span>{segment.Destination_City}</span>
                                      </p>

                                      <small
                                        style={{
                                          fontWeight: 500,
                                          color:
                                            "var(--light-highlighted-text-color)",
                                        }}
                                      >
                                        Terminal{" "}
                                        {segment.Destination_Terminal || "-"}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Layover */}

                            {index < segments.length - 1 &&
                              (() => {
                                const currentArrival = new Date(
                                  parseDate(segment.Arrival_DateTime),
                                );

                                const nextDeparture = new Date(
                                  parseDate(
                                    segments[index + 1].Departure_DateTime,
                                  ),
                                );

                                const diff =
                                  (nextDeparture - currentArrival) / 1000 / 60;

                                const hrs = Math.floor(diff / 60);

                                const mins = diff % 60;

                                return (
                                  <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="dioweierewrwer d-flex align-items-center gap-3">
                                      <span className="uinjiojospaed position-relative">
                                        <i className="bi bi-clock-history"></i>
                                      </span>

                                      <h6 className="layover-box d-flex align-items-center gap-2 mb-0">
                                        <strong>
                                          Layover: {segment.Destination_City}
                                        </strong>{" "}
                                        <i className="bi bi-dot"></i>{" "}
                                        <span>
                                          {hrs}h {mins}m
                                        </span>
                                      </h6>
                                    </div>

                                    <small className="bfxgsdfzdfff">
                                      Change of aircraft
                                    </small>
                                  </div>
                                );
                              })()}
                          </div>
                        );
                      })}
                    </div>
                    {/* NOTICE */}

                    {/* ==============================
                          BAGGAGE SUMMARY
                      ================================ */}

                    <div
                      className="baggage-summary px-3 py-2"
                      style={{
                        background: "#f5f5f5",
                        borderBottom: "1px solid #ddd",
                        position: "relative",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
                        {/* ================= CABIN BAGGAGE ================= */}

                        <div
                          className="cdnjhfxhdgdfff d-flex align-items-center position-relative"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="me-2" style={{ fontSize: "18px" }}>
                            <i className="bi bi-suitcase-fill"></i>
                          </span>

                          <span className="inmokkojjeorr">
                            <strong>Cabin Baggage:</strong>{" "}
                            {adultFare?.Free_Baggage?.Hand_Baggage || "7 Kgs"} /
                            Adult
                          </span>

                          <i
                            className="fa-regular fa-circle-question ms-2"
                            onClick={() => setShowCabinBaggage((prev) => !prev)}
                          ></i>

                          {/* CABIN BAGGAGE POPUP */}

                          {showCabinBaggage && (
                            <div className="baggage-info-popup">
                              <div className="vdncbxvxv">
                                <i className="bi bi-suitcase-fill"></i>
                              </div>

                              <div className="dnsjkhfisdf">
                                <div className="dienrwerwer">
                                  {/* Adult */}

                                  <div className="fdgdvxcv">
                                    Adult
                                    <span>
                                      {adultFare?.Free_Baggage?.Hand_Baggage
                                        ? ` ${adultFare.Free_Baggage.Hand_Baggage} (1 piece only)`
                                        : "0 Kg"}{" "}
                                      / Adult
                                    </span>
                                  </div>

                                  {/* Child */}

                                  {childFare && (
                                    <div className="fdgdvxcv">
                                      Child
                                      <span>
                                        {childFare?.Free_Baggage?.Hand_Baggage
                                          ? ` ${childFare.Free_Baggage.Hand_Baggage} (1 piece only)`
                                          : "0 Kg"}{" "}
                                        / Child
                                      </span>
                                    </div>
                                  )}

                                  {/* Infant */}

                                  {infantFare && (
                                    <div className="fdgdvxcv">
                                      Infant
                                      <span>
                                        {infantFare?.Free_Baggage?.Hand_Baggage
                                          ? ` ${infantFare.Free_Baggage.Hand_Baggage} (1 piece only)`
                                          : "0 Kg"}{" "}
                                        / Infant
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ================= CHECK-IN BAGGAGE ================= */}

                        <div
                          className="cdnjhfxhdgdfff d-flex align-items-center position-relative"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="me-2" style={{ fontSize: "18px" }}>
                            <i className="bi bi-suitcase-fill"></i>
                          </span>

                          <span className="inmokkojjeorr">
                            <strong>Check-In Baggage:</strong>{" "}
                            {adultFare?.Free_Baggage?.Check_In_Baggage
                              ? ` ${adultFare.Free_Baggage.Check_In_Baggage}`
                              : "0 Kg"}{" "}
                            / Adult
                          </span>

                          <i
                            className="fa-regular fa-circle-question ms-2"
                            onClick={() =>
                              setShowCheckinBaggage((prev) => !prev)
                            }
                          ></i>

                          {/* CHECK-IN BAGGAGE POPUP */}

                          {showCheckinBaggage && (
                            <div className="baggage-info-popup">
                              <div className="vdncbxvxv">
                                <i className="bi bi-suitcase-fill"></i>
                              </div>

                              <div className="dnsjkhfisdf">
                                <div className="dienrwerwer">
                                  {/* Adult */}

                                  <div className="fdgdvxcv">
                                    Adult
                                    <span>
                                      {adultFare?.Free_Baggage?.Check_In_Baggage
                                        ? ` ${adultFare.Free_Baggage.Check_In_Baggage} (1 piece only)`
                                        : "0 Kg"}{" "}
                                      / Adult
                                    </span>
                                  </div>

                                  {/* Child */}

                                  {childFare && (
                                    <div className="fdgdvxcv">
                                      Child
                                      <span>
                                        {childFare?.Free_Baggage
                                          ?.Check_In_Baggage
                                          ? ` ${childFare.Free_Baggage.Check_In_Baggage} (1 piece only)`
                                          : "0 Kg"}{" "}
                                        / Child
                                      </span>
                                    </div>
                                  )}

                                  {/* Infant */}

                                  {infantFare && (
                                    <div className="fdgdvxcv">
                                      Infant
                                      <span>
                                        {infantFare?.Free_Baggage
                                          ?.Check_In_Baggage
                                          ? ` ${infantFare.Free_Baggage.Check_In_Baggage} (1 piece only)`
                                          : "0 Kg"}{" "}
                                        / Infant
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {baggageList.length > 0 ? (
                      <div className="notice p-3">
                        <div className="jianjdlkmjosdjif d-flex gap-3 align-items-center">
                          <span className="rounded-pill text-center">
                            <i className="bi bi-backpack3-fill"></i>
                          </span>

                          <span>
                            <b>Got excess baggage?</b> <br /> Don't stress, buy
                            extra check-in baggage allowance
                          </span>
                        </div>

                        <button
                          className="add-baggage-flight btn-tour px-3"
                          // onClick={() => setAddBaggageModal((prev) => !prev)}
                          onClick={() => {
                            setAddBaggageModal(true);

                            if (
                              !selectedPassenger &&
                              baggagePassengers.length > 0
                            ) {
                              setSelectedPassenger(baggagePassengers[0]);
                            }
                          }}
                        >
                          ADD BAGGAGE{" "}
                          <i className="fa-solid ms-1 fa-angle-right"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="notice p-3">
                        <div className="jianjdlkmjosdjif d-flex gap-3 align-items-center">
                          <span className="rounded-pill text-center">
                            <i className="bi bi-backpack3-fill"></i>
                          </span>

                          <span>
                            Sorry, extra check-in baggage allowance details are
                            currently not available from the airline for{" "}
                            {repriceFlight?.Origin} -{" "}
                            {repriceFlight?.Destination}.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* POLICY */}
                    <div className="policy-box">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Cancellation & Date Change Policy</strong>

                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => setFareRuleModal(true)}
                        >
                          View Policy
                        </button>
                      </div>

                      <div className="mb-3 fw-semibold">
                        {flight?.Origin}-{flight?.Destination}
                      </div>

                      {/* Penalty */}

                      <div className="timeline penalty-row">
                        <div className="timeline-item first"></div>
                        {cancellationCharges.map((item, index) => (
                          <div
                            className="timeline-item"
                            key={index}
                            style={{ textAlign: "left" }}
                          >
                            <strong>{formatPenalty(item)}</strong>
                          </div>
                        ))}
                      </div>

                      {/* Progress */}

                      <div className="progress-wrapper">
                        <div className="progress-line"></div>

                        {cancellationCharges.map((_, index) => (
                          <div className="dot" key={index}></div>
                        ))}
                      </div>

                      {/* Dates */}

                      <div className="timeline mt-2">
                        <div className="timeline-item first">
                          <strong>Now</strong>
                        </div>

                        {cancellationCharges.map((item, index) => {
                          const dt = getBoundaryDate(item);

                          return (
                            <div
                              className="timeline-item"
                              style={{ textAlign: "right" }}
                              key={index}
                            >
                              <strong>{formatDate(dt)}</strong>

                              <br />

                              <small style={{ fontWeight: 500 }}>
                                {formatTime(dt)}
                              </small>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free Date Change Section */}
                <div className="sdbfsdhfsd">
                  <div className="dsbfsd">
                    <h6 className="mb-3">
                      <b>Unsure of your travel plans?</b> Get full flexibility
                      with our special add-ons
                    </h6>
                  </div>

                  <div className="dfbsdfgsdf">
                    <div className="row">
                      <div className="col-lg-10">
                        <div className="fgsdfsdf align-items-center mb-2">
                          <div className="dfsdf">
                            <h6 className="mb-0">Free Date Change</h6>
                          </div>

                          <div className="fsdf rounded-pill px-2 py-1">
                            Free Date Change Included
                          </div>
                        </div>

                        <div className="dfsdfsdf">
                          <p className="mb-0">
                            <span className="fsdfdsf">
                              Great! Save up to ₹ 3349{" "}
                            </span>{" "}
                            on date change charges up to 3 hours before
                            departure. You just pay the fare difference!{" "}
                            <span
                              style={{ color: "var(--blue-primary-color)" }}
                            >
                              View T&C
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-2">
                        <div className="fsdfsdfsd fghdzgsd text-center">
                          <img src="/images/hfggdf.png" alt="" />

                          <div className="dfgbdfgdf">
                            <h4 className="mb-0">₹ 391</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="fgdfgdfg">
                  <div className="sdfgsdf">
                    <h5 className="mb-3">
                      <span className="me-3 text-center">
                        <i class="fa-solid fa-info"></i>
                      </span>
                      Important Information
                    </h5>
                  </div>

                  <div className={flightDetailsShowMoreToggle ? "ubnejhruiwer" : "bdfsdf855e"}>
                    {fareDetailsData?.status && (
                      <div className="dfgf555 bg-white py-3">
                          {/* <div className="sdfsdf text-center rounded-circle">
                            <i className="bi bi-suitcase"></i>
                          </div> */}

                          {fareDetailsData?.fareDetails?.FareRules?.map(
                            (rule, ruleIndex) => (
                              <div
                                key={ruleIndex}
                                className="dfxgbdczdcd position-relative px-3"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    rule.FareRuleDesc,
                                }}
                              />
                            ),
                          )}
                          {/* <div className="dfxgbdczdcd position-relative px-3">
                            <h6 className="mb-2">
                              Check travel guidelines and baggage information
                              below:
                            </h6>
                            <p className="mb-0">
                              Carry no more than 1 check-in baggage and 1 hand
                              baggage per passenger. If violated, airline may
                              levy extra charges.
                            </p>
                          </div> */}
                      </div>
                    )}
                  </div>

                  <div className="oijnodijsdef text-end">
                    <p onClick={() => setFlightDetailsShowMoreToggle(prev => !prev)} className="mb-0">{flightDetailsShowMoreToggle ? "See less" : "...See more"}</p>
                  </div>
                </div>

                {/* Trip Secure */}
                <div className="fgdfg584d">
                  <div className="trip-card">
                    {/* Header */}
                    <div className="dgdfgdfgdf">
                      <div className="dfsdfds555f mb-3">
                        <span className="d-block position-relative me-3">
                          <i className="fa-solid position-absolute top-50 start-50 translate-middle fa-shield-halved"></i>
                        </span>

                        <div className="doijhsdksdf">
                          <h5 className="mb-1">Trip Secure</h5>

                          {/* Price */}
                          <div className="isfjsofoksdf">
                            <span className="price">₹ 299</span>{" "}
                            <span className="small-text">
                              / Traveller (18% GST included)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="dfgbdfhgdfg">
                        <img src="/images/asdc.png" alt="" />
                      </div>
                    </div>

                    {/* Features */}
                    <div className="sdnhfsdsdfsdf">
                      <div className="row">
                        <div className="col-lg-10">
                          <div className="dfgd5465">
                            <div className="row">
                              <div className="col-lg-4">
                                <label
                                  htmlFor="247s"
                                  className="dfsdf5855 position-relative text-center p-3 mb-0"
                                >
                                  <span className="idneisdf stop-info d-block position-absolute">
                                    Most Popular
                                  </span>

                                  <input
                                    id="247s"
                                    className="d-none position-absolute"
                                    type="checkbox"
                                  />

                                  <h6 className="mb-0">
                                    <span>24x7</span> Support
                                  </h6>

                                  <div className="ssd8984e p-2">
                                    <img src="/images/24-hours.png" alt="" />
                                  </div>

                                  <p className="mb-0">
                                    Delayed/lost baggage Assistance
                                  </p>
                                </label>
                              </div>

                              <div className="col-lg-4">
                                <label
                                  htmlFor="flt1"
                                  className="dfsdf5855 text-center p-3 mb-0"
                                >
                                  <input
                                    id="flt1"
                                    className="d-none position-absolute"
                                    type="checkbox"
                                  />

                                  <h6 className="mb-0">
                                    Flat <span> ₹ 50,000</span>
                                  </h6>

                                  <div className="ssd8984e p-2">
                                    <img src="/images/worker.png" alt="" />
                                  </div>

                                  <p className="mb-0">
                                    Delayed/lost baggage Assistance
                                  </p>
                                </label>
                              </div>

                              <div className="col-lg-4">
                                <label
                                  htmlFor="flt2"
                                  className="dfsdf5855 text-center p-3 mb-0"
                                >
                                  <input
                                    id="flt2"
                                    className="d-none position-absolute"
                                    type="checkbox"
                                  />

                                  <h6 className="mb-0">
                                    Flat <span> ₹ 2,000</span>
                                  </h6>

                                  <div className="ssd8984e p-2">
                                    <img src="/images/luggage.png" alt="" />
                                  </div>

                                  <p className="mb-0">
                                    Delayed/lost baggage Assistance
                                  </p>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-2">
                          <div className="sdnsdjsd h-100 text-center">
                            <span className="kfjsoijfosd position-relative d-block text-center mb-3">
                              <i className="bi position-absolute top-50 start-50 translate-middle bi-gift"></i>
                            </span>

                            <p className="mb-0">
                              View All Benefits{" "}
                              <i className="fa-solid fa-right-long"></i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="recommend d-flex align-items-center justify-content-between mt-3 p-0">
                      <div className="duiewhruiwerwer d-flex align-items-center gap-3 p-3">
                        <span className="d-inline-block position-relative">
                          <i className="bi position-absolute top-50 start-50 translate-middle bi-shield-check"></i>
                        </span>

                        <div className="dikwenfiswf">
                          <h6 className="mb-1">
                            Recommended for your travel within India
                          </h6>

                          <p className="mb-0">
                            Travel worthy-free with Trip Secure.
                          </p>
                        </div>
                      </div>

                      <img src="/images/dasa.png" className="h-100" alt="" />
                    </div>

                    {/* Radio Buttons */}
                    <div className="uidnweuyd mt-4 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="trip"
                          id="yes"
                        />
                        <label className="form-check-label" htmlFor="yes">
                          Yes, Secure my trip.
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="trip"
                          id="no"
                        />
                        <label className="form-check-label" htmlFor="no">
                          No, I will book without trip secure.
                        </label>
                      </div>
                    </div>

                    {/* Reviews */}
                    {/* <div className="duicssd mt-4">
                      <p className="mb-0">
                        <i className="fa-solid me-1 fa-heart"></i> Preferred by millions of travellers
                      </p>

                      <div className="row mt-3 g-3">
                        <div className="col-md-6 mt-0">
                          <div className="review-box">
                            "Your willingness to go above and beyond made a big
                            difference."
                            <br />
                            <small>- Amit Paul</small>
                          </div>
                        </div>

                        <div className="col-md-6 mt-0">
                          <div className="review-box">
                            "Claim settlement was incredibly fast. Smooth
                            experience."
                            <br />
                            <small>- Prateek Keshari</small>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    {/* Footer */}
                    <p className="mb-0 small-text d-flex align-items-center">
                      <i className="bi me-2 bi-shield-exclamation"></i> Trip
                      Secure is non-refundable. By selecting it, you confirm all
                      travelers are Indian nationals.
                    </p>
                  </div>
                </div>

                {/* Akasa Priority */}
                <div className="fndyff987er">
                  <div className="trip-card d-flex justify-content-between align-items-center">
                    {/* Left Content */}
                    <div className="d-flex gap-3 align-items-start">
                      {/* Logo */}
                      <div className="sdfsdfdsf">
                        <img src="/images/unnamed.webp" alt="" />
                      </div>

                      <div>
                        {/* Title */}
                        <div className="fw-bold" style={{ fontSize: "18px" }}>
                          Akasa Priority @ Just ₹ 875
                        </div>

                        {/* Subtitle */}
                        <div className="text-muted small mb-2">
                          Skip queues, get your bags first, and board early with
                          Akasa Priority.
                        </div>

                        {/* Features Row */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <div className="d-flex align-items-center gap-1">
                            <i className="bi sfgdgsfsfsf-icon bi-person-check-fill"></i>

                            <span className="small">Priority Check-in</span>
                          </div>

                          <span>+</span>

                          <div className="d-flex align-items-center gap-1">
                            <i className="bi sfgdgsfsfsf-icon bi-suitcase-lg-fill"></i>

                            <span className="small">Priority Bag Service</span>
                          </div>

                          <span>+</span>

                          <div className="d-flex align-items-center gap-1">
                            <i className="bi sfgdgsfsfsf-icon bi-airplane-engines-fill"></i>

                            <span className="small">Priority Boarding</span>
                          </div>

                          <span>=</span>

                          <strong>₹ 875</strong>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="btn btn-outline-primary rounded-pill px-4">
                      +ADD
                    </button>
                  </div>
                </div>

                {/* Traveller Details */}
                <div className="huikgh56">
                  <div className="card-box">
                    <h5 className="mb-3">Traveller Details</h5>

                    {/* Login Box */}
                    <div className="login-box mb-3 px-0 py-2 text-center">
                      <span>
                        <i
                          style={{ color: "var(--main-green-color)" }}
                          className="bi bi-lock-fill"
                        ></i>{" "}
                        Log in to view your saved traveller list, unlock amazing
                        deals & much more!
                      </span>{" "}
                      <a
                        style={{
                          color: "var(--blue-primary-color)",
                          fontWeight: 500,
                        }}
                        href="/"
                      >
                        LOGIN NOW
                      </a>
                    </div>

                    {/* Adult Section */}
                    {/* <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="section-title">👤 ADULT (12 yrs+)</div>
                      <small>0/1 added</small>
                    </div> */}

                    {/* Important */}
                    {/* <div className="important-box mb-3">
                      <strong>Important:</strong> Enter name as mentioned on
                      your passport or Government approved IDs.
                    </div> */}

                    {/* Add Adult */}
                    {/* <div className="add-box mb-4">
                      <p className="mb-2">
                        You have not added any adults to the list
                      </p>
                      <a
                        href="/"
                        className="add-link"
                        onClick={() => alert("Add adult functionality")}
                      >
                        + ADD NEW ADULT
                      </a>
                    </div> */}

                    {/* =========================
                          ADULT SECTION
                    ========================= */}

                    <div className="card-box">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="section-title">👤 ADULT (12 yrs+)</div>

                        <small>
                          {adultForms.length}/{adultCount} added
                        </small>
                      </div>

                      <div className="important-box mb-3">
                        <strong>Important:</strong>
                        Enter name as mentioned on your passport or Government
                        approved IDs.
                        <br />
                        Please ensure that the Frequent Flyer No entered here is
                        against the same passenger name otherwise the points
                        will not be updated by the airline.
                      </div>

                      {/* Adult Forms */}

                      {adultForms.map((adult, index) => (
                        <div className="border rounded mb-3" key={index}>
                          <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                            <div>
                              <input
                                type="checkbox"
                                checked
                                readOnly
                                className="form-check-input me-2"
                              />

                              <strong>ADULT {index + 1}</strong>
                            </div>

                            <button
                              className="btn btn-sm btn-link text-danger text-decoration-none"
                              onClick={() => handleRemoveAdult(index)}
                            >
                              ×
                            </button>
                          </div>

                          <div className="p-3">
                            {/* <div className="row g-3"> */}
                            <AdultFields
                              adult={adult}
                              index={index}
                              countryCode={countryCode}
                              adultRule={adultRule}
                              handleAdultChange={handleAdultChange}
                            />
                            {/* </div> */}

                            {/* Frequent Flyer */}

                            <div className="mt-3">
                              <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => toggleFF("adult", index)}
                              >
                                <strong>Frequent Flyer Number</strong>

                                <small className="ms-1">
                                  (Avail extra benefits & earn points)
                                </small>
                              </button>
                            </div>

                            {adult.showFF && (
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>Frequent Flyer Airline</label>

                                  <select
                                    className="form-select"
                                    value={adult.airline}
                                    onChange={(e) =>
                                      handleAdultChange(
                                        index,
                                        "airline",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select Airline</option>

                                    <option value="AI">Air India</option>

                                    <option value="6E">IndiGo</option>

                                    <option value="UK">Vistara</option>
                                  </select>
                                </div>

                                <div className="col-md-4">
                                  <label>Frequent Flyer No</label>

                                  <input
                                    className="form-control"
                                    value={adult.ffNumber}
                                    onChange={(e) =>
                                      handleAdultChange(
                                        index,
                                        "ffNumber",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Empty Message */}

                      {adultForms.length === 0 && (
                        <div className="add-box mb-3">
                          <p>You have not added any adults to the list</p>
                        </div>
                      )}
                      {/* Add Adult */}
                      {adultForms.length < adultCount ? (
                        <button
                          className="btn btn-link p-0"
                          onClick={handleAddAdult}
                        >
                          + ADD NEW ADULT
                        </button>
                      ) : (
                        <div className="alert alert-warning mt-3 mb-0">
                          You have already selected{" "}
                          <strong>{adultCount}</strong> ADULT(s). Remove one
                          before adding a new one.
                        </div>
                      )}
                    </div>
                    {/* =========================
                            CHILD SECTION
                      ========================= */}
                    {childCount > 0 && (
                      <div className="card-box mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="section-title">
                            👦 CHILD (2 - 12 yrs)
                          </div>
                          <small>
                            {childForms.length}/{childCount} added
                          </small>
                        </div>
                        <div className="important-box mb-3">
                          <strong>Important:</strong> Enter name exactly as per
                          Government ID / Passport.
                        </div>
                        {childForms.map((child, index) => (
                          <div className="border rounded mb-3" key={index}>
                            <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                              <strong>CHILD {index + 1}</strong>
                              <button
                                type="button"
                                className="btn btn-link text-danger text-decoration-none"
                                onClick={() => handleRemoveChild(index)}
                              >
                                ×
                              </button>
                            </div>
                            <div className="p-3">
                              <ChildFields
                                child={child}
                                index={index}
                                childRule={childRule}
                                handleChildChange={handleChildChange}
                              />
                            </div>
                          </div>
                        ))}
                        {childForms.length === 0 && (
                          <div className="add-box mb-3">
                            <p>You have not added any child to the list</p>
                          </div>
                        )}
                        {childForms.length < childCount ? (
                          <button
                            className="btn btn-link p-0"
                            onClick={handleAddChild}
                          >
                            + ADD NEW CHILD
                          </button>
                        ) : (
                          <div className="alert alert-warning mt-3 mb-0">
                            You have already selected{" "}
                            <strong>{childCount}</strong> CHILD. Remove one
                            before adding a new one.
                          </div>
                        )}
                      </div>
                    )}
                    {/* =========================
                            INFANT SECTION
                      ========================= */}
                    {infantCount > 0 && (
                      <div className="card-box mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="section-title">
                            👶 INFANT (0 - 2 yrs)
                          </div>

                          <small>
                            {infantForms.length}/{infantCount} added
                          </small>
                        </div>

                        <div className="important-box mb-3">
                          Infant Date of Birth is mandatory.
                        </div>

                        {infantForms.map((infant, index) => (
                          <div className="border rounded mb-3" key={index}>
                            <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                              <strong>INFANT {index + 1}</strong>

                              <button
                                type="button"
                                className="btn btn-link text-danger text-decoration-none"
                                onClick={() => handleRemoveInfant(index)}
                              >
                                ×
                              </button>
                            </div>

                            <div className="p-3">
                              <InfantsFields
                                infant={infant}
                                index={index}
                                infantRule={infantRule}
                                handleInfantChange={handleInfantChange}
                              />
                            </div>
                          </div>
                        ))}

                        {infantForms.length === 0 && (
                          <div className="add-box mb-3">
                            <p>You have not added any infant to the list</p>
                          </div>
                        )}

                        {infantForms.length < infantCount ? (
                          <button
                            className="btn btn-link p-0"
                            onClick={handleAddInfant}
                          >
                            + ADD NEW INFANT
                          </button>
                        ) : (
                          <div className="alert alert-warning mt-3 mb-0">
                            You have already selected{" "}
                            <strong>{infantCount}</strong> INFANT. Remove one
                            before adding a new one.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact Form */}
                    <p className="mb-2 mt-2 fw-semibold">
                      Booking details will be sent to
                    </p>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Country Code</label>
                        <select
                          className="form-select"
                          value={billingDetails.billingCountryCode}
                          onChange={(e) => {
                            setBillingDetails({
                              ...billingDetails,
                              billingCountryCode: e.target.value,
                            });
                            setBillingError("");
                          }}
                        >
                          <option value="">Select Country Code</option>

                          {countryCode.map((country) => (
                            <option key={country.id} value={country.phone_code}>
                              {country.name} ({country.phone_code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Mobile No</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mobile No"
                          value={billingDetails.billingMobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setBillingDetails({
                              ...billingDetails,
                              billingMobile: value,
                            });
                            setBillingError("");
                          }}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          value={billingDetails.billingEmail}
                          onChange={(e) => {
                            setBillingDetails({
                              ...billingDetails,
                              billingEmail: e.target.value,
                            });
                            setBillingError("");
                          }}
                        />
                      </div>
                    </div>

                    {/* GST */}
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="gstCheckbox"
                        checked={showGST}
                        onChange={(e) => setShowGST(e.target.checked)}
                      />
                      <label
                        className="form-check-label checkbox-label"
                        htmlFor="gstCheck"
                      >
                        I have a GST number{" "}
                        <span className="text-muted">(Optional)</span>
                      </label>
                    </div>

                    {/* GST Field */}
                    {/* <div id="gstField" className="mt-3 d-none">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter GST Number"
                      />
                    </div> */}
                    {showGST && (
                      <div className="row">
                        <div id="companyname" className="mt-3 col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Company Name"
                            value={companyName}
                            onChange={(e) => setcompanyName(e.target.value)}
                          />
                        </div>
                        <div id="gstField" className="mt-3 col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter GST Number"
                            value={gstNumber}
                            onChange={(e) =>
                              setGstNumber(e.target.value.toUpperCase())
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* State Section */}
                <div className="dhdsfsd788">
                  <div className="state-box mt-4">
                    <h6 className="fw-semibold">
                      Your State{" "}
                      <small className="text-muted fw-normal">
                        (Required for GST purpose on your tax invoice. You can
                        edit this anytime later in your profile section.)
                      </small>
                    </h6>

                    <div className="mt-2">
                      <label className="form-label">Select the State</label>
                      <select
                        className="form-select state-select"
                        value={billingDetails.billingState}
                        onChange={(e) => {
                          setBillingDetails({
                            ...billingDetails,
                            billingState: e.target.value,
                          });

                          setBillingError("");
                        }}
                      >
                        <option value="">Select State</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>

                    <div className="form-check mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="saveBilling"
                        checked={saveBilling}
                        onChange={(e) => {
                          setSaveBilling(e.target.checked);
                          setBillingError("");
                        }}
                      />
                      <label className="form-check-label" htmlFor="saveBilling">
                        Confirm and save billing details to your profile
                      </label>
                    </div>
                  </div>

                  {billingError && (
                    <div className="text-danger mt-2">{billingError}</div>
                  )}
                </div>

                <div className="sdejvfhsikdjl mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4"
                    onClick={() => {
                      handleContinue();
                      // setFlightBookingModal(prev => !prev);
                    }}
                  >
                    Continue
                    {/* Continue To Pay */}
                  </button>
                </div>

                {showSeatMealSection && hasSeatOrMeal && (
                  <>
                    <div className="ucbhsduodkf mt-4">
                      {/* =========================================================
                          SEATS / MEALS TAB HEADER
                      ========================================================= */}
                      <div className="header-block">
                        <ul
                          className="nav nav-tabs mb-0 ps-0"
                          id="myTab"
                          role="tablist"
                        >
                          {/* ================= SEATS TAB ================= */}
                          {hasSeatMap && (
                            <li className="nav-item" role="presentation">
                              <button
                                type="button"
                                className={`nav-link ${
                                  activeSeatMealTab === "seats" ? "active" : ""
                                }`}
                                id="seats-tab"
                                role="tab"
                                aria-selected={activeSeatMealTab === "seats"}
                                onClick={() => setActiveSeatMealTab("seats")}
                              >
                                <img
                                  src="/images/seatda.png"
                                  className="me-1"
                                  alt=""
                                />
                                Seats
                              </button>
                            </li>
                          )}

                          {/* ================= MEALS TAB ================= */}
                          {hasMeal && (
                            <li className="nav-item" role="presentation">
                              <button
                                type="button"
                                className={`nav-link ${
                                  activeSeatMealTab === "meals" ? "active" : ""
                                }`}
                                id="meals-tab"
                                role="tab"
                                aria-selected={activeSeatMealTab === "meals"}
                                onClick={() => setActiveSeatMealTab("meals")}
                              >
                                <img
                                  src="/images/fast-food.png"
                                  className="me-1"
                                  alt=""
                                />
                                Meals
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* =========================================================
                          TAB CONTENT
                      ========================================================= */}
                      <div className="tab-content" id="myTabContent">
                        {/* =======================================================
                            SEATS
                        ======================================================= */}
                        {hasSeatMap && (
                          <div
                            className={`tab-pane ${
                              activeSeatMealTab === "seats" ? "show active" : ""
                            }`}
                            id="seats"
                            role="tabpanel"
                            aria-labelledby="seats-tab"
                          >
                            <div className="duisanfjsdfsf position-relative">
                              <FlightSeats
                                seatMap={seatMap}
                                adultCount={adultCount}
                                childCount={childCount}
                                infantCount={infantCount}
                                bookingPassengers={bookingPassengers}
                                onSeatSelectionComplete={
                                  setIsSeatSelectionComplete
                                }
                                onSeatChange={(seats) => {
                                  console.log("Selected seats:", seats);
                                  setSelectedSeats(seats);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* =======================================================
                            MEALS
                        ======================================================= */}
                        <div
                          className={`tab-pane ${
                            activeSeatMealTab === "meals" ? "show active" : ""
                          }`}
                          id="meals"
                          role="tabpanel"
                          aria-labelledby="meals-tab"
                        >
                          <div className="doismkfjhisd py-3">
                            {/* =====================================================
                                  HEADER
                              ===================================================== */}
                            <div className="duisnuiherer border-bottom pb-3 mb-3">
                              <div className="oidiewrwer d-flex justify-content-between mb-3">
                                <div className="diewirhwerwer">
                                  <h5 className="mb-2">
                                    <b>
                                      {segment?.Origin_City?.replace(
                                        /\s*\(.*?\)/g,
                                        "",
                                      )}
                                    </b>

                                    {" - "}

                                    <b>
                                      {segment?.Destination_City?.replace(
                                        /\s*\(.*?\)/g,
                                        "",
                                      )}
                                    </b>
                                  </h5>

                                  <h6 className="mb-0">
                                    <span>{selectedMealCount}</span>

                                    {" of "}

                                    <span>{totalPassengers}</span>

                                    {" selected"}
                                  </h6>
                                </div>

                                <p className="mb-0">Select your meal</p>
                              </div>

                              {/* =====================================================
                                    VEG / NON VEG FILTER
                                ===================================================== */}

                              <div className="dioewiuhrew d-flex gap-2">
                                {/* ALL */}

                                <button
                                  type="button"
                                  className={`d-inline-flex align-items-center gap-2 px-3 border rounded-pill bg-white ${
                                    activeMealFilter === "all"
                                      ? "border-primary text-primary"
                                      : ""
                                  }`}
                                  onClick={() => setActiveMealFilter("all")}
                                >
                                  <b>All</b>
                                </button>

                                {/* VEG */}

                                <button
                                  type="button"
                                  className={`d-inline-flex align-items-center gap-2 px-3 border rounded-pill bg-white ${
                                    activeMealFilter === "veg"
                                      ? "border-primary text-primary"
                                      : ""
                                  }`}
                                  onClick={() => setActiveMealFilter("veg")}
                                >
                                  <img
                                    src="/images/veg.png"
                                    alt="Veg"
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />

                                  <b>Veg</b>
                                </button>

                                {/* NON VEG */}

                                <button
                                  type="button"
                                  className={`d-inline-flex align-items-center gap-2 px-3 border rounded-pill bg-white ${
                                    activeMealFilter === "nonveg"
                                      ? "border-primary text-primary"
                                      : ""
                                  }`}
                                  onClick={() => setActiveMealFilter("nonveg")}
                                >
                                  <img
                                    src="/images/nonveg.png"
                                    alt="Non Veg"
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />

                                  <b>Non Veg</b>
                                </button>
                              </div>
                            </div>
                            {/* =====================================================
                                  MEAL LIST
                              ===================================================== */}
                            <div className="dmiwejrwer row">
                              {mealsList
                                ?.filter((meal) => {
                                  if (activeMealFilter === "all") {
                                    return true;
                                  }

                                  return getMealType(meal) === activeMealFilter;
                                })
                                .map((meal, index) => {
                                  const isSelected = Object.values(
                                    selectedMeals,
                                  ).some(
                                    (selectedMeal) =>
                                      selectedMeal?.SSR_Code === meal?.SSR_Code,
                                  );

                                  return (
                                    <div
                                      className="col-lg-6 mb-4"
                                      key={`${meal?.SSR_Code}-${index}`}
                                    >
                                      <Meal
                                        meal={meal}
                                        mealName={getMealName(meal)}
                                        mealPrice={getMealPrice(meal)}
                                        selected={isSelected}
                                        onSelect={handleMealSelect}
                                      />
                                    </div>
                                  );
                                })}
                            </div>
                            {/* =====================================================
                                  SELECTED MEALS
                              ===================================================== */}
                            {selectedMealCount > 0 && (
                              <div className="border rounded-2 p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h6 className="mb-0">Selected Meals</h6>
                                  <h6 className="mb-0">
                                    <b>INR {totalMealPrice}</b>
                                  </h6>
                                </div>
                                {Object.entries(selectedMeals).map(
                                  ([passengerIndex, meal]) => (
                                    <div
                                      key={passengerIndex}
                                      className="d-flex justify-content-between align-items-center border-bottom py-2"
                                    >
                                      <div>
                                        <small className="text-muted">
                                          Passenger {Number(passengerIndex) + 1}
                                        </small>

                                        <p className="mb-0">
                                          {getMealName(meal)}
                                        </p>
                                      </div>

                                      <div className="d-flex align-items-center gap-3">
                                        <b>
                                          {meal?.Currency_Code || "INR"}{" "}
                                          {getMealPrice(meal)}
                                        </b>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() =>
                                            handleMealRemove(
                                              Number(passengerIndex),
                                            )
                                          }
                                        >
                                          REMOVE
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                            {/* =====================================================
                                  INFORMATION
                              ===================================================== */}
                            <div className="idcnuihiwer p-3 rounded-2 d-flex align-items-center gap-2 border mt-2">
                              <div className="uidnwehruiewr position-relative rounded-circle">
                                <i className="bi position-absolute top-50 start-50 translate-middle bi-gift"></i>
                              </div>

                              <div className="duihsnerew">
                                <h5 className="mb-1">
                                  All meals are freshly prepared and
                                  hygienically packed.
                                </h5>

                                <p className="mb-0">
                                  Availability may vary based on flight
                                  duration.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* =========================================================
                        CONTINUE BUTTON
                    ========================================================= */}
                    {activeSeatMealTab === "seats" && (
                        <div className="d-flex align-items-center gap-3 mt-3">

                            {/* SKIP SEAT */}
                            <button
                                type="button"
                                className="btn btn-link text-muted text-decoration-none"
                                onClick={handleSeatSkip}
                            >
                                Skip Seat Selection
                            </button>

                            {/* CONTINUE */}
                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-pill px-4"
                                onClick={handleSeatMealContinue}
                            >
                                Continue
                            </button>

                        </div>
                    )}

                    {/* =========================================================
                        MEAL CONTINUE BUTTON
                        Optional - use this for next step after meals
                    ========================================================= */}
                    {/* =========================================================
                          MEAL CONTINUE
                      ========================================================= */}

                      {activeSeatMealTab === "meals" && (
                          <div className="d-flex align-items-center gap-3 mt-3">

                              {/* SKIP MEALS */}
                              <button
                                  type="button"
                                  className="btn btn-link text-muted text-decoration-none"
                                  onClick={handleMealSkip}
                              >
                                  Skip Meals
                              </button>

                              {/* CONTINUE */}
                              <button
                                  type="button"
                                  className="btn btn-primary rounded-pill px-4"
                                  onClick={handleSeatMealContinue}
                              >
                                  Continue
                              </button>

                          </div>
                      )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="col-lg-3">
              <div className="sticky-top">
                {/* SUMMARY */}
                <div className="fgdfgdf mb-3">
                  <div className="summary overflow-hidden p-0">
                    <h6 className="mb-0 px-3 py-2">
                      <i className="bi me-1 bi-wallet"></i> Fare Summary
                    </h6>

                    <div className="diewnjrjwer p-3 py-0">
                      <table className="table mb-0">
                        {/* Base Fare */}
                        <tr>
                          <td>Base Fare</td>

                          <td>₹ {baseFare.toLocaleString("en-IN")}</td>
                        </tr>

                        {/* Adult */}
                        {adultFare && (
                          <tr>
                            <td className="asdfsdfsdf">
                              Adult(s) (1 X ₹{" "}
                              {Number(adultFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                              )
                            </td>

                            <td>
                              ₹{" "}
                              {Number(adultFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                            </td>
                          </tr>
                        )}

                        {/* Child */}
                        {childFare && (
                          <tr>
                            <td className="asdfsdfsdf">
                              Children (1 X ₹{" "}
                              {Number(childFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                              )
                            </td>

                            <td>
                              ₹{" "}
                              {Number(childFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                            </td>
                          </tr>
                        )}

                        {/* Infant */}
                        {infantFare && (
                          <tr>
                            <td className="asdfsdfsdf">
                              Infant (1 X ₹{" "}
                              {Number(infantFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                              )
                            </td>

                            <td style={{ borderBottom: 0 }}>
                              ₹{" "}
                              {Number(infantFare.Basic_Amount).toLocaleString(
                                "en-IN",
                              )}
                            </td>
                          </tr>
                        )}

                        {/* Airport Taxes */}
                        <tr>
                          <td
                            className="asdfsdfsdf"
                            style={{ borderBottom: 0 }}
                          >
                            Taxes and Surcharges
                          </td>

                          <td style={{ borderBottom: 0 }}>
                            ₹ {taxesAndSurcharges.toLocaleString("en-IN")}
                          </td>
                        </tr>

                        {/* Divider */}
                        <tr>
                          <td
                            colSpan="2"
                            className="py-0"
                            style={{ borderBottom: 0 }}
                          >
                            <hr className="m-0 p-0" />
                          </td>
                        </tr>

                        {/* Total */}
                        <tr className="ojdeopekwrer">
                          <td style={{ fontWeight: 600 }}>Total Amount</td>

                          <td style={{ fontWeight: 600 }}>
                            ₹ {totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                {/* COUPON */}
                <div className="dfdff5585">
                  <div className="coupon-box">
                    <div className="hjhjk">
                      <h6 className="mb-0 px-3 py-2">
                        <i className="bi me-1 bi-tags"></i>Coupon Codes
                      </h6>

                      <div className="bg-white udnjeweopelr px-3 mt-3">
                        <div className="deiwhrwerwer position-relative mb-3">
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter coupon code"
                              value={selectedCoupon ? selectedCoupon : ""}
                              onChange={() => setSelectedCoupon(null)}
                              disabled={selectedCoupon ? true : false}
                            />

                            <button
                              onClick={() => setSelectedCoupon(null)}
                              className={
                                selectedCoupon
                                  ? "btn remove-coupon-btn position-absolute"
                                  : "btn position-absolute"
                              }
                            >
                              {selectedCoupon ? "Remove" : "Apply"}
                            </button>
                          </div>

                          {selectedCoupon && (
                            <p className="copn-msge my-2">
                              Congratulations! Instant Discount of Rs. ₹229 has
                              been applied successfully.
                            </p>
                          )}
                        </div>

                        <div className="deiwhrwerwer">
                          <label htmlFor="c1" className="coupon-card">
                            <input
                              type="radio"
                              checked={selectedCoupon === "MMTTRAVEL"}
                              onChange={() => handleSelectedModal("MMTTRAVEL")}
                              name="ucfewfrew"
                              id="c1"
                              className="d-none position-absolute"
                            />

                            <div className="coupon-top d-flex align-items-center justify-content-between mb-1">
                              <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                <img
                                  src="/images/discount.png"
                                  className="coupon-icon"
                                  alt=""
                                />
                                <strong className="frgrfg5559">
                                  MMTTRAVEL
                                </strong>
                              </div>

                              <span className="discount">₹229 off</span>
                            </div>
                            <p className="desc mb-0">
                              Log in to get up to 15% OFF.
                              <br />
                              Offer valid for new users only
                            </p>
                          </label>

                          <label htmlFor="c2" className="coupon-card">
                            <input
                              type="radio"
                              checked={selectedCoupon === "MMTSECUREV"}
                              onChange={() => handleSelectedModal("MMTSECUREV")}
                              name="ucfewfrew"
                              id="c2"
                              className="d-none position-absolute"
                            />

                            <div className="coupon-top d-flex align-items-center justify-content-between">
                              <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                <img
                                  src="/images/discount.png"
                                  className="coupon-icon"
                                  alt=""
                                />
                                <strong className="frgrfg5559">
                                  MMTSECUREV
                                </strong>
                              </div>
                              <span className="discount">₹229 off</span>
                            </div>
                            <p className="desc mb-0">
                              Get an instant discount of ₹229 on your flight
                              booking
                              <br />
                              and Trip Secure combo
                            </p>
                          </label>

                          <label htmlFor="c3" className="coupon-card">
                            <input
                              type="radio"
                              checked={selectedCoupon === "MMTSECUREL"}
                              onChange={() => handleSelectedModal("MMTSECUREL")}
                              name="ucfewfrew"
                              id="c3"
                              className="d-none position-absolute"
                            />

                            <div className="coupon-top d-flex align-items-center justify-content-between">
                              <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                <img
                                  src="/images/discount.png"
                                  className="coupon-icon"
                                  alt=""
                                />
                                <strong className="frgrfg5559">
                                  MMTSECUREL
                                </strong>
                              </div>
                              <span className="discount">₹229 off</span>
                            </div>
                            <p className="desc mb-0">
                              Get an instant discount of ₹229 on your flight
                              booking
                              <br />
                              and Trip Secure combo
                            </p>
                          </label>

                          <label htmlFor="c4" className="coupon-card">
                            <input
                              type="radio"
                              checked={selectedCoupon === "MMTSECUREJ"}
                              onChange={() => handleSelectedModal("MMTSECUREJ")}
                              name="ucfewfrew"
                              id="c4"
                              className="d-none position-absolute"
                            />

                            <div className="coupon-top d-flex align-items-center justify-content-between">
                              <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                <img
                                  src="/images/discount.png"
                                  className="coupon-icon"
                                  alt=""
                                />
                                <strong className="frgrfg5559">
                                  MMTSECUREJ
                                </strong>
                              </div>
                              <span className="discount">₹ 229 off</span>
                            </div>
                            <p className="desc mb-0">
                              Get an instant discount of ₹229 on your flight
                              booking
                              <br />
                              and Trip Secure combo
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="fgderhsraerr text-center">
                      <button
                        onClick={handleAllModalToggle}
                        className="btn sgsfeqaedqrrr pb-2"
                      >
                        View All Coupons
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fareRuleModal && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0,0,0,.6)",
            zIndex: 99999,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h5 className="modal-title">Fare Rules</h5>

                <button
                  className="btn-close"
                  onClick={() => setFareRuleModal(false)}
                />
              </div>

              <div className="modal-body">
                {/* Tabs */}

                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "cancel" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("cancel")}
                    >
                      Cancellation Charges
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "reschedule" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("reschedule")}
                    >
                      Date Change Charges
                    </button>
                  </li>
                </ul>

                {/* Cancellation */}

                {activeTab === "cancel" && (
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="50%">
                          Applicable Time
                          <br />
                          (From Scheduled Flight departure)
                        </th>
                        <th width="50%">
                          Charges
                          <br />
                          (Per passenger)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {(() => {
                        // Collect all cancellation charges from Adult/Child/Infant
                        const allCharges = allfareDetails.flatMap(
                          (fareDetail) =>
                            (fareDetail?.CancellationCharges || []).map(
                              (charge) => ({
                                ...charge,
                                paxType: fareDetail.PAX_Type,
                              }),
                            ),
                        );

                        // Group charges by duration
                        const groupedCharges = allCharges.reduce(
                          (groups, charge) => {
                            const key = `${charge.DurationFrom}-${charge.DurationTo}-${charge.DurationTypeFrom}-${charge.DurationTypeTo}`;

                            if (!groups[key]) {
                              groups[key] = [];
                            }

                            groups[key].push(charge);

                            return groups;
                          },
                          {},
                        );

                        return Object.values(groupedCharges).map(
                          (charges, index) => {
                            const firstCharge = charges[0];

                            const getPassengerName = (paxType) => {
                              if (paxType === 0) return "ADULT";
                              if (paxType === 1) return "CHILD";
                              if (paxType === 2) return "INFANT";

                              return "PASSENGER";
                            };

                            const formatCharge = (charge) => {
                              if (!charge) return "₹0";

                              if (
                                charge.Value === undefined ||
                                charge.Value === null ||
                                charge.Value === ""
                              ) {
                                return "₹0";
                              }

                              if (charge.ValueType === 1) {
                                return `${charge.Value}% of Fare`;
                              }

                              if (isNaN(Number(charge.Value))) {
                                return charge.Value;
                              }

                              return `₹${Number(charge.Value).toLocaleString("en-IN")}`;
                            };

                            return (
                              <tr key={index}>
                                {/* Applicable Time */}
                                <td>
                                  If cancelled between{" "}
                                  <strong>{firstCharge.DurationFrom} </strong>
                                  {firstCharge.DurationTypeFrom === 0
                                    ? "hours"
                                    : "days"}{" "}
                                  to <strong>{firstCharge.DurationTo} </strong>
                                  {firstCharge.DurationTypeTo === 0
                                    ? "hours"
                                    : "days"}{" "}
                                  before departure
                                </td>

                                {/* Charge */}
                                <td style={{ fontWeight: 500 }}>
                                  {charges.map((charge) => (
                                    <div key={charge.paxType} className="mb-1">
                                      <strong>
                                        {getPassengerName(charge.paxType)}:
                                      </strong>{" "}
                                      {formatCharge(charge)}
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            );
                          },
                        );
                      })()}
                    </tbody>
                  </table>
                )}

                {/* Reschedule */}

                {activeTab === "reschedule" && (
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="50%">
                          Applicable Time
                          <br />
                          (From Scheduled Flight departure)
                        </th>
                        <th width="50%">
                          Charges
                          <br />
                          (Per passenger)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {(() => {
                        const allCharges = allfareDetails.flatMap(
                          (fareDetail) =>
                            (fareDetail?.RescheduleCharges || []).map(
                              (charge) => ({
                                ...charge,
                                paxType: fareDetail.PAX_Type,
                              }),
                            ),
                        );

                        const groupedCharges = allCharges.reduce(
                          (groups, charge) => {
                            const key = `${charge.DurationFrom}-${charge.DurationTo}-${charge.DurationTypeFrom}-${charge.DurationTypeTo}`;

                            if (!groups[key]) {
                              groups[key] = [];
                            }

                            groups[key].push(charge);

                            return groups;
                          },
                          {},
                        );

                        const getPassengerName = (paxType) => {
                          if (paxType === 0) return "ADULT";
                          if (paxType === 1) return "CHILD";
                          if (paxType === 2) return "INFANT";

                          return "PASSENGER";
                        };

                        const formatCharge = (charge) => {
                          if (!charge) return "₹0";

                          if (
                            charge.Value === undefined ||
                            charge.Value === null ||
                            charge.Value === ""
                          ) {
                            return "₹0";
                          }

                          if (charge.ValueType === 1) {
                            return `${charge.Value}% of Fare`;
                          }

                          if (isNaN(Number(charge.Value))) {
                            return charge.Value;
                          }

                          return `₹${Number(charge.Value).toLocaleString("en-IN")}`;
                        };

                        return Object.values(groupedCharges).map(
                          (charges, index) => {
                            const firstCharge = charges[0];

                            return (
                              <tr key={index}>
                                <td>
                                  If rescheduled between{" "}
                                  <strong>{firstCharge.DurationFrom} </strong>
                                  {firstCharge.DurationTypeFrom === 0
                                    ? "hours"
                                    : "days"}{" "}
                                  to <strong>{firstCharge.DurationTo} </strong>
                                  {firstCharge.DurationTypeTo === 0
                                    ? "hours"
                                    : "days"}{" "}
                                  before departure
                                </td>

                                <td>
                                  {charges.map((charge) => (
                                    <div key={charge.paxType} className="mb-1">
                                      <strong>
                                        {getPassengerName(charge.paxType)}:
                                      </strong>{" "}
                                      {formatCharge(charge)}
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            );
                          },
                        );
                      })()}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* add baggage modal start */}

      {addBaggageModal && (
        <div
          className="inkmlkjsoidr modal fade show d-block"
          style={{
            background: "rgba(0,0,0,.6)",
            zIndex: 99999,
          }}
        >
          <div className={`modal-dialog modal-lg modal-dialog-centered ${(Object.keys(selectedSSR).length > 0) ? "" : "modal-baggage-hide"}`}>
            <div className="modal-content">
              <div className="modal-header py-2">
                <h5 className="modal-title">Add Extra Baggage</h5>

                <button
                  className="btn-close"
                  onClick={() => setAddBaggageModal(false)}
                />
              </div>

              <div className="modal-body add-extra-baggage pt-1">
                <div className="row">
                  <div className={(Object.keys(selectedSSR).length > 0) ? "col-lg-7" : "col-lg-12"}>
                    <div className="ucbhsjudhfsdf">
                      {/* ========================================= */}
                      {/* PASSENGER SELECTION */}
                      {/* ========================================= */}

                      <div className="mb-2">
                        <h6 className="hgadsdzxeww mb-3">Select Passenger</h6>

                        <div className="row g-2">
                          {baggagePassengers.map((passenger) => (
                            <div className="col-md-4" key={passenger.key}>
                              <button
                                type="button"
                                className={`w-100 text-start border rounded p-2 d-flex gap-2 ${
                                  selectedPassenger?.key === passenger.key
                                    ? "border-primary bg-light"
                                    : ""
                                }`}
                                onClick={() => setSelectedPassenger(passenger)}
                              >
                                <input type="radio" checked={selectedPassenger?.key === passenger.key} className="form-check-input" />

                                <div className="dojafsdf">
                                  <div className="fw-semibold">{passenger.name}</div>

                                  <small className="text-muted">
                                    {passenger.label}
                                  </small>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ========================================= */}
                      {/* BAGGAGE LIST */}
                      {/* ========================================= */}

                      {!selectedPassenger ? (
                        <div className="text-center py-4 text-muted">
                          Please select a passenger to add baggage.
                        </div>
                      ) : baggageList.length > 0 ? (
                        <div className="list-group">
                          {baggageList.map((bag, index) => {
                            const passengerKey = selectedPassenger.key;
                            const baggageKey = bag.SSR_Key;
                            const selectedBag =
                              selectedSSR?.[passengerKey]?.[baggageKey];
                            const quantity = selectedBag?.quantity || 0;
                            return (
                              <div
                                key={index}
                                className="d-flex justify-content-between align-items-center gap-4 border rounded p-3 mb-3"
                              >
                                {/* BAGGAGE INFORMATION */}

                                <div className="dnnmakwrr d-flex align-items-center">
                                  <i
                                    className="bi bi-backpack2 me-3"
                                    style={{
                                      fontSize: "28px",
                                      color: "#666",
                                    }}
                                  />

                                  <div>
                                    <h6 className="mb-1">
                                      {bag.SSR_TypeDesc?.replace(
                                        "Prepaid Excess Baggage",
                                        "Additional Baggage",
                                      ).replace(/(\d+)\s*kg/i, "$1 KG")}
                                    </h6>

                                    <small className="text-muted">
                                      {bag.Currency_Code}
                                    </small>
                                  </div>
                                </div>

                                {/* PRICE + QUANTITY */}

                                <div className="ajidbajoijmdd d-flex align-items-center">
                                  <h5 className="me-3 mb-0">
                                    ₹{Number(bag.Total_Amount).toLocaleString()}
                                  </h5>

                                  {quantity > 0 ? (
                                    <div
                                      className="d-flex align-items-center border rounded"
                                      style={{ width: "130px" }}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-remove-bag p-2 flex-fill"
                                        onClick={() => handleRemoveSSR(bag)}
                                      >
                                        <i className="bi bi-dash-lg"></i>
                                      </button>

                                      <span className="idajsjiw flex-fill text-center">
                                        {quantity}
                                      </span>

                                      <button
                                        type="button"
                                        className="btn btn-add-bag p-2 flex-fill"
                                        onClick={() => handleIncreaseSSR(bag)}
                                      >
                                        <i className="bi bi-plus-lg"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      style={{ width: "5rem" }}
                                      type="button"
                                      className="btn btn-tour px-3 py-1"
                                      onClick={() => handleSelectSSR(bag)}
                                    >
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4">No baggage available.</div>
                      )}
                    </div>
                  </div>

                  <div className={`col-lg-5 bxfgsxdgcdb ${(Object.keys(selectedSSR).length > 0) ? "selected-baggage-show" : "selected-baggage-show selected-baggage-hide" }`}>
                    {Object.keys(selectedSSR).length > 0 && (
                      <div className="bg-light d-flex flex-column justify-content-between">
                        <div className="idonisnfinsdf flex-fill">
                          <p className="mb-2 hgadsdzxeww">Selected Baggage</p>

                          <div className="duihskfnisdf">
                            {Object.entries(selectedSSR).map(
                              ([passengerKey, baggage]) => {
                                const passenger = baggagePassengers.find(
                                  (p) => p.key === passengerKey,
                                );

                                return (
                                  <div key={passengerKey} className="nmdkjimnfnsdf pb-2 mb-3">
                                    <div className="fw-semibold">
                                      {passenger?.name || passengerKey}
                                    </div>

                                    {Object.values(baggage).map((item) => (
                                      <div
                                        key={item.SSR_Key}
                                        className="idnmsihfsdf d-flex justify-content-between align-items-center gap-2 mb-2"
                                      >
                                        <span className="text-muted">
                                          {item.SSR_TypeName} × {item.quantity}
                                        </span>

                                        <span className="duiewnrme-divider"></span>

                                        <span>
                                          ₹
                                          {(
                                            Number(item.Total_Amount) *
                                            Number(item.quantity)
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              },
                            )}  
                          </div>                          
                        </div>
                        
                        <div className="doinsdoifjhosdf d-flex flex-column justify-content-between pt-2">
                          {/* TOTAL */}

                          <div className="donsdifnsmdfs d-flex align-items-center justify-content-between mb-4">
                            <p className="hgadsdzxeww mb-0">Added to fare</p>

                            <h3 className="sxvdgzzdss mb-0">
                              ₹
                              {Object.values(selectedSSR)
                                .flatMap((baggage) => Object.values(baggage))
                                .reduce(
                                  (sum, item) =>
                                    sum +
                                    Number(item.Total_Amount || 0) *
                                      Number(item.quantity || 0),
                                  0,
                                )
                                .toLocaleString()}
                            </h3>
                          </div>

                          {/* DONE */}

                          <button
                            type="button"
                            className="btn btn-tour px-4"
                            onClick={() => {
                              console.log("SELECTED BAGGAGE:", selectedSSR);

                              setAddBaggageModal(false);
                            }}
                          >
                            DONE
                          </button>
                        </div>                        
                      </div>
                    )}
                  </div>
                </div>               
              </div>              
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SEAT RECOMMENDATION MODAL
      ========================================================= */}

      {showSeatRecommendationModal && (
          <>
              {/* Overlay */}
              <div
                  className="seat-recommendation-overlay"
                  onClick={handleSeatSkip}
              ></div>

              {/* Modal */}
              <div className="seat-recommendation-modal">

                  {/* TOP SKIP */}
                  <button
                      type="button"
                      className="seat-recommendation-skip"
                      onClick={handleSeatSkip}
                  >
                      Skip
                  </button>

                  {/* ICON */}
                  <div className="seat-recommendation-icon">
                      <img
                          src="/images/seatda.png"
                          alt="Seat"
                      />
                  </div>

                  {/* TITLE */}
                  <h5>
                      We have chosen the best seat specially for you
                  </h5>

                  {/* ROUTE */}
                  <div className="seat-route">
                      {segment?.Origin_City?.replace(
                          /\s*\(.*?\)/g,
                          "",
                      )}

                      {" ✈ "}

                      {segment?.Destination_City?.replace(
                          /\s*\(.*?\)/g,
                          "",
                      )}
                  </div>

                  {/* RECOMMENDED SEAT */}
                  <div className="recommended-seat-box">

                      <div className="recommended-seat-name">

                          <strong>
                              {recommendedSeat?.SSR_Name ||
                                  recommendedSeat?.Seat_Number ||
                                  recommendedSeat?.SeatNo ||
                                  "12F"}
                          </strong>

                          <span>
                              {" "}
                              (
                              {recommendedSeat?.SSR_TypeDesc ||
                                  "WINDOW"}
                              )
                          </span>

                      </div>

                      <div className="recommended-seat-price">
                          ₹{" "}
                          {recommendedSeat?.Amount ||
                              recommendedSeat?.Price ||
                              recommendedSeat?.SSR_Amount ||
                              250}
                      </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="seat-recommendation-buttons">

                      {/* LET ME CHOOSE */}
                      <button
                          type="button"
                          className="btn btn-outline-primary rounded-pill"
                          onClick={handleChooseSeat}
                      >
                          Let Me Choose
                      </button>

                      {/* ACCEPT */}
                      <button
                          type="button"
                          className="btn btn-primary rounded-pill"
                          onClick={() =>
                              handleAcceptRecommendedSeat(
                                  recommendedSeat,
                              )
                          }
                      >
                          Yes, I Like It
                      </button>

                  </div>

                  {/* SKIP */}
                  <button
                      type="button"
                      className="skip-seat-bottom"
                      onClick={handleSeatSkip}
                  >
                      Skip Seat Selection
                  </button>

              </div>
          </>
      )}

      {/* add baggage modal end */}

      {/* all coupon modal start */}

      <div
        className={`${allCouponModal ? "all-coupon-modal-backdrop" : "all-coupon-modal-backdrop all-coupon-modal-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}
      ></div>

      <div
        className={`${allCouponModal ? "all-coupon-modal" : "all-coupon-modal all-coupon-modal-hide"} d-flex flex-column bg-white top-0 bottom-0 px-4 py-3 position-fixed`}
      >
        <div className="all-coupon-modal-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <b>All Coupons</b>
          </h5>

          <i onClick={handleAllModalToggle} className="fa-solid fa-xmark"></i>
        </div>

        <div className="all-coupon-modal-body">
          <div className="mt-3">
            <div className="deiwhrwerwer position-relative mb-3">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter coupon code"
                  value={selectedCoupon ? selectedCoupon : ""}
                  onChange={() => setSelectedCoupon(null)}
                  disabled={selectedCoupon ? true : false}
                />

                <button
                  onClick={() => setSelectedCoupon(null)}
                  className={
                    selectedCoupon
                      ? "btn remove-coupon-btn position-absolute"
                      : "btn position-absolute"
                  }
                >
                  {selectedCoupon ? "Remove" : "Apply"}
                </button>
              </div>

              {selectedCoupon && (
                <p className="copn-msge my-2">
                  Congratulations! Instant Discount of Rs. ₹229 has been applied
                  successfully.
                </p>
              )}
            </div>

            <div className="deiwhrwerwer hjiejfriwejrwer pe-2">
              <label htmlFor="c1" className="coupon-card">
                <input
                  type="radio"
                  checked={selectedCoupon === "MMTTRAVEL"}
                  onChange={() => handleSelectedModal("MMTTRAVEL")}
                  name="ucfewfrew"
                  id="c1"
                  className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between mb-1">
                  <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                    <img
                      src="/images/discount.png"
                      className="coupon-icon"
                      alt=""
                    />
                    <strong className="frgrfg5559">MMTTRAVEL</strong>
                  </div>

                  <span className="discount">₹229 off</span>
                </div>
                <p className="desc mb-0">
                  Log in to get up to 15% OFF.
                  <br />
                  Offer valid for new users only
                </p>
              </label>

              <label htmlFor="c2" className="coupon-card">
                <input
                  type="radio"
                  checked={selectedCoupon === "MMTSECUREV"}
                  onChange={() => handleSelectedModal("MMTSECUREV")}
                  name="ucfewfrew"
                  id="c2"
                  className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between">
                  <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                    <img
                      src="/images/discount.png"
                      className="coupon-icon"
                      alt=""
                    />
                    <strong className="frgrfg5559">MMTSECUREV</strong>
                  </div>
                  <span className="discount">₹229 off</span>
                </div>
                <p className="desc mb-0">
                  Get an instant discount of ₹229 on your flight booking
                  <br />
                  and Trip Secure combo
                </p>
              </label>

              <label htmlFor="c3" className="coupon-card">
                <input
                  type="radio"
                  checked={selectedCoupon === "MMTSECUREL"}
                  onChange={() => handleSelectedModal("MMTSECUREL")}
                  name="ucfewfrew"
                  id="c3"
                  className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between">
                  <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                    <img
                      src="/images/discount.png"
                      className="coupon-icon"
                      alt=""
                    />
                    <strong className="frgrfg5559">MMTSECUREL</strong>
                  </div>
                  <span className="discount">₹229 off</span>
                </div>
                <p className="desc mb-0">
                  Get an instant discount of ₹229 on your flight booking
                  <br />
                  and Trip Secure combo
                </p>
              </label>

              <label htmlFor="c4" className="coupon-card">
                <input
                  type="radio"
                  checked={selectedCoupon === "MMTSECUREJ"}
                  onChange={() => handleSelectedModal("MMTSECUREJ")}
                  name="ucfewfrew"
                  id="c4"
                  className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between">
                  <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                    <img
                      src="/images/discount.png"
                      className="coupon-icon"
                      alt=""
                    />
                    <strong className="frgrfg5559">MMTSECUREJ</strong>
                  </div>
                  <span className="discount">₹ 229 off</span>
                </div>
                <p className="desc mb-0">
                  Get an instant discount of ₹229 on your flight booking
                  <br />
                  and Trip Secure combo
                </p>
              </label>

              <label htmlFor="c5" className="coupon-card">
                <input
                  type="radio"
                  checked={selectedCoupon === "MMTSECURER"}
                  onChange={() => handleSelectedModal("MMTSECURER")}
                  name="ucfewfrew"
                  id="c5"
                  className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between">
                  <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                    <img
                      src="/images/discount.png"
                      className="coupon-icon"
                      alt=""
                    />
                    <strong className="frgrfg5559">MMTSECURER</strong>
                  </div>
                  <span className="discount">₹ 229 off</span>
                </div>
                <p className="desc mb-0">
                  Get an instant discount of ₹229 on your flight booking
                  <br />
                  and Trip Secure combo
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* all coupon modal end */}

      {/* flight booking modal start */}

      <div
        className={`${flightBookingModal ? "flight-booking-modal-backdrop" : "flight-booking-modal-backdrop flight-booking-modal-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}
      ></div>

      <div
        className={`${
          flightBookingModal
            ? "flight-booking-modal"
            : "flight-booking-modal flight-booking-modal-hide"
        } d-flex flex-column bg-white top-50 start-50 translate-middle p-3 position-fixed`}
      >
        {/* Header */}
        <div className="flight-booking-modal-header d-flex align-items-center justify-content-between mb-2 pb-2">
          <h5 className="mb-0">
            <b>Your Booking Summary</b>
          </h5>

          <i
            onClick={() => setFlightBookingModal(false)}
            className="fa-solid fa-xmark"
          ></i>
        </div>

        {/* Body */}
        <div className="all-coupon-modal-body">
          <div className="idhijweoijorwekrwer">
            {/* Flight Information */}
            <div className="booking-flight-info border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small">Departure</span>
                  <h6 className="mb-1">
                    {segment?.Origin_City} → {segment?.Destination_City}

                  </h6>
                  <small className="text-muted">{formatDepartureDateTime(segment?.Departure_DateTime)}</small>
                </div>

                <div className="text-end">
                  <span className="badge bg-light text-dark">{segment?.Airline_Name}</span>
                  <small className="d-block text-muted mt-1">{segment?.Airline_Code}{" "}{segment?.Flight_Number}</small>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="booking-summary-section border-bottom pb-3 mb-3">
              <h6 className="fw-bold mb-3">Passenger & Seat Details</h6>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  <i className="fa-solid fa-users me-2"></i>
                  Passengers
                </span>
                <strong> 
                  {totalPassengers}{" "}
                {totalPassengers === 1
                  ? "Passenger"
                  : "Passengers"}
                </strong>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {adultCount > 0 && (
                  <span className="badge bg-light text-dark border">
                    {adultCount} Adult
                    {adultCount > 1 ? "s" : ""}
                  </span>
                )}
                {childCount > 0 && (
                  <span className="badge bg-light text-dark border">
                    {childCount} Child
                    {childCount > 1 ? "ren" : ""}
                  </span>
                )}
                {infantCount > 0 && (
                  <span className="badge bg-light text-dark border">
                    {infantCount} Infant
                    {infantCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>


              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  <i className="fa-solid fa-chair me-2"></i>
                  Cabin Class
                </span>
                <strong>{cabinClassName}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  <i className="fa-solid fa-chair me-2"></i>
                  Seats
                </span>
                <strong>
                  {selectedSeatCount}{" "}
                  {selectedSeatCount === 1
                    ? "Seat"
                    : "Seats"}
                </strong>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  <i className="fa-solid fa-suitcase-rolling me-2"></i>
                  Baggage
                </span>
                <strong>  {adultFare?.Free_Baggage?.Check_In_Baggage || "15 Kgs"} / Adult</strong>
                <strong>  {childFare?.Free_Baggage?.Check_In_Baggage || "15 Kgs"} / Child</strong>
                <strong>  {infantFare?.Free_Baggage?.Check_In_Baggage || "0 Kg"} / Infant</strong> 
              </div>

              {bookingPassengers.length > 0 && (
              <div className="mt-3">

                <div className="small fw-bold text-muted mb-2">
                  Passenger Details
                </div>
                {bookingPassengers.map(
                  (passenger, index) => {

                    const passengerSeat =
                      selectedSeatList?.[index];

                    const passengerMeal =
                      selectedMealList?.[index];


                    const passengerName = [
                      passenger?.title,
                      passenger?.firstName ||
                        passenger?.First_Name,
                      passenger?.lastName ||
                        passenger?.Last_Name,
                    ]
                      .filter(Boolean)
                      .join(" ");


                    return (
                      <div
                        key={`${passenger.passengerType}-${index}`}
                        className="border rounded-3 p-3 mb-2"
                      >

                        {/* Name */}

                        <div className="d-flex justify-content-between align-items-start">

                          <div>

                            <strong>
                              {passengerName ||
                                `Passenger ${index + 1}`}
                            </strong>

                            <div className="small text-muted">
                              {passenger.passengerType}
                            </div>

                          </div>


                          {/* Passenger number */}

                          <span className="badge bg-light text-dark border">
                            PAX {index + 1}
                          </span>

                        </div>


                        {/* Seat + Meal */}

                        <div className="row mt-3">

                          {/* Seat */}

                          <div className="col-6">

                            <div className="small text-muted">
                              <i className="fa-solid fa-chair me-1"></i>
                              Seat
                            </div>

                            <strong>
                              {passengerSeat?.Seat_Name ||
                                passengerSeat?.SeatNumber ||
                                passengerSeat?.seatNumber ||
                                passengerSeat?.seat ||
                                passengerSeat?.description ||
                                "Not Selected"}
                            </strong>

                          </div>


                          {/* Meal */}

                          <div className="col-6">

                            <div className="small text-muted">
                              <i className="fa-solid fa-utensils me-1"></i>
                              Meal
                            </div>

                            <strong>
                              {passengerMeal?.SSR_TypeDesc ||
                                passengerMeal?.SSR_Name ||
                                passengerMeal?.Meal_Name ||
                                passengerMeal?.MealName ||
                                passengerMeal?.name ||
                                "No Meal"}
                            </strong>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}
              </div>
            )}
            </div>

            {/* Fare Breakdown */}
            <div className="booking-fare-section border-bottom pb-3 mb-3">
              <h6 className="fw-bold mb-3">Fare Breakdown</h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Base Fare</span>
                <span>{formatAmount(baseFare)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Taxes & Fees</span>
                <span> {formatAmount(taxAmount)}</span>
              </div>

              {seatCharges > 0 && (
                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Seat Charges
                  </span>

                  <span>
                    {formatAmount(seatCharges)}
                  </span>

                </div>
              )}
              {/* Meal Charges */}
              {mealCharges > 0 && (
                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Meal Charges
                  </span>

                  <span>
                    {formatAmount(mealCharges)}
                  </span>

                </div>
              )}
              {/* Baggage Charges */}
              {extraBaggageCharges > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    {/* <i className="fa-solid fa-suitcase-rolling me-2"></i> */}
                    Extra Baggage
                  </span>

                  <span>
                    {formatAmount(extraBaggageCharges)}
                  </span>
                </div>
              )}
              {/* Other Charges */}

              {otherCharges > 0 && (
                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Other Charges
                  </span>

                  <span>
                    {formatAmount(otherCharges)}
                  </span>

                </div>
              )}


            {/* Discount */}

            {/* {discountAmount > 0 && (
              <div className="d-flex justify-content-between text-success">

                <span>
                  Discount
                </span>

                <span>
                  - {formatAmount(discountAmount)}
                </span>

              </div>
            )} */}

            </div>
            {selectedSeatList.length > 0 && (
              <div className="border rounded-3 p-3 mb-3">

                <div className="d-flex justify-content-between mb-2">

                  <h6 className="fw-bold mb-0">
                    Selected Seats
                  </h6>

                  <span className="text-muted small">
                    {selectedSeatList.length} selected
                  </span>

                </div>


                <div className="d-flex flex-wrap gap-2">

                  {selectedSeatList.map(
                    (seat, index) => (

                      <div
                        key={index}
                        className="border rounded-2 px-3 py-2"
                      >

                        <strong>
                          {seat?.Seat_Name ||
                            seat?.SeatNumber ||
                            seat?.seatNumber ||
                            seat?.seat || seat?.description ||
                            `Seat ${index + 1}`} 
                        </strong>

                        {Number(
                          seat?.Total_Amount ??
                          seat?.TotalAmount ??
                          seat?.Amount ??
                          seat?.Price ?? seat?.amount ??
                          0
                        ) > 0 && (
                          <div className="small text-muted">
                            {formatAmount(
                              seat?.Total_Amount ??
                                seat?.TotalAmount ??
                                seat?.Amount ??
                                seat?.Price ?? seat?.amount
                            )}
                          </div>
                        )}

                      </div>

                    )
                  )}

                </div>

              </div>
            )}
            {/* ===================================================
                SELECTED MEALS
            ==================================================== */}
            {selectedMealList.length > 0 && (
              <div className="border rounded-3 p-3">

                <h6 className="fw-bold mb-3">
                  Selected Meals
                </h6>


                {selectedMealList.map(
                  (meal, index) => (

                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >

                      <div>

                        <strong>
                          {meal?.SSR_TypeDesc ||
                            meal?.SSR_Name ||
                            meal?.Meal_Name ||
                            meal?.MealName ||
                            "Meal"}
                        </strong>

                        <div className="small text-muted">
                          Passenger {index + 1}
                        </div>

                      </div>


                      <span>
                        {formatAmount(
                          meal?.Total_Amount ??
                            meal?.TotalAmount ??
                            meal?.Amount ??
                            meal?.Price ??
                            0
                        )}
                      </span>

                    </div>

                  )
                )}

              </div>
            )}
          </div>

          {/* Total */}
          <div className="booking-total d-flex justify-content-between align-items-center pt-2">
            <div>
              <span className="text-muted small d-block">Total Amount</span>
              <h4 className="mb-0 fw-bold">{formatAmount(totallAmountt)}</h4>
            </div>

            {isBlockAllowed && (
                <button
                    type="button"
                    className="btn btn-outline-primary px-4"
                    onClick={handleHoldTicket}
                >
                    <i className="fa-solid fa-clock me-2"></i>
                    Hold Ticket
                </button>
            )}

            <button
              type="button"
              className="btn btn-tour px-4"
              onClick={handleProceedToPayment}
            >
              Continue
              <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>

      {/* flight booking modal end */}
    </div>
  );
};
