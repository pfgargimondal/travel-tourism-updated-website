import { useEffect, useRef, useState } from "react";
import { UserSideNavbar } from "./Component/UserSideNavbar/UserSideNavbar";
import "./Css/UserAccountSettings.css";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";



export const UserAccountSettings = () => {
    const [isResUserNavOpen, setIsResUserNavOpen] = useState(false);
    const { user, token, updateUser } = useAuth();
    const [formData, setFormData] = useState(() => ({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || user?.mobile || user?.mobile_number || "",
        dob: (user?.dob || user?.date_of_birth || "").slice(0, 10),
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
    }));
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || user?.picture || user?.avtar || "./images/sawdw.png"
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (!selectedAvatar) {
            setAvatarPreview(
                user?.avatar || user?.picture || user?.avtar || "./images/sawdw.png"
            );
            return undefined;
        }

        const objectUrl = URL.createObjectURL(selectedAvatar);
        setAvatarPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedAvatar, user?.avatar, user?.picture, user?.avtar]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setError("Please choose a JPG or PNG image.");
            event.target.value = "";
            return;
        }

        setSelectedAvatar(file);
        setError("");
        setSuccess("");
    };

    const resetForm = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || user?.mobile || user?.mobile_number || "",
            dob: (user?.dob || user?.date_of_birth || "").slice(0, 10),
            address: user?.address || "",
            city: user?.city || "",
            state: user?.state || "",
        });
        setSelectedAvatar(null);
        setError("");
        setSuccess("");
        if (avatarInputRef.current) avatarInputRef.current.value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Please sign in again before updating your profile.");
            return;
        }

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value.trim());
        });
        if (selectedAvatar) payload.append("avatar", selectedAvatar);

        try {
            setLoading(true);
            const response = await http.post(
                    "/user/update-profile",
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Unable to update your profile.");
            }

            const returnedUser =
                response.data.user ||
                response.data.data?.user ||
                (response.data.data && !Array.isArray(response.data.data)
                    ? response.data.data
                    : {});
            updateUser({ ...user, ...formData, ...returnedUser });
            setSelectedAvatar(null);
            setSuccess(response.data.message || "Your profile has been updated.");
        } catch (requestError) {
            console.error("Profile update failed:", requestError);
            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to update your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


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
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            id="imageUpload"
                                            accept="image/png, image/jpeg"
                                            onChange={handleAvatarChange}
                                        />
                                        <label htmlFor="imageUpload" />
                                    </div>
                                    <div className="avatar-preview">
                                        <div id="imagePreview"
                                            style={{
                                                backgroundImage: `url("${avatarPreview}")`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>



                            <form className="safshjfyjerwerr row" onSubmit={handleSubmit}>
                                {error && <div className="col-12 alert alert-danger" role="alert">{error}</div>}
                                {success && <div className="col-12 alert alert-success" role="status">{success}</div>}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        name="name"
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        name="email"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        name="phone"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Date of Birth <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        name="dob"
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleChange}
                                        name="address"
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.city}
                                        onChange={handleChange}
                                        name="city"
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.state}
                                        onChange={handleChange}
                                        name="state"
                                    />
                                </div>

                                {/* <hr className="my-4" />

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
                                </div> */}

                                <div className="fsefeoikewprwer d-flex gap-2 justify-content-end mt-4">
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
        </div>
    )
}