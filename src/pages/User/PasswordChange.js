import { useState } from "react";

import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";



export const PasswordChange = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);



    return (
        <div className="container">
            <div className="dejnwirwer d-flex">
                <UserSideNavbar isResUserNavOpen={isResUserNavOpen} setIsResUserNavOpen={setIsResUserNavOpen} />

                {/* ══════════ MAIN ══════════ */}
                <div className="main-wrap">
                    <div className="card border-0 bg-transparent">
                        <div className="card-header bg-transparent py-4 ps-0 mb-4">
                            <h5 className="mb-0"><b>Security</b></h5>
                        </div>

                        <form className="safshjfyjerwerr row">
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

                            <div className="d-flex gap-2 justify-content-end mt-4">
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
    )
}