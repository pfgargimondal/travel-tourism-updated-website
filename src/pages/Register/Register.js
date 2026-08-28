import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import http from "../../http";

export const Register = ({
    loginRegModal,
    setLoginRegModal,
    regModal,
    setRegModal,
    googleUser,
}) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * When registration is opened after Google login,
     * automatically fill Name and Email.
     */
    useEffect(() => {
        if (googleUser) {
            setFormData((prev) => ({
                ...prev,
                name: googleUser.name || "",
                email: googleUser.email || "",
            }));
        }
    }, [googleUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");

        // Basic validation
        if (!formData.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirmation: formData.confirmPassword,

                // Google information
                google_id: googleUser?.sub || null,
                avatar: googleUser?.picture || null,

                // This tells Laravel that this is
                // registration coming from Google.
                google_register: !!googleUser,
            };

            console.log("Register Payload:", payload);

            const response = await http.post(
                `/user/register`,
                payload
            );

            console.log("Register Response:", response.data);

            if (response.data.success) {

                /*
                 * Laravel should return JWT token after
                 * successful registration.
                 */
                if (response.data.token) {
                    localStorage.setItem(
                        "token",
                        response.data.token
                    );
                }

                if (response.data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                }

                // Close registration modal
                setRegModal(false);

                // Clear form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                });

                // Refresh so AuthContext/header updates
                window.location.reload();
            }

        } catch (err) {

            console.error(
                "Registration Error:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            {/* Backdrop */}
            <div
                onClick={() => setRegModal(false)}
                className={
                    regModal
                        ? "reg-login-wrapper-backdrop position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0"
                        : "reg-login-wrapper-backdrop reg-login-wrapper-backdrop-hide position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0"
                }
            />

            {/* Registration Modal */}
            <div
                className={
                    regModal
                        ? "reg-login-wrapper rounded-4 overflow-hidden"
                        : "reg-login-wrapper rounded-4 overflow-hidden reg-login-wrapper-hide"
                }
            >

                <div className="row h-100 align-items-center">

                    {/* Registration Form */}
                    <div className="col-lg-6 col-md-6">

                        <div className="login-box">

                            <h4 className="mb-3 text-dark text-center">
                                Register New Account
                            </h4>

                            {/* Google Registration Message */}
                            {googleUser && (
                                <div className="alert alert-info py-2 small">
                                    Your Google account is verified.
                                    Please complete the remaining details
                                    to create your account.
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>

                                {/* Full Name */}
                                <div className="mb-2">

                                    <label className="form-label text-dark">
                                        <i className="bi me-1 bi-person"></i>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control custom-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />

                                </div>

                                {/* Email */}
                                <div className="mb-2">

                                    <label className="form-label text-dark">
                                        <i className="bi me-1 bi-envelope"></i>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control custom-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        readOnly={!!googleUser}
                                    />

                                </div>

                                {/* Phone */}
                                <div className="mb-2">

                                    <label className="form-label text-dark">
                                        <i className="bi me-1 bi-telephone"></i>
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control custom-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />

                                </div>

                                {/* Password */}
                                <div className="mb-2">

                                    <label className="form-label text-dark">
                                        <i className="bi me-1 bi-lock"></i>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control custom-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                    />

                                </div>

                                {/* Confirm Password */}
                                <div className="mb-2">

                                    <label className="form-label text-dark">
                                        <i className="bi me-1 bi-lock"></i>
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control custom-input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                    />

                                </div>

                                {/* Remember Me */}
                                <div className="form-check mb-2">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="rememberMe"
                                    />

                                    <label
                                        className="form-check-label text-dark"
                                        htmlFor="rememberMe"
                                    >
                                        Remember me?
                                    </label>

                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    className="btn login-btn w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Register"
                                    }
                                </button>

                                {/* Login */}
                                <div className="lomsodjfkdf d-flex justify-content-between align-items-center mt-2">

                                    <div className="mt-2 d-flex align-items-center djewjrokwekrewr text-dark">

                                        <p className="mb-0 small me-1 text-dark">
                                            Already have an account?
                                        </p>

                                        <Link
                                            onClick={() => {
                                                setRegModal(false);
                                                setLoginRegModal(true);
                                            }}
                                            to="/"
                                            className="text-dark fhjkljytre small"
                                        >
                                            Login
                                        </Link>

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>


                    {/* Right Content */}
                    <div className="col-lg-6 d-none d-lg-block text-white">

                        <div className="right-content">

                            <h1>
                                THE GOAL OF LIFE IS
                                <br />
                                LIVING IN AGREEMENT
                                <br />
                                WITH NATURE.
                            </h1>

                            <div className="dfnjhdf" />

                            <div className="social-icons mt-4">

                                <i className="fab fa-facebook-f" />
                                <i className="fab fa-instagram" />
                                <i className="fab fa-linkedin-in" />
                                <i className="fab fa-twitter" />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};
