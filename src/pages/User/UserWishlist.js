import { useState } from "react";
import { Link } from "react-router-dom";

import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";

import "./Css/UserWishlist.css";



export const UserWishlist = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);



    return (
        <div className="container">
            <div className="dejnwirwer d-flex">
                <UserSideNavbar isResUserNavOpen={isResUserNavOpen} setIsResUserNavOpen={setIsResUserNavOpen} />

                {/* ══════════ MAIN ══════════ */}
                <div className="main-wrap">
                    <div className="card border-0 bg-transparent">
                        <div className="card-header bg-transparent pb-4 ps-0">
                            <h5 className="mb-0"><b>My Wishlist (4)</b></h5>
                        </div>

                        <div className="container-fluid fiweojopwekrwer user-wishlist-cards gx-0">
                            <div className="row py-4">
                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                                    <div className="hotel-card">
                                        <div className="diwekmroiwerwer position-relative">
                                            <img
                                                className="img-fluid hotel-img"
                                                alt="Hotel"
                                                src="./images/hotel1.png"
                                            />

                                            <button className="remove-btn"><i className="fa-solid position-absolute top-50 start-50 translate-middle fa-heart"></i></button>

                                            <span class="rating">5.0</span>
                                        </div>

                                        <div className="hotel-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="hotel-title">
                                                    Planet Hollywood Adventure Package
                                                </h5>
                                            </div>

                                            <p className="location mb-2">
                                                <i className="fa-solid fa-location-dot"></i> Mumbai, India
                                            </p>

                                            <div className="wishlist-meta">
                                                <span>
                                                    <i className="fa-solid fa-clock"></i>
                                                    7 Days
                                                </span>

                                                <span>
                                                    <i className="fa-solid fa-users"></i>
                                                    2-8 People
                                                </span>
                                            </div>

                                            <div className="asfghjyrrewr my-2 d-flex align-items-center">
                                                <h4 className="price me-2">
                                                    ₹42,120
                                                </h4>

                                                <h4 className="price mrp-price">
                                                    ₹44,120
                                                </h4>
                                            </div>

                                            <div className="doeiwjrwe d-flex align-items-center justify-content-between gap-2">
                                                <Link to="/" className="btn btn-tour vd-btn">
                                                    View Details
                                                </Link>
                                                
                                                <Link to="/" className="btn btn-tour">
                                                    Book Now ↗
                                                </Link>             
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                                    <div className="hotel-card">
                                        <div className="diwekmroiwerwer position-relative">
                                            <img
                                                className="img-fluid hotel-img"
                                                alt="Hotel"
                                                src="./images/hotel1.png"
                                            />

                                            <button className="remove-btn"><i className="fa-solid position-absolute top-50 start-50 translate-middle fa-heart"></i></button>

                                            <span class="rating">5.0</span>
                                        </div>

                                        <div className="hotel-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="hotel-title">
                                                    Planet Hollywood Adventure Package
                                                </h5>
                                            </div>

                                            <p className="location mb-2">
                                                <i className="fa-solid fa-location-dot"></i> Mumbai, India
                                            </p>

                                            <div className="wishlist-meta">
                                                <span>
                                                    <i className="fa-solid fa-clock"></i>
                                                    7 Days
                                                </span>

                                                <span>
                                                    <i className="fa-solid fa-users"></i>
                                                    2-8 People
                                                </span>
                                            </div>

                                            <div className="asfghjyrrewr my-2 d-flex align-items-center">
                                                <h4 className="price me-2">
                                                    ₹42,120
                                                </h4>

                                                <h4 className="price mrp-price">
                                                    ₹44,120
                                                </h4>
                                            </div>

                                            <div className="doeiwjrwe d-flex align-items-center justify-content-between gap-2">
                                                <Link to="/" className="btn btn-tour vd-btn">
                                                    View Details
                                                </Link>
                                                
                                                <Link to="/" className="btn btn-tour">
                                                    Book Now ↗
                                                </Link>             
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                                    <div className="hotel-card">
                                        <div className="diwekmroiwerwer position-relative">
                                            <img
                                                className="img-fluid hotel-img"
                                                alt="Hotel"
                                                src="./images/hotel1.png"
                                            />

                                            <button className="remove-btn"><i className="fa-solid position-absolute top-50 start-50 translate-middle fa-heart"></i></button>

                                            <span class="rating">5.0</span>
                                        </div>

                                        <div className="hotel-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="hotel-title">
                                                    Planet Hollywood Adventure Package
                                                </h5>
                                            </div>

                                            <p className="location mb-2">
                                                <i className="fa-solid fa-location-dot"></i> Mumbai, India
                                            </p>

                                            <div className="wishlist-meta">
                                                <span>
                                                    <i className="fa-solid fa-clock"></i>
                                                    7 Days
                                                </span>

                                                <span>
                                                    <i className="fa-solid fa-users"></i>
                                                    2-8 People
                                                </span>
                                            </div>

                                            <div className="asfghjyrrewr my-2 d-flex align-items-center">
                                                <h4 className="price me-2">
                                                    ₹42,120
                                                </h4>

                                                <h4 className="price mrp-price">
                                                    ₹44,120
                                                </h4>
                                            </div>

                                            <div className="doeiwjrwe d-flex align-items-center justify-content-between gap-2">
                                                <Link to="/" className="btn btn-tour vd-btn">
                                                    View Details
                                                </Link>
                                                
                                                <Link to="/" className="btn btn-tour">
                                                    Book Now ↗
                                                </Link>             
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                                    <div className="hotel-card">
                                        <div className="diwekmroiwerwer position-relative">
                                            <img
                                                className="img-fluid hotel-img"
                                                alt="Hotel"
                                                src="./images/hotel1.png"
                                            />

                                            <button className="remove-btn"><i className="fa-solid position-absolute top-50 start-50 translate-middle fa-heart"></i></button>

                                            <span class="rating">5.0</span>
                                        </div>

                                        <div className="hotel-content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="hotel-title">
                                                    Planet Hollywood Adventure Package
                                                </h5>
                                            </div>

                                            <p className="location mb-2">
                                                <i className="fa-solid fa-location-dot"></i> Mumbai, India
                                            </p>

                                            <div className="wishlist-meta">
                                                <span>
                                                    <i className="fa-solid fa-clock"></i>
                                                    7 Days
                                                </span>

                                                <span>
                                                    <i className="fa-solid fa-users"></i>
                                                    2-8 People
                                                </span>
                                            </div>

                                            <div className="asfghjyrrewr my-2 d-flex align-items-center">
                                                <h4 className="price me-2">
                                                    ₹42,120
                                                </h4>

                                                <h4 className="price mrp-price">
                                                    ₹44,120
                                                </h4>
                                            </div>

                                            <div className="doeiwjrwe d-flex align-items-center justify-content-between gap-2">
                                                <Link to="/" className="btn btn-tour vd-btn">
                                                    View Details
                                                </Link>
                                                
                                                <Link to="/" className="btn btn-tour">
                                                    Book Now ↗
                                                </Link>             
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
    )
}