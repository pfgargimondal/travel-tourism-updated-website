import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

import "./UserSideNavbar.css";
import "./UserSideNavbarResponsive.css";



export const UserSideNavbar = ({ isResUserNavOpen, setIsResUserNavOpen }) => {
    const pathName = useLocation().pathname;
    const { user, logout } = useAuth();
    const userName = user?.name?.trim() || "User";



    return (
        <>
            {window.innerWidth < 992 && (
                <div onClick={() => setIsResUserNavOpen(false)} className={`${isResUserNavOpen ? "sidebar-backdrop" : "sidebar-backdrop sidebar-backdrop-hide"} position-fixed w-100 h-100 top-0 start-0 bottom-0 end-0`}></div>
            )}            

            <aside className={(isResUserNavOpen && (window.innerWidth < 992)) ? "sidebar" : "sidebar sidebar-hide"}>
                <div className="sidebar-brand">
                    <div className="topbar pb-0">
                        <div className="topbar-left">
                            <h3 className="mb-0">Hi, {userName}! 👋</h3>
                            <p>Ready for your next adventure?</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="list-unstyled">
                        <li className="nav-item">
                            <NavLink to="/user-profile" end className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="bi bi-grid" /> Dashboard
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/account-information" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="bi bi-person" /> Account Information
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/user-booking" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="bi bi-journal-bookmark" /> My Bookings
                            </NavLink>
                        </li>

                        {/* <li className="nav-item">
                            <Link to="/my-trips">
                                <i className="bi bi-map" /> My Trips
                            </Link>
                        </li> */}

                        <li className="nav-item">
                            <NavLink to="/wishlist" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="bi bi-heart" /> Wishlist
                            </NavLink>
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
                            <NavLink to="/change-password" className={({ isActive }) => isActive ? "active" : undefined}>
                                <i className="bi bi-lock"></i> Change Password
                            </NavLink>
                        </li>
                        <li
                            className="nav-item logout mt-2"
                            onClick={logout}
                            style={{ cursor: "pointer" }}
                        >
                            <a href="/" onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}>
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
                            <h3 className="mb-0">Hi, {userName}! 👋</h3>
                            <p>Ready for your next adventure?</p>
                        </div>
                    </div>
                </div>

                <i onClick={() => setIsResUserNavOpen(prev => !prev)} className="bi bi-chevron-double-right" id="res-ua-btn"></i>
            </div>
        </>
    )
}