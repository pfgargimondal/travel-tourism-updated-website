import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import "./HotelBooking.css";
import Loader from "../../component/Loader/Loader";


export const HotelBooking = () => {

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, setLoginRegModal, user } = useAuth();

    const {
        room,
        hotel,
        checkin,
        checkout,
        rooms,
        adults,
        children,
    } = location.state || {};
    
    //console.log("HotelBooking state:", location.state);

    const [selectedUpgradeMeal, setSelectedUpgradeMeal] = useState(null);
    const [imprtntInfoModal, setImprtntInfoModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [allCouponModal, setAllCouponModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState("");
    const [passengerDetails, setPassengerDetails] = useState([]);
    const [passengerError, setPassengerError] = useState("");
    const [contactDetails, setContactDetails] = useState({
        email: "",
        mobile: "",
    });

    useEffect(() => {
        setContactDetails({
            email: user?.email || "",
            mobile: user?.phone || user?.mobile || user?.mobile_number || "",
        });
    }, [user]);

    useEffect(() => {
        setPassengerDetails(Array.from({ length: Number(adults || 1) }, () => ({
            firstName: "",
            lastName: "",
        })));
    }, [adults]);

    useEffect(() => {
        if (!room || !hotel) {
            navigate("/hotels");
        }
    }, [room, hotel, navigate]);

    useEffect(() => {
        let isMounted = true;

        const fetchCoupons = async () => {
            try {
                const response = await http.get("/fetch-hotel-coupons");
                const fetchedCoupons = Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

                if (isMounted) {
                    setCoupons(fetchedCoupons);
                }
            } catch (error) {
                console.error("Failed to fetch hotel coupons:", error);
            }
        };

        fetchCoupons();

        return () => {
            isMounted = false;
        };
    }, []);


    const handleSelectedUpgradeMeal = (value) => {
        setSelectedUpgradeMeal(prev => (prev === value) ? null : value);
    };

    useEffect(() => {
        const html = document.querySelector("html");

        imprtntInfoModal ? html.classList.add("overflow-hidden") : html.classList.remove("overflow-hidden");;

        return () => {
            html.classList.remove("overflow-hidden")
        };
    }, [imprtntInfoModal]);

    const handleImprtntInfoModalToggle = () => {
        setImprtntInfoModal(prev => !prev);
    };

    const handleSelectedModal = (value) => {
        setSelectedCoupon(prev => (prev === value) ? null : value);
    };

    useEffect(() => {
      const html = document.querySelector("html");

        allCouponModal ? html.classList.add("overflow-hidden") : html.classList.remove("overflow-hidden");

        return () => {
            html.classList.remove("overflow-hidden")
        };
    }, [allCouponModal]);
    

    const handleAllModalToggle = () => {
        setAllCouponModal(prev => !prev);
    };

    const handlePayNow = () => {
        const hasIncompletePassenger = passengerDetails.some(
            (passenger) => !passenger.firstName.trim() || !passenger.lastName.trim(),
        );

        if (hasIncompletePassenger || !contactDetails.email.trim() || !contactDetails.mobile.trim()) {
            setPassengerError("Please complete all passenger and contact details to continue.");
            return;
        }

        if (!termsAccepted) {
            setTermsError("Please accept the terms and booking policies to continue.");
            return;
        }


        const handlePreBook = async () => {
            try {
                if (!room?.BookingCode) {
                    console.error("BookingCode not found:", room);
                    return;
                }

                setLoading(true);
                const response = await http.post("/hotel-prebook", {
                    BookingCode: room.BookingCode,
                    PaymentMode: "Limit",
                });
                if (response.data?.status === 200) {

                    console.log("TBO PreBook Response:", response.data);
                    //return false;
                    navigate("/hotel-payment", {
                        state: {
                            prebookDetails: response.data,
                            prebookBookingCode: room.BookingCode,
                            room,
                            hotel,
                            checkin,
                            checkout,
                            rooms,
                            adults,
                            children,
                            contactDetails,
                            totalFare,
                            totalTax,
                            totalDiscount,
                            priceAfterDiscount,
                            grandTotal,
                            selectedCoupon,
                            selectedUpgradeMeal,
                            passengerDetails,
                        },
                    });
                }

                else {
                    alert(response.data?.message || "Pre-booking failed. Please try again.");
                    setLoading(false);
                }

               // console.log("TBO PreBook Response:", response.data);

            } catch (error) {
                setLoading(false);
                console.error(
                    "TBO PreBook Error:",
                    error.response?.data || error
                );
            }
        };
        handlePreBook();
        //console.log("PreBook Response:", room?.BookingCode);
    };


const roomDetailsList = hotel?.hotel_rooms?.RoomDetails || [];

const selectedRoomName = Array.isArray(room?.Name)
    ? room.Name[0]
    : room?.Name || "";

const normalizedSelectedRoomName = selectedRoomName
    .toLowerCase()
    .trim();

const selectedRoomDetails =
    roomDetailsList.find((roomDetail) => {
        const normalizedRoomName = roomDetail.RoomName
            ?.toLowerCase()
            .trim();

        return (
            normalizedRoomName &&
            (
                normalizedSelectedRoomName.includes(normalizedRoomName) ||
                normalizedRoomName.includes(normalizedSelectedRoomName)
            )
        );
    }) || roomDetailsList[0];


    

    // Dynamic price calculations
    const totalFare = Number(room?.TotalFare || 0);
    const totalTax = Number(room?.TotalTax || 0);

    // Calculate base price from DayRates
    const totalBasePrice =
        room?.DayRates?.reduce((sum, rate) => {
            return sum + Number(rate?.[0]?.BasePrice || 0);
        }, 0) || 0;

    const selectedCouponData = coupons.find(coupon => coupon.code === selectedCoupon);
    const couponValue = Number(selectedCouponData?.value || 0);
    const minimumOrderAmount = Number(selectedCouponData?.min_order_amount || 0);
    const meetsMinimumOrder = totalFare >= minimumOrderAmount;
    const totalDiscount = selectedCouponData && meetsMinimumOrder
        ? selectedCouponData.type === "percentage"
            ? Math.min(totalFare, (totalFare * couponValue) / 100)
            : Math.min(totalFare, couponValue)
        : 0;
    const priceAfterDiscount = Math.max(totalFare - totalTax - totalDiscount, 0);
    const grandTotal = Math.max(totalFare - totalDiscount, 0);

    const renderCouponCard = (coupon) => {
        const isPercentageCoupon = coupon.type === "percentage";
        const couponValueLabel = isPercentageCoupon
            ? `${coupon.value}% off`
            : `₹${Number(coupon.value || 0)} off`;
        const couponDescription = coupon.coupon_description?.replace(/\r?\n/g, " ");

        return (
            <label htmlFor={`coupon-${coupon.id}`} className="coupon-card" key={coupon.id}>
                <input
                    type="radio"
                    checked={selectedCoupon === coupon.code}
                    onChange={() => handleSelectedModal(coupon.code)}
                    name="hotel-coupon"
                    id={`coupon-${coupon.id}`}
                    className="d-none position-absolute"
                />

                <div className="coupon-top d-flex align-items-center justify-content-between mb-1">
                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                        <img src="./images/discount.png" className="coupon-icon" alt="" />
                        <strong className="frgrfg5559">{coupon.code}</strong>
                    </div>

                    <span className="discount">{couponValueLabel}</span>
                </div>

                <p className="desc mb-0">
                    {couponDescription || "Get an instant discount on your hotel booking"}
                </p>
            </label>
        );
    };

    if (loading) {
        return <Loader />;
      }

    return (
        <>
            <div className="sdfsdf655">
                <div className="container">
                    <div className="asfdgsqwe">
                        <ul className="ps-0 d-flex align-items-center gap-3">
                            <li className="active">Hotels</li>

                            <li><i className="bi bi-arrow-right"></i></li>

                            <li className="active">Review Your Booking</li>

                            <li><i className="bi bi-arrow-right"></i></li>

                            <li>Payment</li>
                        </ul>
                    </div>

                    <div className="fgerfer88 sgbdrsfweqeqe">
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="sdfsdfsdf78">
                                    <div className="uihfsdfsff545">
                                        <div className="hotel-card">
                                            {/* Top Section */}
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="jdfikgjdfg">
                                                    <h4 className="fw-bold mb-2">
                                                        {hotel?.hotel_name}
                                                    </h4>
                                                    
                                                    <div className="small-text">
                                                        <div className="de mb-1">
                                                            {Array.from({ length: 5 }, (_, index) => (
                                                                <i
                                                                    key={index}
                                                                    className={`bi ${
                                                                        index < Math.round(Number(hotel?.hotel_rating || 0))
                                                                            ? "bi-star-fill"
                                                                            : "bi-star"
                                                                    }`}
                                                                ></i>
                                                            ))}

                                                            <span className="badge badge-custom ms-1">
                                                                Couple Friendly
                                                            </span>
                                                        </div>

                                                        <p className="mb-0">{hotel?.address}</p>
                                                    </div>
                                                </div>
                                                <img
                                                    src={hotel?.image}
                                                    className="hotel-img" alt=""
                                                />
                                            </div>
                                            {/* Check-in Section */}
                                            <div className="section-divider" />
                                            <div className="row text-center text-md-start">
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">CHECK IN</div>
                                                        <strong>
                                                            {new Date(checkin).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                                                        </strong>
                                                        <br />
                                                        <span className="duiewjrewr">1 PM</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">CHECK OUT</div>
                                                        <strong>
                                                            {new Date(checkout).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                                                        </strong>
                                                        <br />
                                                        <span className="duiewjrewr">11 AM</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">GUEST</div>
                                                        <strong>{adults} Adults</strong>
                                                        <br />
                                                        <span className="duiewjrewr">1 Night | {children} Children | 1 Room</span>
                                                    </div>                                                    
                                                </div>
                                            </div>
                                            {/* Room Section */}
                                            <div className="section-divider" />
                                            {/* Room Section */}

                                            <div className="d-flex justify-content-between jhgfdafdghsd">
                                                <div>
                                                    {/* Dynamic Room Name */}
                                                    <h5 className="fw-bold mb-1">
                                                        {selectedRoomDetails?.RoomName ||
                                                            selectedRoomName ||
                                                            "Selected Room"}
                                                    </h5>

                                                    {/* Dynamic Guest Count */}
                                                    <div className="small-text">
                                                        {adults || 1} Adults
                                                        {Number(children || 0) > 0 &&
                                                            `, ${children} Children`}
                                                    </div>

                                                    <ul className="small-text sgdtrwrqqwr mt-2 ps-2">
                                                        {/* Meal Type */}
                                                        <li>
                                                            <i className="bi me-1 bi-check-circle-fill"></i>
                                                            {room?.MealType || "Room Only"}
                                                        </li>

                                                        {/* Meal Inclusion */}
                                                        <li>
                                                            <i className="bi me-1 bi-check-circle-fill"></i>
                                                            {room?.MealType
                                                                ? room.MealType
                                                                : "No meals included"}
                                                        </li>

                                                        {/* Room Promotion */}
                                                        {room?.RoomPromotion && (
                                                            <li>
                                                                <i className="bi me-1 bi-check-circle-fill"></i>
                                                                {Array.isArray(room.RoomPromotion)
                                                                    ? room.RoomPromotion.join(", ")
                                                                    : room.RoomPromotion}
                                                            </li>
                                                        )}

                                                        {/* Room Size */}
                                                        {selectedRoomDetails?.RoomSize && (
                                                            <li>
                                                                <i className="bi me-1 bi-check-circle-fill"></i>
                                                                Room Size: {selectedRoomDetails.RoomSize}
                                                            </li>
                                                        )}
                                                    </ul>

                                                    {/* Refundable / Non-Refundable */}
                                                    <strong>
                                                        {room?.IsRefundable
                                                            ? "Refundable"
                                                            : "Non-Refundable"}
                                                    </strong>

                                                    <div className="small-text">
                                                        {room?.IsRefundable
                                                            ? "This booking is eligible for a refund according to the cancellation policy."
                                                            : "Refund is not applicable for this booking."}
                                                    </div>

                                                    {/* Cancellation Policy */}
                                                    <a
                                                        href="#cancellation-policy"
                                                        className="blue-link sbgswfeqw"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setImprtntInfoModal(true);
                                                        }}
                                                    >
                                                        Cancellation policy details
                                                    </a>
                                                </div>

                                                <div className="text-end">
                                                    <a
                                                        href="#room-inclusions"
                                                        className="blue-link"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setImprtntInfoModal(true);
                                                        }}
                                                    >
                                                        See Inclusions
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            <div className="section-divider" />
                                            
                                            <h5 className="fw-bold mb-3">Upgrade Your Stay</h5>
                                            
                                            <div className="row g-3">
                                                {/* Option 1 */}
                                                <div className="col-md-6">                                                    
                                                    <label htmlFor="cbx-12" className="dewoijropwerewr d-flex p-3 rounded-3">
                                                        <div class="checkbox-wrapper-12">
                                                            <div className="cbx">
                                                                <input id="cbx-12" name="diuwerwer" checked={selectedUpgradeMeal === "breakfast"} onChange={() => handleSelectedUpgradeMeal("breakfast")} type="checkbox" />

                                                                <label htmlFor="cbx-12" />

                                                                <svg width={10} height={9} viewBox="0 0 15 14" fill="none">
                                                                    <path d="M2 8.36364L6.23077 12L13 2" />
                                                                </svg>
                                                            </div>
                                                            {/* Gooey*/}
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                                                <defs>
                                                                <filter id="goo-12">
                                                                    <feGaussianBlur in="SourceGraphic" stdDeviation={4} result="blur" />
                                                                    <feColorMatrix
                                                                    in="blur"
                                                                    mode="matrix"
                                                                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                                                    result="goo-12"
                                                                    />
                                                                    <feBlend in="SourceGraphic" in2="goo-12" />
                                                                </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>

                                                        <div className="duiewhewewr ms-2">
                                                            <p className="mb-1">Add Breakfast</p>

                                                            <div className="gewtahsreee small-text">₹ 153 for all guests</div>
                                                        </div>
                                                    </label>
                                                </div>
                                                {/* Option 2 */}
                                                <div className="col-md-6">
                                                    <label htmlFor="cbx-13" className="dewoijropwerewr d-flex p-3 rounded-3">
                                                        <div class="checkbox-wrapper-12">
                                                            <div className="cbx">
                                                                <input id="cbx-13" checked={selectedUpgradeMeal === "breakfast-lunch-dinner"} onChange={() => handleSelectedUpgradeMeal("breakfast-lunch-dinner")} name="diuwerwer" type="checkbox" />

                                                                <label htmlFor="cbx-13" />

                                                                <svg width={10} height={9} viewBox="0 0 15 14" fill="none">
                                                                    <path d="M2 8.36364L6.23077 12L13 2" />
                                                                </svg>
                                                            </div>
                                                            {/* Gooey*/}
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                                                <defs>
                                                                <filter id="goo-12">
                                                                    <feGaussianBlur in="SourceGraphic" stdDeviation={4} result="blur" />
                                                                    <feColorMatrix
                                                                    in="blur"
                                                                    mode="matrix"
                                                                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                                                    result="goo-12"
                                                                    />
                                                                    <feBlend in="SourceGraphic" in2="goo-12" />
                                                                </filter>
                                                                </defs>
                                                            </svg>
                                                        </div>

                                                        <div className="duiewhewewr ms-2">
                                                            <p className="mb-1">Add Breakfast + Lunch/Dinner</p>

                                                            <div className="gewtahsreee small-text">₹ 659 for all guests</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                                <div className="important-box p-3 mt-2">
                                                    <h6 className="fw-bold mb-3">Important information</h6>
                                                    
                                                    <div className="inner-box p-3">
                                                        <div className="rule-tag mb-2">
                                                            💗 Couple/Bachelor Rules
                                                        </div>
                                                        <div className="info-highlight p-2 mb-3">
                                                            Unmarried couples allowed. Local ids are allowed
                                                        </div>
                                                        <ul className="small-text ps-3 mb-2">
                                                            <li>
                                                                Primary Guest should be atleast 18 years of age.
                                                            </li>
                                                            <li>
                                                                Groups with only male guests are allowed at the
                                                                property
                                                            </li>
                                                            <li>
                                                                Passport, Aadhaar, Driving License and Govt. ID are
                                                                accepted as ID proof(s)
                                                            </li>
                                                            <li>Pets are not allowed</li>
                                                        </ul>

                                                        <p role="button" onClick={handleImprtntInfoModalToggle} className="d-inline-block blue-link mb-0">View More</p>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="fgfgdfm85g">
                                    <div className="guest-box p-3">
                                    <h5 className="fw-bold mb-3">Guest Details</h5>

                                    {Array.from({ length: Number(adults || 1) }).map((_, index) => (
                                        <div
                                            className="doiewrjwrwer row align-items-center mb-4"
                                            key={index}
                                        >
                                            <div className="col-lg-3">
                                                <div className="diweuhwerwer d-flex align-items-center">
                                                    <div className="diuwerwer position-relative">
                                                        <img src="./images/dew.png" alt="" />

                                                        <span className="position-absolute">
                                                            Room {Math.min(index + 1, Number(rooms || 1))}
                                                        </span>
                                                    </div>

                                                    <h6 className="mb-0 text-center">
                                                        Adult {index + 1}
                                                    </h6>
                                                </div>
                                            </div>

                                            <div className="col-lg-9">
                                                <div className="oidjeworwer row">
                                                    <div className="col-lg-2">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Title</label>

                                                            <select className="form-select">
                                                                <option value="Mr">Mr.</option>
                                                                <option value="Mrs">Mrs.</option>
                                                                <option value="Ms">Ms.</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">First Name</label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter First Name"
                                                                value={passengerDetails[index]?.firstName || ""}
                                                                onChange={(event) => {
                                                                    const value = event.target.value;
                                                                    setPassengerDetails(prev => prev.map((passenger, passengerIndex) => passengerIndex === index ? { ...passenger, firstName: value } : passenger));
                                                                    setPassengerError("");
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Last Name</label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Last Name"
                                                                value={passengerDetails[index]?.lastName || ""}
                                                                onChange={(event) => {
                                                                    const value = event.target.value;
                                                                    setPassengerDetails(prev => prev.map((passenger, passengerIndex) => passengerIndex === index ? { ...passenger, lastName: value } : passenger));
                                                                    setPassengerError("");
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="idujewrwer">
                                        <h6 className="fw-bold">Contact Details</h6>

                                        <div className="dwehrwer mb-3">
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <label className="form-label">Email Address</label>

                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter Email Address"
                                                        value={contactDetails.email}
                                                        onChange={(event) => {
                                                            setContactDetails(prev => ({ ...prev, email: event.target.value }));
                                                            setPassengerError("");
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-lg-4">
                                                    <label className="form-label">Mobile Number</label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Mobile Number"
                                                        value={contactDetails.mobile}
                                                        onChange={(event) => {
                                                            setContactDetails(prev => ({ ...prev, mobile: event.target.value }));
                                                            setPassengerError("");
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <h6 className="dshrysrfhety mb-0">
                                            Your booking details will be sent to this email address and mobile number.
                                        </h6>
                                    </div>
                                    </div>
                                    {passengerError && (
                                        <p className="text-danger small mb-0 mt-2">{passengerError}</p>
                                    )}
                                    {/* Login Bar */}
                                    {!isLoggedIn && (
                                        <div className="login-bar p-3 mt-2">
                                            <p className="gdsdgsfaer small-text mb-0">
                                                <span onClick={() => setLoginRegModal(prev => !prev)} role="button">Login</span> to prefill traveller details and get access to secret
                                                deals
                                            </p>
                                        </div>
                                    )}
                                    {/* Terms */}
                                    <div className="form-check mt-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(event) => {
                                                setTermsAccepted(event.target.checked);
                                                setTermsError("");
                                            }}
                                        />
                                        <label className="form-check-label small-text">
                                            By proceeding, I agree to MyCheapTickets &nbsp;
                                            <Link to="/" className="blue-link">
                                                User Agreement
                                            </Link>
                                            , &nbsp;
                                            <a href="/" className="blue-link">
                                                Terms of Service
                                            </a>{" "}
                                            and &nbsp;
                                            <a href="/" className="blue-link">
                                                Cancellation &amp; Property Booking Policies
                                            </a>
                                            .
                                        </label>
                                    </div>
                                    {termsError && (
                                        <p className="text-danger small mb-0 mt-2">{termsError}</p>
                                    )}
                                    {/* Pay Button */}
                                    <div className="fbcfgsddefd mt-3">
                                        <button type="button" onClick={handlePayNow} className="pay-btn">PAY NOW</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="sticky-top">
                                    {/* SUMMARY */}
                                    <div className="fgdfgdf mb-3">
                                        <div className="summary overflow-hidden">
                                            <h6 className="mb-0 px-3 py-2"><i className="bi me-1 bi-wallet"></i> Fare Summary</h6>

                                            <div className="diewnjrjwer px-3">
                                                
                                                <table className="table mb-0">
                                                    <tbody>
                                                        {/* Room Price */}
                                                        <tr>
                                                            <td>
                                                                <b>
                                                                    {Number(rooms || 1)} Room X{" "}
                                                                    {Math.max(
                                                                        1,
                                                                        Math.ceil(
                                                                            (new Date(checkout) - new Date(checkin)) /
                                                                            (1000 * 60 * 60 * 24)
                                                                        )
                                                                    )}{" "}
                                                                    Night
                                                                </b>
                                                            </td>

                                                            <td>
                                                                ₹
                                                                {Math.round(
                                                                    totalBasePrice || priceAfterDiscount
                                                                ).toLocaleString("en-IN")}
                                                            </td>
                                                        </tr>

                                                        {/* Total Discount */}
                                                        <tr className="diewrwerwer">
                                                            <td>
                                                                <b>Total Discount</b>{" "}
                                                                <i className="fa-solid fa-info"></i>
                                                            </td>

                                                            <td>
                                                                -₹
                                                                {Math.round(totalDiscount).toLocaleString("en-IN")}
                                                            </td>
                                                        </tr>

                                                        {/* Price After Discount */}
                                                        <tr>
                                                            <td>
                                                                <b>Price After Discount</b>
                                                            </td>

                                                            <td>
                                                                ₹
                                                                {Math.round(
                                                                    priceAfterDiscount
                                                                ).toLocaleString("en-IN")}
                                                            </td>
                                                        </tr>

                                                        {/* Taxes & Fees */}
                                                        <tr>
                                                            <td>
                                                                <b>Taxes & Fees</b>
                                                            </td>

                                                            <td>
                                                                ₹
                                                                {Math.round(totalTax).toLocaleString("en-IN")}
                                                            </td>
                                                        </tr>

                                                        {/* Grand Total */}
                                                        <tr className="ojdeopekwrer">
                                                            <td>
                                                                <b>Grand Total</b>
                                                            </td>

                                                            <td>
                                                                <b>
                                                                    ₹
                                                                    {Math.round(
                                                                        grandTotal
                                                                    ).toLocaleString("en-IN")}
                                                                </b>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    {/* COUPON */}
                                    <div className="dfdff5585">
                                        <div className="coupon-box">
                                            <div className="coupon-banner">
                                                <img src="./images/SL_040621_42020_15.jpg" alt="" />
                                                {/* <h5 class="mt-2">Coupons and Offers</h5> */}
                                            </div>
                                            
                                            <div className="hjhjk overflow-hidden mt-3">
                                                <h6 className="mb-0 px-3 py-2"><i className="bi me-1 bi-tags"></i>Coupon Codes</h6>

                                                <div className="bg-white px-3 mt-3">
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

                                                            <button onClick={() => setSelectedCoupon(null)} className={selectedCoupon ? "btn remove-coupon-btn position-absolute" : "btn position-absolute"}>{selectedCoupon ? "Remove" : "Apply"}</button>  
                                                        </div>

                                                        {selectedCoupon && <p className="copn-msge my-2">Congratulations! Instant Discount of ₹{totalDiscount} has been applied successfully.</p>}
                                                    </div>            
                                            
                                                    <div className="deiwhrwerwer">
                                                        {coupons.map(renderCouponCard)}
                                                    </div>

                                                    <div className="fgderhsraerr text-center">
                                                        <button onClick={handleAllModalToggle} className="btn sgsfeqaedqrrr pb-2">View All Coupons</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${imprtntInfoModal ? "imprtnt-info-modal-backdrop" : "imprtnt-info-modal-backdrop imprtnt-info-modal-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}></div>

            <div className={`${imprtntInfoModal ? "imprtnt-info-modal" : "imprtnt-info-modal imprtnt-info-modal-hide"} bg-white rounded-4 position-fixed top-50 start-50 translate-middle`}>
                <div className="imprtnt-info-modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">Hotel Rules</h4>

                    <i onClick={handleImprtntInfoModalToggle} className="fa-solid fa-xmark"></i>
                </div>

                <div className="imprtnt-info-modal-body p-4">
                    <section className="foundation-section">
                        <div className="adsghaewrr">
                            <h4>Lorem Ipsum Dolor Sit Amet Consectetur</h4>

                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat.
                            </p>

                            <div className="initiative-list">
                                <div className="initiative-item">
                                    <h4>🌿 Lorem Ipsum Dolor</h4>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
                                        odio. Praesent libero. Sed cursus ante dapibus diam.
                                    </p>
                                </div>

                                <div className="initiative-item">
                                    <h4>🏛️ Consectetur Adipiscing</h4>
                                    <p>
                                        Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis
                                        ipsum. Praesent mauris.
                                    </p>
                                </div>

                                <div className="initiative-item">
                                    <h4>♻️ Eiusmod Tempor</h4>
                                    <p>
                                        Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum
                                        lacinia arcu eget nulla.
                                    </p>
                                </div>
                            </div>

                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                                sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.
                                Pellentesque nibh.
                            </p>

                            <p>
                                <strong>
                                    👉 Lorem ipsum dolor sit amet, consectetur adipiscing elit!
                                </strong>
                            </p>

                            <hr />

                            <h3>Lorem Ipsum Terms &amp; Conditions</h3>

                            <ol className="terms-list">
                                <li>
                                    <strong>Lorem Ipsum:</strong> Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                                    magna aliqua.
                                </li>

                                <li>
                                    <strong>Dolor Sit Amet:</strong> Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit:
                                    <ul>
                                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                        <li>Sed do eiusmod tempor incididunt ut labore et dolore magna.</li>
                                        <li>Ut enim ad minim veniam, quis nostrud exercitation.</li>
                                    </ul>
                                </li>

                                <li>
                                    <strong>Consectetur Adipiscing:</strong> Duis aute irure dolor in
                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur.
                                </li>

                                <li>
                                    <strong>Eiusmod Tempor:</strong> Excepteur sint occaecat cupidatat non
                                    proident, sunt in culpa qui officia deserunt mollit anim id est
                                    laborum.
                                </li>

                                <li>
                                    <strong>Ut Labore:</strong> Sed ut perspiciatis unde omnis iste natus
                                    error sit voluptatem accusantium doloremque laudantium.
                                </li>

                                <li>
                                    <strong>Magna Aliqua:</strong> Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit.
                                </li>

                                <li>
                                    <strong>Ut Enim:</strong> Neque porro quisquam est, qui dolorem ipsum
                                    quia dolor sit amet, consectetur, adipisci velit.
                                </li>
                            </ol>
                        </div>
                    </section>
                </div>
            </div>

            {/* all coupon modal start */}

            <div className={`${allCouponModal ? "all-coupon-modal-backdrop" : "all-coupon-modal-backdrop all-coupon-modal-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}></div>

            <div className={`${allCouponModal ? "all-coupon-modal" : "all-coupon-modal all-coupon-modal-hide"} d-flex flex-column bg-white top-0 bottom-0 px-4 py-3 position-fixed`}>
                <div className="all-coupon-modal-header d-flex align-items-center justify-content-between">
                    <h5 className="mb-0"><b>All Coupons</b></h5>

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

                                <button onClick={() => setSelectedCoupon(null)} className={selectedCoupon ? "btn remove-coupon-btn position-absolute" : "btn position-absolute"}>{selectedCoupon ? "Remove" : "Apply"}</button>
                            </div>

                            {selectedCoupon && <p className="copn-msge my-2">Congratulations! Instant Discount of ₹{totalDiscount} has been applied successfully.</p>}                              
                        </div>                                            
                
                        <div className="deiwhrwerwer hjiejfriwejrwer pe-2">
                            {coupons.map(renderCouponCard)}
                        </div>
                    </div>
                </div>
            </div>

            {/* all coupon modal end */}
        </>
    )
}