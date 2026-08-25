import { useState } from "react";

import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";

import "./Css/UserProfile.css";



export const UserProfile = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);



    return (
        <div className="container">
            <div className="dejnwirwer d-flex">
                <UserSideNavbar isResUserNavOpen={isResUserNavOpen} setIsResUserNavOpen={setIsResUserNavOpen} />

                {/* ══════════ MAIN ══════════ */}
                <div className="main-wrap">
                    {/* Stat Cards Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <i className="bi bi-briefcase" />
                                </div>
                                <div className="label">Total Bookings</div>
                                <div className="value">7</div>
                                <a href="/" className="link-btn">
                                    View all bookings <i className="bi bi-arrow-right" />
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <i className="bi bi-calendar-check" />
                                </div>
                                <div className="label">Upcoming Trips</div>
                                <div className="value">2</div>
                                <a href="/" className="link-btn">
                                    View upcoming <i className="bi bi-arrow-right" />
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                            <div className="stat-card">
                                <div className="stat-icon purple">
                                    <i className="bi bi-wallet2" />
                                </div>
                                <div className="label">Total Spent</div>
                                <div className="value" style={{ fontSize: "1.25rem" }}>
                                    ₹ 1,25,000
                                </div>
                                <a href="/" className="link-btn">
                                    View payments <i className="bi bi-arrow-right" />
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                            <div className="stat-card">
                                <div className="stat-icon amber">
                                    <i className="bi bi-star-fill" />
                                </div>
                                <div className="label">Reward Points</div>
                                <div className="value amber-text">1,250</div>
                                <a href="/" className="link-btn" style={{ color: "var(--accent)" }}>
                                    View rewards <i className="bi bi-arrow-right" />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="row g-4">
                        {/* Left Column */}
                        <div className="col-lg-8">
                            {/* Upcoming Trip */}
                            <div className="section-header">
                                <h5>Upcoming Trip</h5>
                                <a href="/">View All</a>
                            </div>
                            <div className="trip-card mb-4">
                                <div className="row g-0">
                                    <div className="col-md-5">
                                        <img
                                            className="trip-img"
                                            style={{ height: "100%", minHeight: 200 }}
                                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                                            alt="Switzerland"
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <div className="trip-info" style={{ padding: 24 }}>
                                            <h5>Switzerland Explorer</h5>
                                            <p className="sub">
                                                <i
                                                    className="bi bi-geo-alt-fill"
                                                    style={{ color: "var(--primary)" }}
                                                />{" "}
                                                Zurich, Interlaken, Lucerne
                                            </p>
                                            <div className="trip-meta">
                                                <div className="trip-meta-row">
                                                    <i className="bi bi-calendar3" /> 20 May – 28 May, 2024
                                                </div>
                                                <div className="trip-meta-row">
                                                    <i className="bi bi-clock" /> 8 Days / 7 Nights
                                                </div>
                                                <div className="trip-meta-row">
                                                    <i className="bi bi-people" /> 2 Travelers
                                                </div>
                                            </div>
                                            <button className="btn btn-tour mt-2">View Trip Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* My Bookings */}
                            <div className="section-header">
                                <h5>My Bookings</h5>
                                <a href="/">View All</a>
                            </div>
                            <div className="bookings-card mb-4">
                                <div className="booking-row">
                                    <img
                                        className="booking-img"
                                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80"
                                        alt="Bali"
                                    />
                                    <div className="booking-details">
                                        <h6>Bali Paradise Tour</h6>
                                        <div className="loc">Indonesia</div>
                                        <div className="booking-meta">
                                            <span>
                                                <i className="bi bi-calendar3" /> 10 Apr – 17 Apr, 2024
                                            </span>
                                            <span>
                                                <i className="bi bi-people" /> 2 People
                                            </span>
                                        </div>
                                    </div>
                                    <div className="booking-right">
                                        <span className="badge-status badge-completed">Completed</span>
                                        <div className="booking-price">₹ 45,000</div>
                                    </div>
                                    <i className="bi bi-chevron-right text-muted" />
                                </div>
                                <div className="booking-row">
                                    <img
                                        className="booking-img"
                                        src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=200&q=80"
                                        alt="Maldives"
                                    />
                                    <div className="booking-details">
                                        <h6>Maldives Getaway</h6>
                                        <div className="loc">Maldives</div>
                                        <div className="booking-meta">
                                            <span>
                                                <i className="bi bi-calendar3" /> 15 Jun – 20 Jun, 2024
                                            </span>
                                            <span>
                                                <i className="bi bi-people" /> 2 People
                                            </span>
                                        </div>
                                    </div>
                                    <div className="booking-right">
                                        <span className="badge-status badge-upcoming">Upcoming</span>
                                        <div className="booking-price">₹ 80,500</div>
                                    </div>
                                    <i className="bi bi-chevron-right text-muted" />
                                </div>
                            </div>
                            {/* Wishlist */}
                            <div className="section-header">
                                <h5>Wishlist</h5>
                                <a href="/">View All</a>
                            </div>
                            <div className="wishlist-wrap">
                                <div className="wish-grid">
                                    <div className="wish-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=300&q=80"
                                            alt="Paris"
                                        />
                                        <div className="wish-heart">
                                            <i className="bi bi-heart-fill" />
                                        </div>
                                        <div className="wish-label">
                                            <p>Paris, France</p>
                                            <span>₹ 95,000</span>
                                        </div>
                                    </div>
                                    <div className="wish-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&q=80"
                                            alt="Dubai"
                                        />
                                        <div className="wish-heart">
                                            <i className="bi bi-heart-fill" />
                                        </div>
                                        <div className="wish-label">
                                            <p>Dubai, UAE</p>
                                            <span>₹ 70,000</span>
                                        </div>
                                    </div>
                                    <div className="wish-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80"
                                            alt="Thailand"
                                        />
                                        <div className="wish-heart">
                                            <i className="bi bi-heart-fill" />
                                        </div>
                                        <div className="wish-label">
                                            <p>Thailand</p>
                                            <span>₹ 60,000</span>
                                        </div>
                                    </div>
                                    <div className="wish-item">
                                        <img
                                            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&q=80"
                                            alt="Turkey"
                                        />
                                        <div className="wish-heart">
                                            <i className="bi bi-heart-fill" />
                                        </div>
                                        <div className="wish-label">
                                            <p>Turkey</p>
                                            <span>₹ 65,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="col-lg-4">
                            <div className="sticky-top">
                                {/* Profile */}
                                <div className="profile-card">
                                    <div className="hdr">
                                        <h5>My Profile</h5>
                                        <a href="/">
                                            <i className="bi bi-pencil" /> Edit
                                        </a>
                                    </div>
                                    <div className="profile-avatar-wrap">
                                        <img
                                            src="https://randomuser.me/api/portraits/men/32.jpg"
                                            alt="Mr."
                                        />
                                        <div className="avatar-cam">
                                            <i className="bi bi-camera" />
                                        </div>
                                    </div>
                                    <div className="profile-info">
                                        <h6>Mr. Mr</h6>
                                        <p>pfMr.@gmail.com</p>
                                        <p>+880 1712 345 678</p>
                                    </div>
                                    <div className="verified-badge">
                                        <div className="icon">
                                            <i className="bi bi-check-circle-fill" />
                                        </div>
                                        <div className="txt">
                                            <h6>Passport Verified</h6>
                                            <small>Verified on 12 Jan, 2024</small>
                                        </div>
                                    </div>
                                </div>
                                {/* Quick Actions */}
                                <div className="quick-card">
                                    <h5>Quick Actions</h5>
                                    <div className="qa-grid">                                        
                                        <button className="qa-btn amber">
                                            <i className="bi bi-airplane"></i> Flight Tickets
                                        </button>

                                        <button className="qa-btn slate">
                                            <i className="bi bi-building"></i> Hotel Booking
                                        </button>

                                        <button className="qa-btn blue">
                                            <i className="bi bi-compass"></i> Cruise Packages
                                        </button>

                                        <button className="qa-btn teal">
                                            <i className="bi bi-file-earmark-text"></i> More Packages
                                        </button>
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