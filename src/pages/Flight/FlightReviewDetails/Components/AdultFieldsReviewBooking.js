import React from "react";

export const AdultFieldsReviewBooking = ({
    adult,
    index,
    countryCode,
    adultRule,
    handleAdultChange,
}) => {

    console.log(adult, 'adult');


    return (

        <div className="row g-3">

            {/* Title */}

            {adult?.isSavedPassenger && adult?.title && (
                <div className="col-md-2">

                    <label className="form-label">
                        Title <span className="text-danger">*</span>
                    </label>

                    <select
                        className="form-select"
                        value={adult.title || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "title", e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        <option value="MR">Mr</option>
                        <option value="MRS">Mrs</option>
                        <option value="MS">Miss</option>
                    </select>

                </div>
            )}

            {/* First Name */}

            {adult?.isSavedPassenger && adult?.firstName && (
                <div className="col-md-5">

                    <label className="form-label">
                        First & Middle Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="First & Middle Name"
                        value={adult.firstName || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "firstName", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Last Name */}

            {adult?.isSavedPassenger && adult?.lastName && (
                <div className="col-md-5">

                    <label className="form-label">
                        Last Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        value={adult.lastName || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "lastName", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Gender */}

            {adult?.isSavedPassenger &&
                (adult?.gender === 0 || adult?.gender === 1) && (
                    <div className="col-md-4">
                    <label className="form-label">
                        Gender <span className="text-danger">*</span>
                    </label>

                    <div className="btn-group w-100">
                        <button
                        type="button"
                        className={`btn ${
                            Number(adult.gender) === 0
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        disabled
                        >
                        Male
                        </button>

                        <button
                        type="button"
                        className={`btn ${
                            Number(adult.gender) === 1
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        disabled
                        >
                        Female
                        </button>
                    </div>
                    </div>
                )}

            {/* Date of Birth */}

            {adult?.isSavedPassenger && adult?.dob && (
                <div className="col-md-4">
                    <label className="form-label">
                        Date of Birth <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.dob || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "dob", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Age */}

            {adult?.isSavedPassenger && adult?.age && (
                <div className="col-md-4">

                    <label className="form-label">
                        Age <span className="text-danger">*</span>
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={adult.age || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "age", e.target.value)
                        }
                    />

                </div>
            )}

                        {/* Nationality */}

            {adult?.isSavedPassenger && adult?.nationality && (
                <div className="col-md-4">

                    <label className="form-label">
                        Nationality <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nationality"
                        value={adult.nationality || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "nationality", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Number */}

             {adult?.isSavedPassenger && adult?.passportNumber && (
                <div className="col-md-4">
                    <label className="form-label">
                        Passport Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Passport Number"
                        value={adult.passportNumber || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "passportNumber", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Expiry */}

            {adult?.isSavedPassenger && adult?.passportExpiry && (
                <div className="col-md-4">

                    <label className="form-label">
                        Passport Expiry <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.passportExpiry || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "passportExpiry", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Passport Issuing Country */}

            {adult?.isSavedPassenger && adult?.passportCountry && (
                <div className="col-md-4">
                    <label className="form-label">
                        Passport Issuing Country <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Passport Issuing Country"
                        value={adult.passportCountry || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "passportCountry", e.target.value)
                        }
                    />

                </div>
            )}

            {/* PAN Card */}

            {adult?.isSavedPassenger && adult?.panCardNo && (
                <div className="col-md-4">
                    <label className="form-label">
                        PAN Card Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="PAN Card Number"
                        value={adult.panCardNo || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "panCardNo", e.target.value)
                        }
                    />

                </div>
            )}

            {/* ID Proof Number */}

            {adult?.isSavedPassenger && adult?.idProofNumber && (
                <div className="col-md-4">
                    <label className="form-label">
                        ID Proof Number <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="ID Proof Number"
                        value={adult.idProofNumber || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "idProofNumber", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Student ID */}

            {adult?.isSavedPassenger && adult?.studentId && (
                <div className="col-md-4">
                    <label className="form-label">
                        Student ID <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Student ID"
                        value={adult.studentId || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "studentId", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Defence Service ID */}

            {adult?.isSavedPassenger && adult?.defenceServiceId && (
                <div className="col-md-4">
                    <label className="form-label">
                        Defence Service ID <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Defence Service ID"
                        value={adult.defenceServiceId || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceServiceId", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Defence Issue Date */}

            {adult?.isSavedPassenger && adult?.DefenceIssueDate && (
                <div className="col-md-4">
                    <label className="form-label">
                        Defence Issue Date <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.defenceIssueDate || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceIssueDate", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Defence Expiry Date */}

            {adult?.isSavedPassenger && adult?.DefenceExpiryDate && (
                <div className="col-md-4">
                    <label className="form-label">
                        Defence Expiry Date <span className="text-danger">*</span>
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={adult.defenceExpiryDate || ""}
                        disabled={adult?.isSavedPassenger === true}
                        onChange={(e) =>
                            handleAdultChange(index, "defenceExpiryDate", e.target.value)
                        }
                    />

                </div>
            )}

            {/* Mandatory SSR */}

            {adult?.isSavedPassenger && adult?.mandatorySSR && (
                <div className="col-md-12">
                    <label className="form-label">
                        Mandatory SSR
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Mandatory SSR"
                        value={adult.mandatorySSR || ""}
                        disabled={adult?.isSavedPassenger === true}
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
                    disabled={adult?.isSavedPassenger === true}
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
                    disabled={adult?.isSavedPassenger === true}
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
                    disabled={adult?.isSavedPassenger === true}
                    onChange={(e) =>
                        handleAdultChange(index, "email", e.target.value)
                    }
                />
            </div>
        </div>

    );
};
