import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import http from "../../http";

import "./HotelPayment.css";


export const HotelPayment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {
      prebookDetails = null,
      prebookBookingCode = "",
        room,
        hotel,
        checkin,
        checkout,
        rooms,
        adults,
        children,
        totalFare = 0,
        totalTax = 0,
        totalDiscount = 0,
        selectedUpgradeMeal = null,
        passengerDetails = [],
        contactDetails = {},
    } = state || {};

    

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [bookingError, setBookingError] = useState("");

    const roomName = Array.isArray(room?.Name)
        ? room.Name[0]
        : room?.Name || "Selected Room";
    const formatDatePart = (date, options) =>
        date ? new Date(date).toLocaleDateString("en-GB", options) : "-";
    const formatAmount = (amount) => Math.round(Number(amount || 0)).toLocaleString("en-IN");
    const discountedPrice = Math.max(Number(totalFare) - Number(totalTax) - Number(totalDiscount), 0);
    const payableTotal = Math.max(Number(totalFare) - Number(totalDiscount), 0);

    const loadRazorpay = () => new Promise((resolve) => {
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

    const getBookingReference = (response) => (
      response?.booking_reference ||
      response?.bookingReference ||
      response?.booking_id ||
      response?.BookingId ||
      response?.data?.booking_reference ||
      response?.data?.bookingReference ||
      response?.data?.booking_id ||
      response?.data?.BookingId ||
      ""
    );

    const handlePaymentSuccess = async (
        paymentReference,
        paymentResponse
    ) => {

    const response = await http.post(
        "/hotel-payment/verify-and-book",
        {
            bookingReference:
                paymentReference,

            razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

            razorpay_order_id:
                paymentResponse.razorpay_order_id,

            razorpay_signature:
                paymentResponse.razorpay_signature,

            paymentMethod,
        }
    );

    if (!response?.data?.success) {
        throw new Error(
            response?.data?.message ||
            "Hotel booking failed."
        );
    }

    navigate("/thank-you", {
        state: {
            bookingReference:
                getBookingReference(response.data) || paymentReference,
            bookingStatus: "confirmed",
            bookingType: "hotel",
            bookingMessage:
                response.data.message ||
                "Your hotel has been booked successfully. Thank you for choosing us.",
        },
    });
};

const handleMakePayment = async () => {
    if (paymentLoading) {
        return;
    }

    setPaymentLoading(true);
    setBookingError("");

    try {
        /*
        |--------------------------------------------------------------------------
        | 1. Get TBO PreBook reference
        |--------------------------------------------------------------------------
        */

        const paymentReference =
            prebookBookingCode ||
            room?.BookingCode ||
            "";

        if (!paymentReference) {
            throw new Error(
                "The pre-booking reference is missing."
            );
        }

        if (!prebookDetails) {
            throw new Error(
                "Pre-book response is missing."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Prepare local booking payload
        |--------------------------------------------------------------------------
        */

        const bookingPayload = {
            prebook_details: prebookDetails,

            prebook_booking_code:
                paymentReference,

            hotel,

            room,

            checkin,

            checkout,

            rooms,

            adults,

            children,

            passengers:
                passengerDetails,

            contact_details:
                contactDetails,

            upgrade_meal:
                selectedUpgradeMeal,

            total_fare:
                Number(totalFare),

            total_tax:
                Number(totalTax),

            total_discount:
                Number(totalDiscount),

            payable_total:
                Number(payableTotal),
        };

        /*
        |--------------------------------------------------------------------------
        | 3. CREATE LOCAL BOOKING FIRST
        |--------------------------------------------------------------------------
        */

        const bookingResponse = await http.post(
            "/hotel-booking",
            bookingPayload
        );

        if (!bookingResponse?.data?.success) {
            throw new Error(
                bookingResponse?.data?.message ||
                "Unable to create hotel booking."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Get LOCAL booking reference
        |--------------------------------------------------------------------------
        */

        const localBookingReference =
            bookingResponse.data.booking_reference;

        if (!localBookingReference) {
            throw new Error(
                "Local booking reference was not generated."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        | Example:
        |
        | TBO BookingCode:
        | 1279415!TB!1!TB!....
        |
        | Local booking reference:
        | HTL-A8F3K9D2....
        |
        | Razorpay should use LOCAL reference.
        |--------------------------------------------------------------------------
        */

        /*
        |--------------------------------------------------------------------------
        | 5. Load Razorpay
        |--------------------------------------------------------------------------
        */

        if (!(await loadRazorpay())) {
            throw new Error(
                "Unable to load the Razorpay payment gateway."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Create Razorpay order
        |--------------------------------------------------------------------------
        */

        const orderResponse = await http.post(
            "/hotel-payment/create-order",
            {
                amount:
                    Number(payableTotal),

                bookingReference:
                    localBookingReference,

                paymentMethod,
            }
        );

        const order =
            orderResponse?.data;

        const razorpayOrderId =
            order?.order_id ||
            order?.razorpay_order_id;

        const razorpayKey =
            order?.key ||
            order?.razorpay_key ||
            process.env.REACT_APP_RAZORPAY_KEY_ID;

        if (
            !razorpayOrderId ||
            !razorpayKey
        ) {
            throw new Error(
                "Invalid payment order response from the server."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 7. Guest details for Razorpay
        |--------------------------------------------------------------------------
        */

        const guest =
            passengerDetails[0] || {};

        /*
        |--------------------------------------------------------------------------
        | 8. Open Razorpay
        |--------------------------------------------------------------------------
        */

        const razorpay =
            new window.Razorpay({

                key:
                    razorpayKey,

                amount:
                    order?.amount ||
                    Number(payableTotal) * 100,

                currency:
                    order?.currency ||
                    "INR",

                name:
                    "MyCheapTickets",

                description:
                    `${hotel?.hotel_name || "Hotel"} booking`,

                order_id:
                    razorpayOrderId,

                prefill: {
                    name:
                        `${guest.firstName || ""} ${guest.lastName || ""}`
                            .trim(),

                    email:
                        contactDetails.email ||
                        "",

                    contact:
                        contactDetails.mobile ||
                        "",
                },

                notes: {
                    bookingReference:
                        localBookingReference,
                },

                theme: {
                    color: "#0d6efd",
                },

                /*
                |--------------------------------------------------------------------------
                | 9. Razorpay SUCCESS
                |--------------------------------------------------------------------------
                */

                handler:
                    async (paymentResponse) => {

                        try {

                            await handlePaymentSuccess(
                                localBookingReference,
                                paymentResponse
                            );

                        } catch (error) {

                            setBookingError(
                                error.response?.data?.message ||
                                error.message ||
                                "Payment was received, but hotel booking failed."
                            );

                        } finally {

                            setPaymentLoading(
                                false
                            );
                        }
                    },

                modal: {

                    ondismiss: () => {

                        setPaymentLoading(
                            false
                        );
                    },
                },
            });

        /*
        |--------------------------------------------------------------------------
        | 10. Razorpay FAILED
        |--------------------------------------------------------------------------
        */

        razorpay.on(
            "payment.failed",
            (response) => {

                setBookingError(
                    response.error?.description ||
                    "Payment failed."
                );

                setPaymentLoading(
                    false
                );
            }
        );

        razorpay.open();

    } catch (error) {

        setBookingError(
            error.response?.data?.message ||
            error.message ||
            "Unable to start payment. Please try again."
        );

        setPaymentLoading(
            false
        );
    }
};


    return (
        <div className="sdfsdf655 tour-payment-page">
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

                <div className="row">

                    
                    <div className="col-lg-9">
                        <div className="sgbdrsfweqeqe">
                            <div className="uihfsdfsff545">
                                
                                

                                

                                <div className="hotel-card">
                                    <div className="payment-header pb-3">
                                        <h5 className="mb-0"><b>Payment Options</b></h5>

                                        
                                    </div>

                                    <div className="payment-layout">

                                        

                                        <div className="payment-sidebar">
                                            <div
                                              className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
                                              onClick={() => setPaymentMethod("card")}
                                              role="button"
                                              tabIndex={0}
                                            >
                                                <img src="./images/credit.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Credit / Debit Card</h6>
                                                    <span>
                                                        Visa, Mastercard, Amex
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                              className={`payment-tab ${paymentMethod === "upi" ? "active" : ""}`}
                                              onClick={() => setPaymentMethod("upi")}
                                              role="button"
                                              tabIndex={0}
                                            >
                                                <img src="./images/upi.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">UPI</h6>
                                                    <span>GooglePay, PhonePe</span>
                                                </div>
                                            </div>

                                            <div
                                              className={`payment-tab ${paymentMethod === "wallet" ? "active" : ""}`}
                                              onClick={() => setPaymentMethod("wallet")}
                                              role="button"
                                              tabIndex={0}
                                            >
                                                <img src="./images/wallet.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Wallets</h6>
                                                    <span>Paytm, Mobikwik</span>
                                                </div>
                                            </div>

                                            <div
                                              className={`payment-tab ${paymentMethod === "netbanking" ? "active" : ""}`}
                                              onClick={() => setPaymentMethod("netbanking")}
                                              role="button"
                                              tabIndex={0}
                                            >
                                                <img src="./images/nb.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Net Banking</h6>
                                                    <span>All Major Banks</span>
                                                </div>
                                            </div>

                                            <div
                                              className={`payment-tab ${paymentMethod === "emi" ? "active" : ""}`}
                                              onClick={() => setPaymentMethod("emi")}
                                              role="button"
                                              tabIndex={0}
                                            >
                                                <img src="./images/emi.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">EMI</h6>
                                                    <span>Easy EMI Plans</span>
                                                </div>
                                            </div>

                                        </div>

                                        

                                        <div className="payment-content pe-0">

                                            

                                            

                                            

                                            <div className="payment-footer">

                                                <div>
                                                    <small className="d-block">
                                                        Original Fare: ₹ {formatAmount(totalFare)}
                                                    </small>

                                                    <small className="d-block discount">
                                                        Discount: -₹ {formatAmount(totalDiscount)}
                                                    </small>

                                                    <h2 className="mb-0">
                                                        <b>₹ {formatAmount(payableTotal)}</b>
                                                    </h2>

                                                    <small>
                                                        <b>Amount Payable</b>
                                                    </small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-tour"
                                                    onClick={handleMakePayment}
                                                    disabled={paymentLoading}
                                                >
                                                    {paymentLoading ? "Opening Payment..." : "Make Payment"}
                                                </button>

                                            </div>

                                            <p className="secure-text mt-4">
                                                🔒 Secure encrypted payment gateway.
                                            </p>

                                            {bookingError && (
                                                <p className="text-danger mt-2 mb-0">{bookingError}</p>
                                            )}

                                            <p className="terms-text">
                                                <b>By Continuing, you agree to the
                                                <Link to="/"> Rules</Link>,
                                                <Link to="/"> Privacy Policy</Link>,
                                                <Link to="/"> User Agreement</Link> and
                                                <Link to="/"> Terms &amp; Conditions</Link>
                                                of MyCheapTickets</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <div className="col-lg-3">
                        <div className="fgdfgdf mb-3">
                            <div className="summary overflow-hidden">
                                <h6 className="mb-0 px-3 py-2"><i className="bi me-1 bi-suitcase"></i> Booking Summary</h6>

                                <div className="diewnjrjwer dgdgfswfsdfsdf px-3 pt-2 pb-3">
                                    <p className="mb-1"><b>{hotel?.hotel_name || "Hotel Booking"}</b></p>

                                    <div className="small-text">
                                        <div className="de mb-1">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <i
                                                    key={index}
                                                    className={`bi ${
                                                        index < Math.round(Number(hotel?.hotel_rating || 0))
                                                            ? "bi-star-fill"
                                                            : "no-rating bi-star-fill"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="mb-0">{hotel?.address || "Hotel address unavailable"}</p>
                                    </div>

                                    <div className="date-box my-2">
                                                <div>
                                            <small>Check In</small>

                                            <h3 className="mb-0 d-flex gap-1 align-items-center">
                                                <b>{formatDatePart(checkin, { day: "2-digit" })}</b>

                                                <span>{formatDatePart(checkin, { month: "short" })}<br />{formatDatePart(checkin, { year: "numeric" })}</span>
                                            </h3>
                                        </div>

                                        <div>
                                            <small>Check Out</small>

                                            <h3 className="mb-0 d-flex gap-1 align-items-center">
                                                <b>{formatDatePart(checkout, { day: "2-digit" })}</b>

                                                <span>{formatDatePart(checkout, { month: "short" })}<br />{formatDatePart(checkout, { year: "numeric" })}</span>
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="cdoiwejerer mb-2">
                                        <p className="mb-1">You have selected the package for:</p>

                                        <span className="d-flex flex-wrap gap-2">
                                            <span><i className="bi bi-hospital"></i> {rooms || 1} Room{Number(rooms || 1) > 1 ? "s" : ""}</span>

                                            <span>|</span> 

                                            <span><i className="bi bi-people"></i> {adults || 1} Adults</span> 

                                            <span>|</span> 

                                            <span><i className="fa-solid fa-baby"></i> {children || 0} Children</span>
                                        </span>
                                    </div>

                                    <div className="cdoiwejerer">
                                        <p className="mb-1">Your chosen package includes:</p>

                                        <div className="doiewjrwer d-flex flex-wrap gap-2">
                                            <span>{roomName}</span>

                                            <span>{room?.MealType || "Room Only"} ({room?.IsRefundable ? "Refundable" : "Non-Refundable"})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fgdfgdf mb-3">
                            <div className="summary hjhjk overflow-hidden">
                                <h6 className="mb-0 px-3 py-2"><i className="bi me-1 bi-wallet"></i> Fare Summary</h6>

                                <div className="diewnjrjwer px-3">
                                    <table className="table mb-0">
                                    <tbody>
                                      <tr>
                                        <td><b>{rooms || 1} Room X 1 Night</b></td>

                                        <td>₹ {formatAmount(totalFare)}</td>
                                      </tr>

                                      <tr className="diewrwerwer">
                                        <td><b>Total Discount</b> <i className="fa-solid fa-info"></i></td>

                                        <td>-₹ {formatAmount(totalDiscount)}</td>
                                      </tr>

                                      <tr>
                                        <td><b>Price After Discount</b></td>

                                        <td>₹ {formatAmount(discountedPrice)}</td>
                                      </tr>

                                      <tr>
                                        <td><b>Taxes & Fees</b></td>

                                        <td>₹ {formatAmount(totalTax)}</td>
                                      </tr>

                                      <tr className="ojdeopekwrer">
                                        <td><b>Grand Total</b></td>

                                        <td><b>₹ {formatAmount(payableTotal)}</b></td>
                                      </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}