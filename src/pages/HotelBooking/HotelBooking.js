import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./HotelBooking.css";



export const HotelBooking = () => {
    const [selectedUpgradeMeal, setSelectedUpgradeMeal] = useState(null);
    const [imprtntInfoModal, setImprtntInfoModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [allCouponModal, setAllCouponModal] = useState(false);

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
                                                        Valentines Retreat - Near Candolim Beach
                                                    </h4>
                                                    
                                                    <div className="small-text">
                                                        <div className="de mb-1">
                                                            <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi no-rating bi-star-fill"></i>

                                                            <span className="badge badge-custom ms-1">
                                                                Couple Friendly
                                                            </span>
                                                        </div>

                                                        <p className="mb-0">Sequeira waddo, Candolim, Bardez Goa, India</p>
                                                    </div>
                                                </div>
                                                <img
                                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                                    className="hotel-img" alt=""
                                                />
                                            </div>
                                            {/* Check-in Section */}
                                            <div className="section-divider" />
                                            <div className="row text-center text-md-start">
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">CHECK IN</div>
                                                        <strong>Fri 03 Apr 2026</strong>
                                                        <br />
                                                        <span className="duiewjrewr">1 PM</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">CHECK OUT</div>
                                                        <strong>Sat 04 Apr 2026</strong>
                                                        <br />
                                                        <span className="duiewjrewr">11 AM</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="dfgdfg85">
                                                        <div className="small-text">GUEST</div>
                                                        <strong>2 Adults</strong>
                                                        <br />
                                                        <span className="duiewjrewr">1 Night |  | 1 Room</span>
                                                    </div>                                                    
                                                </div>
                                            </div>
                                            {/* Room Section */}
                                            <div className="section-divider" />
                                            <div className="d-flex justify-content-between jhgfdafdghsd">
                                                <div>
                                                    <h5 className="fw-bold mb-1">Suite with Balcony</h5>
                                                    <div className="small-text">2 Adults</div>
                                                    <ul className="small-text sgdtrwrqqwr mt-2 ps-2">
                                                        <li><i className="bi me-1 bi-check-circle-fill"></i> Room Only</li>

                                                        <li><i className="bi me-1 bi-check-circle-fill"></i> No meals included</li>

                                                        <li><i className="bi me-1 bi-check-circle-fill"></i> Complimentary Meal Upgrade</li>
                                                    </ul>
                                                    <strong>Non-Refundable</strong>
                                                    <div className="small-text">
                                                        Refund is not applicable for this booking
                                                    </div>
                                                    <a href="/" className="blue-link sbgswfeqw">
                                                        Cancellation policy details
                                                    </a>
                                                </div>
                                                <div className="text-end">
                                                    <a href="/" className="blue-link">
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
                                        {/* Row 1 */}
                                        {/* <div className="row g-3 align-items-end">
                                            <div className="col-md-2">
                                                <label className="form-label small-text">TITLE</label>
                                                <select className="form-select">
                                                    <option>Mr</option>
                                                    <option>Ms</option>
                                                </select>
                                            </div>
                                            <div className="col-md-5">
                                                <label className="form-label small-text">FULL NAME</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="First Name"
                                                />
                                            </div>
                                            <div className="col-md-5">
                                                <label className="form-label small-text d-none d-md-block">
                                                    &nbsp;
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div> */}
                                        {/* Row 2 */}
                                        {/* <div className="row g-3 mt-2">
                                            <div className="col-md-6">
                                                <label className="form-label small-text">
                                                    EMAIL ADDRESS 
                                                    <span className="text-muted">
                                                        (Booking voucher will be sent to this email ID)
                                                    </span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Email ID"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small-text">
                                                    MOBILE NUMBER
                                                </label>
                                                <div className="input-group">
                                                    <select className="form-select" style={{ maxWidth: 90 }}>
                                                        <option>+91</option>
                                                        <option>+1</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Contact Number"
                                                    />
                                                </div>
                                            </div>
                                        </div> */}

                                        <div className="doiewrjwrwer row align-items-center mb-4">
                                            <div className="col-lg-3">
                                                <div className="diweuhwerwer d-flex align-items-center">
                                                    <div className="diuwerwer position-relative">
                                                        <img src="./images/dew.png" alt="" />

                                                        <span className="position-absolute">Room 1</span>
                                                    </div>

                                                    <h6 className="mb-0 text-center">Adult 1</h6>
                                                </div>
                                            </div>

                                            <div className="col-lg-9">
                                                <div className="oidjeworwer row">
                                                    <div className="col-lg-2">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Title</label>

                                                            <select name="" className="form-select" id="">
                                                                <option value="">Mr.</option>

                                                                <option value="">Mrs.</option>

                                                                <option value="">Ms.</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">First Name</label>

                                                            <input type="text" className="form-control" placeholder="Enter First Name" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Last Name</label>

                                                            <input type="text" className="form-control" placeholder="Enter Last Name" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="doiewrjwrwer row align-items-center mb-4">
                                            <div className="col-lg-3">
                                                <div className="diweuhwerwer d-flex align-items-center">
                                                    <div className="diuwerwer position-relative">
                                                        <img src="./images/dew.png" alt="" />

                                                        <span className="position-absolute">Room 2</span>
                                                    </div>

                                                    <h6 className="mb-0 text-center">Adult 1</h6>
                                                </div>
                                            </div>

                                            <div className="col-lg-9">
                                                <div className="oidjeworwer row">
                                                    <div className="col-lg-2">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Title</label>

                                                            <select name="" className="form-select" id="">
                                                                <option value="">Mr.</option>

                                                                <option value="">Mrs.</option>

                                                                <option value="">Ms.</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">First Name</label>

                                                            <input type="text" className="form-control" placeholder="Enter First Name" />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-5">
                                                        <div className="odijewrwer">
                                                            <label className="form-label">Last Name</label>

                                                            <input type="text" className="form-control" placeholder="Enter Last Name" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="idujewrwer">
                                            <h6 className="fw-bold">Contact Details</h6>

                                            <div className="dwehrwer mb-3">
                                                <div className="row">
                                                    <div className="col-lg-4">
                                                        <label className="form-label">Email Address</label>

                                                        <input type="text" className="form-control" placeholder="Enter Email Address" />
                                                    </div>

                                                    <div className="col-lg-4">
                                                        <label className="form-label">Mobile Number</label>

                                                        <input type="text" className="form-control" placeholder="Enter Mobile Number" />
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="dshrysrfhety mb-0">Your booking details will be sent to this email address and mobile number.</h6>
                                        </div>
                                    </div>
                                    {/* Login Bar */}
                                    <div className="login-bar p-3 mt-2">
                                        <p className="gdsdgsfaer small-text mb-0">
                                            <span>Login</span> to prefill traveller details and get access to secret
                                            deals
                                        </p>
                                    </div>
                                    {/* Terms */}
                                    <div className="form-check mt-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            defaultChecked=""
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
                                    {/* Pay Button */}
                                    <div className="fbcfgsddefd mt-3">
                                        <button className="pay-btn">PAY NOW</button>
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

                                                        {selectedCoupon && <p className="copn-msge my-2">Congratulations! Instant Discount of Rs. ₹229 has been applied successfully.</p>}   
                                                    </div>            
                                            
                                                    <div className="deiwhrwerwer">
                                                        <label htmlFor="c1" className="coupon-card">
                                                            <input type="radio" checked={selectedCoupon === "MMTTRAVEL"} onChange={() => handleSelectedModal("MMTTRAVEL")} name="ucfewfrew" id="c1" className="d-none position-absolute" />

                                                            <div className="coupon-top d-flex align-items-center justify-content-between mb-1">
                                                                <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                                                    <img
                                                                        src="./images/discount.png"
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
                                                            <input type="radio" checked={selectedCoupon === "MMTSECUREV"} onChange={() => handleSelectedModal("MMTSECUREV")} name="ucfewfrew" id="c2" className="d-none position-absolute" />

                                                            <div className="coupon-top d-flex align-items-center justify-content-between">
                                                                <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                                                    <img
                                                                        src="./images/discount.png"
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
                                                            <input type="radio" checked={selectedCoupon === "MMTSECUREL"} onChange={() => handleSelectedModal("MMTSECUREL")} name="ucfewfrew" id="c3" className="d-none position-absolute" />

                                                            <div className="coupon-top d-flex align-items-center justify-content-between">
                                                                <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                                                    <img
                                                                        src="./images/discount.png"
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
                                                            <input type="radio" checked={selectedCoupon === "MMTSECUREJ"} onChange={() => handleSelectedModal("MMTSECUREJ")} name="ucfewfrew" id="c4" className="d-none position-absolute" />

                                                            <div className="coupon-top d-flex align-items-center justify-content-between">
                                                                <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                                                    <img
                                                                        src="./images/discount.png"
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

                            {selectedCoupon && <p className="copn-msge my-2">Congratulations! Instant Discount of Rs. ₹229 has been applied successfully.</p>}                              
                        </div>                                            
                
                        <div className="deiwhrwerwer hjiejfriwejrwer pe-2">
                            <label htmlFor="c1" className="coupon-card">
                                <input type="radio" checked={selectedCoupon === "MMTTRAVEL"} onChange={() => handleSelectedModal("MMTTRAVEL")} name="ucfewfrew" id="c1" className="d-none position-absolute" />

                                <div className="coupon-top d-flex align-items-center justify-content-between mb-1">
                                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                        <img
                                            src="./images/discount.png"
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
                                <input type="radio" checked={selectedCoupon === "MMTSECUREV"} onChange={() => handleSelectedModal("MMTSECUREV")} name="ucfewfrew" id="c2" className="d-none position-absolute" />

                                <div className="coupon-top d-flex align-items-center justify-content-between">
                                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                        <img
                                            src="./images/discount.png"
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
                                <input type="radio" checked={selectedCoupon === "MMTSECUREL"} onChange={() => handleSelectedModal("MMTSECUREL")} name="ucfewfrew" id="c3" className="d-none position-absolute" />

                                <div className="coupon-top d-flex align-items-center justify-content-between">
                                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                        <img
                                            src="./images/discount.png"
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
                                <input type="radio" checked={selectedCoupon === "MMTSECUREJ"} onChange={() => handleSelectedModal("MMTSECUREJ")} name="ucfewfrew" id="c4" className="d-none position-absolute" />

                                <div className="coupon-top d-flex align-items-center justify-content-between">
                                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                        <img
                                            src="./images/discount.png"
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
                                <input type="radio" checked={selectedCoupon === "MMTSECURER"} onChange={() => handleSelectedModal("MMTSECURER")} name="ucfewfrew" id="c5" className="d-none position-absolute" />

                                <div className="coupon-top d-flex align-items-center justify-content-between">
                                    <div className="dagsjrsfwertt d-flex align-items-center gap-2 px-2 py-1">
                                        <img
                                            src="./images/discount.png"
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
        </>
    )
}