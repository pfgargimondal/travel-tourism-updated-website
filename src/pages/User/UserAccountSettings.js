import { useState } from "react";

import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";

import "./Css/UserAccountSettings.css";



export const UserAccountSettings = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);



    return (
        <div className="container">
            <div className="dejnwirwer d-flex">
                <UserSideNavbar isResUserNavOpen={isResUserNavOpen} setIsResUserNavOpen={setIsResUserNavOpen} />  

                {/* ══════════ MAIN ══════════ */}
                <div className="main-wrap">
                    <div className="card border-0 bg-transparent">
                        <div className="card-header bg-transparent py-4 ps-0">
                            <h5 className="mb-0"><b>General Information</b></h5>
                        </div>

                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <div className="avatar-upload">
                                    <div className="avatar-edit">
                                        <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" />
                                        <label htmlFor="imageUpload" />
                                    </div>
                                    <div className="avatar-preview">
                                        <div
                                            id="imagePreview"
                                            style={{ backgroundImage: "url(./images/sawdw.png)" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <form className="safshjfyjerwerr row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="John"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        defaultValue="john@example.com"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        defaultValue="+91 9876543210"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Date of Birth <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="Address"
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="City"
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="State"
                                    />
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-3"><b>Security</b></h5>

                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                    />
                                </div>

                                <div className="fsefeoikewprwer d-flex gap-2 justify-content-end mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-tour"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}