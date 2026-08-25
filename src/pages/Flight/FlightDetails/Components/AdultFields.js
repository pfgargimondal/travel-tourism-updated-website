import React from "react";

export const AdultFields = ({
    adult,
    index,
    countryCode,
    adultRule,
    handleAdultChange,
}) => {

    return (

        <div className="row g-3">

            {/* Title */}

            {adultRule?.Title && (
                <div className="col-md-2">

                    <label className="form-label">
                        Title <span className="text-danger">*</span>
                    </label>

                    <select
                        className="form-select"
                        value={adult.title || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "title", e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                    </select>

                </div>
            )}

            {/* First Name */}

            {adultRule?.First_Name && (
                <div className="col-md-5">

                    <label className="form-label">
                        First & Middle Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="First & Middle Name"
                        value={adult.firstName || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "firstName", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Last Name */}

            {adultRule?.Last_Name && (
                <div className="col-md-5">

                    <label className="form-label">
                        Last Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        value={adult.lastName || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "lastName", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Gender */}

            {adultRule?.Gender && (
                <div className="col-md-4">

                    <label className="form-label">
                        Gender <span className="text-danger">*</span>
                    </label>

                    <div className="btn-group w-100">

                        <button
                            type="button"
                            className={`btn ${
                                adult.gender === "Male"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() =>
                                handleAdultChange(index, "gender", "Male")
                            }
                        >
                            Male
                        </button>

                        <button
                            type="button"
                            className={`btn ${
                                adult.gender === "Female"
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() =>
                                handleAdultChange(index, "gender", "Female")
                            }
                        >
                            Female
                        </button>

                    </div>

                </div>
            )}

            {/* Date of Birth */}

            {adultRule?.DOB && (
                <div className="col-md-4">

                    <label className="form-label">
                        Date of Birth <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.dob || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "dob", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Age */}

            {adultRule?.Age && (
                <div className="col-md-4">

                    <label className="form-label">
                        Age <span className="text-danger">*</span>
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={adult.age || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "age", e.target.value)
                        }
                    />

                </div>
            )}

                        {/* Nationality */}

            {adultRule?.Nationality && (
                <div className="col-md-4">

                    <label className="form-label">
                        Nationality <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nationality"
                        value={adult.nationality || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "nationality", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Number */}

            {adultRule?.Passport_Number && (
                <div className="col-md-4">

                    <label className="form-label">
                        Passport Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Passport Number"
                        value={adult.passportNumber || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "passportNumber", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Expiry */}

            {adultRule?.Passport_Expiry && (
                <div className="col-md-4">

                    <label className="form-label">
                        Passport Expiry <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.passportExpiry || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "passportExpiry", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Issuing Country */}

            {adultRule?.Passport_Issuing_Country && (
                <div className="col-md-4">

                    <label className="form-label">
                        Passport Issuing Country <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Passport Issuing Country"
                        value={adult.passportCountry || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "passportCountry", e.target.value)
                        }
                    />

                </div>
            )}

            {/* PAN Card */}

            {adultRule?.PanCard_No && (
                <div className="col-md-4">

                    <label className="form-label">
                        PAN Card Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="PAN Card Number"
                        value={adult.panCardNo || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "panCardNo", e.target.value)
                        }
                    />

                </div>
            )}

            {/* ID Proof Number */}

            {adultRule?.IdProof_Number && (
                <div className="col-md-4">

                    <label className="form-label">
                        ID Proof Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="ID Proof Number"
                        value={adult.idProofNumber || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "idProofNumber", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Student ID */}

            {adultRule?.Student_Id && (
                <div className="col-md-4">

                    <label className="form-label">
                        Student ID <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Student ID"
                        value={adult.studentId || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "studentId", e.target.value)
                        }
                    />

                </div>
            )}

                        {/* Defence Service ID */}

            {adultRule?.DefenceServiceId && (
                <div className="col-md-4">

                    <label className="form-label">
                        Defence Service ID <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Defence Service ID"
                        value={adult.defenceServiceId || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceServiceId", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Defence Issue Date */}

            {adultRule?.DefenceIssueDate && (
                <div className="col-md-4">

                    <label className="form-label">
                        Defence Issue Date <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.defenceIssueDate || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceIssueDate", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Defence Expiry Date */}

            {adultRule?.DefenceExpiryDate && (
                <div className="col-md-4">

                    <label className="form-label">
                        Defence Expiry Date <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.defenceExpiryDate || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceExpiryDate", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Mandatory SSR */}

            {adultRule?.Mandatory_SSRs && (
                <div className="col-md-12">

                    <label className="form-label">
                        Mandatory SSR
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Mandatory SSR"
                        value={adult.mandatorySSR || ""}
                        onChange={(e) =>
                            handleAdultChange(index, "mandatorySSR", e.target.value)
                        }
                    />

                </div>
            )}

            {/* ================= ALWAYS SHOW ================= */}

            <div className="col-md-4">

                <label className="form-label">
                    Country Code(Optional)
                </label>

                <select
                    className="form-select"
                    value={adult.countryCode || ""}
                    onChange={(e) =>
                        handleAdultChange(index, "countryCode", e.target.value)
                    }
                    >
                    <option value="">Select Country Code</option>

                    {countryCode.map((country) => (
                        <option
                        key={country.id}
                        value={country.phone_code}
                        >
                        {country.name} ({country.phone_code})
                        </option>
                    ))}
                </select>

            </div>

            <div className="col-md-4">

                <label className="form-label">
                    Mobile Number(Optional)
                </label>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile Number"
                    value={adult.mobile || ""}
                    onChange={(e) =>
                        handleAdultChange(index, "mobile", e.target.value)
                    }
                />

            </div>

            <div className="col-md-4">

                <label className="form-label">
                    Email Address(Optional)
                </label>

                <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={adult.email || ""}
                    onChange={(e) =>
                        handleAdultChange(index, "email", e.target.value)
                    }
                />

            </div>

        </div>

    );
};
