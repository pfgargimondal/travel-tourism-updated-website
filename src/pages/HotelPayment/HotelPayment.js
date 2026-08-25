import { Link } from "react-router-dom";

import "./HotelPayment.css";



export const HotelPayment = () => {
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

                    {/* LEFT SECTION */}
                    <div className="col-lg-9">
                        <div className="sgbdrsfweqeqe">
                            <div className="uihfsdfsff545">
                                {/* WALLET */}
                                {/* <div className="hotel-card">

                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="wallet-icon">
                                            <i className="bi bi-wallet2"></i>
                                        </div>

                                        <div>
                                            <h5 className="mb-0 fw-bold">
                                                Travel Wallet
                                            </h5>
                                            <small>Balance ₹0</small>
                                        </div>
                                    </div>

                                    <div className="row g-4 align-items-center">

                                        <div className="col-md-4">
                                            <div className="wallet-box">
                                                <small>Payment To Be Made</small>
                                                <h5>₹36,91</h5>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="wallet-box">
                                                <small>Wallet Balance</small>
                                                <h5>₹0</h5>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="wallet-box">
                                                <small>Balance Payable</small>
                                                <h5>₹36,91</h5>
                                            </div>
                                        </div>

                                    </div>

                                </div> */}

                                {/* PAYMENT CARD */}

                                <div className="hotel-card">
                                    <div className="payment-header pb-3">
                                        <h5 className="mb-0"><b>Payment Options</b></h5>

                                        <div className="session-timer py-1 px-3">
                                            <i class="bi me-1 bi-clock-history"></i> Session expires in:
                                            <span>09:39</span>
                                        </div>
                                    </div>

                                    <div className="payment-layout">

                                        {/* SIDEBAR */}

                                        <div className="payment-sidebar">
                                            <div className="payment-tab active">
                                                <img src="./images/credit.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Credit / Debit Card</h6>
                                                    <span>
                                                        Visa, Mastercard, Amex
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="payment-tab">
                                                <img src="./images/upi.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">UPI</h6>
                                                    <span>GooglePay, PhonePe</span>
                                                </div>
                                            </div>

                                            <div className="payment-tab">
                                                <img src="./images/wallet.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Wallets</h6>
                                                    <span>Paytm, Mobikwik</span>
                                                </div>
                                            </div>

                                            <div className="payment-tab">
                                                <img src="./images/nb.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">Net Banking</h6>
                                                    <span>All Major Banks</span>
                                                </div>
                                            </div>

                                            <div className="payment-tab">
                                                <img src="./images/emi.png" alt="" />

                                                <div>
                                                    <h6 className="mb-0">EMI</h6>
                                                    <span>Easy EMI Plans</span>
                                                </div>
                                            </div>

                                        </div>

                                        {/* FORM */}

                                        <div className="payment-content pe-0">

                                            <div className="mb-4">

                                                <label className="form-label">
                                                    Card Number
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Card Number"
                                                />

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 mb-4">

                                                    <label className="form-label">
                                                        Valid Through
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="MM / YY"
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-4">

                                                    <label className="form-label">
                                                        CVV
                                                    </label>

                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="CVV"
                                                    />

                                                </div>

                                            </div>

                                            <div className="mb-4">

                                                <label className="form-label">
                                                    Card Holder Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Name On Card"
                                                />

                                            </div>

                                            <div className="payment-footer">

                                                <div>
                                                    <h2 className="mb-0">
                                                        <b>₹ 3,691</b>
                                                    </h2>

                                                    <small>
                                                        <b>Total Fare</b>
                                                    </small>
                                                </div>

                                                <button className="btn btn-tour">
                                                    Make Payment
                                                </button>

                                            </div>

                                            <p className="secure-text mt-4">
                                                🔒 Secure encrypted payment gateway.
                                            </p>

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

                    {/* RIGHT SECTION */}

                    <div className="col-lg-3">
                        <div className="fgdfgdf mb-3">
                            <div className="summary overflow-hidden">
                                <h6 className="mb-0 px-3 py-2"><i className="bi me-1 bi-suitcase"></i> Booking Summary</h6>

                                <div className="diewnjrjwer dgdgfswfsdfsdf px-3 pt-2 pb-3">
                                    <p className="mb-1"><b>Vividus Hotels Bangalore</b></p>

                                    <div className="small-text">
                                        <div className="de mb-1">
                                            <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" />{" "}
                                            <i className="bi bi-star-fill" /> <i className="bi bi-star-fill" />{" "}
                                            <i className="bi no-rating bi-star-fill" />
                                        </div>
                                        <p className="mb-0">Sequeira waddo, Candolim, Bardez Goa, India</p>
                                    </div>

                                    <div className="date-box my-2">
                                        <div>
                                            <small>Check In</small>

                                            <h3 className="mb-0 d-flex gap-1 align-items-center">
                                                <b>13</b>

                                                <span>June <br /> 2026</span>
                                            </h3>
                                        </div>

                                        <div>
                                            <small>Check Out</small>

                                            <h3 className="mb-0 d-flex gap-1 align-items-center">
                                                <b>14</b>

                                                <span>June <br /> 2026</span>
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="cdoiwejerer mb-2">
                                        <p className="mb-1">You have selected the package for:</p>

                                        <span className="d-flex flex-wrap gap-2">
                                            <span><i className="bi bi-hospital"></i> 1 Room</span>

                                            <span>|</span> 

                                            <span><i className="bi bi-people"></i> 2 Adults</span> 

                                            <span>|</span> 

                                            <span><i className="fa-solid fa-baby"></i> 1 Child</span>
                                        </span>
                                    </div>

                                    <div className="cdoiwejerer">
                                        <p className="mb-1">Your chosen package includes:</p>

                                        <div className="doiewjrwer d-flex flex-wrap gap-2">
                                            <span>Standard Room</span>

                                            <span>Breakfast not included (Non-Refundable)</span>
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
                                        <tr>
                                            <td><b>1 Room X 1 Night</b></td>

                                            <td>₹ 7,299</td>
                                        </tr>

                                        <tr className="diewrwerwer">
                                            <td><b>Total Discount</b> <i className="fa-solid fa-info"></i></td>

                                            <td>-₹ 4,041</td>
                                        </tr>

                                        <tr>
                                            <td><b>Price After Discount</b></td>

                                            <td>₹ 3,258</td>
                                        </tr>

                                        <tr>
                                            <td><b>Taxes & Fees</b></td>

                                            <td>₹ 204</td>
                                        </tr>

                                        <tr className="ojdeopekwrer">
                                            <td><b>Grand Total</b></td>

                                            <td><b>₹ 3,462</b></td>
                                        </tr>
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