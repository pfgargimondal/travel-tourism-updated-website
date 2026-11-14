import { useState } from "react";
import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";

export const PasswordChange = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Please sign in again before changing your password.");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError("The new password and confirmation do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await http.post(
                    "/user/change-password",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
                            if (!response.data?.success) {
                throw new Error(response.data?.message || "Unable to change your password.");
            }

            setFormData({
                current_password: "",
                password: "",
                password_confirmation: "",
            });
            setSuccess(response.data.message || "Your password has been changed.");
        } catch (requestError) {
            console.error("Password change failed:", requestError);
            setError(
                requestError.response?.data?.message ||
                Object.values(requestError.response?.data?.errors || {}).flat()[0] ||
                requestError.message ||
                "Unable to change your password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            current_password: "",
            password: "",
            password_confirmation: "",
        });
        setError("");
        setSuccess("");
    };

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

                        <form className="safshjfyjerwerr row" onSubmit={handleSubmit}>
                            {error && <div className="col-12 alert alert-danger" role="alert">{error}</div>}
                            {success && <div className="col-12 alert alert-success" role="status">{success}</div>}
                            <div className="mb-3">
                                <label className="form-label" htmlFor="current-password">Current Password</label>
                                <input
                                    id="current-password"
                                    type="password"
                                    className="form-control"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="new-password">New Password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="form-control"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="d-flex gap-2 justify-content-end mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={resetForm}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-tour"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}