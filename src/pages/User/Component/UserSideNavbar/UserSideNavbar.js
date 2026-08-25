// import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./UserSideNavbar.css";
import "./UserSideNavbarResponsive.css";



export const UserSideNavbar = ({ isResUserNavOpen, setIsResUserNavOpen }) => {
    const pathName = useLocation().pathname;



    return (
        <>
            {window.innerWidth < 992 && (
                <div onClick={() => setIsResUserNavOpen(false)} className={`${isResUserNavOpen ? "sidebar-backdrop" : "sidebar-backdrop sidebar-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}></div>
            )}            

            <aside className={(isResUserNavOpen && (window.innerWidth < 992)) ? "sidebar" : "sidebar sidebar-hide"}>
                <div className="sidebar-brand">
                    <div className="topbar pb-0">
                        <div className="topbar-left">
                            <h3 className="mb-0">Hi, Mr! 👋</h3>
                            <p>Ready for your next adventure?</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="list-unstyled">
                        <li className="nav-item">
                            <Link to="/user-profile" className="active">
                                <i className="bi bi-grid" /> Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/account-information">
                                <i className="bi bi-person" /> Account Information
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/user-booking">
                                <i className="bi bi-journal-bookmark" /> My Bookings
                            </Link>
                        </li>

                        {/* <li className="nav-item">
                            <Link to="/my-trips">
                                <i className="bi bi-map" /> My Trips
                            </Link>
                        </li> */}

                        <li className="nav-item">
                            <Link to="/wishlist">
                                <i className="bi bi-heart" /> Wishlist
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                                    <a href="#">
                                        <i className="bi bi-credit-card" /> Payments
                                    </a>
                                </li> */}
                        {/* <li className="nav-item">
                                    <a href="#">
                                        <i className="bi bi-star" /> Reward Points
                                    </a>
                                </li> */}

                        {/* <li className="nav-item">
                            <a href="#">
                                <i className="bi bi-chat-square-text" /> Reviews
                            </a>
                        </li> */}

                        <li className="nav-item">
                            <Link to="/change-password">
                                <i class="bi bi-lock"></i> Change Password
                            </Link>
                        </li>

                        <li className="nav-item logout mt-2">
                            <a href="/">
                                <i className="bi bi-box-arrow-left" /> Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className="res-user-account d-flex d-lg-none align-items-center justify-content-between">
                <div className="sidebar-brand ps-0">
                    {!pathName.includes("/account-information") && (
                        <div className="avatar-upload">
                            <div className="avatar-preview">
                                <div
                                    id="imagePreview"
                                    style={{ backgroundImage: 'url("./images/sawdw.png")' }}
                                />
                            </div>
                        </div>
                    )}                    
                    
                    <div className="topbar pb-0">
                        <div className="topbar-left">
                            <h3 className="mb-0">Hi, Mr! 👋</h3>
                            <p>Ready for your next adventure?</p>
                        </div>
                    </div>
                </div>

                <i onClick={() => setIsResUserNavOpen(prev => !prev)} className="bi bi-chevron-double-right" id="res-ua-btn"></i>
            </div>
        </>
    )
}