export const InfantsFieldsReviewBooking = ({infant, index, infantRule, handleInfantChange}) => {
    return (
        <div className="row g-3">

            {infant?.isSavedPassenger && infant?.title && (
                <div className="col-md-2">
                <label>Title</label>
                <select
                    className="form-select"
                    value={infant.title}
                    disabled={infant?.isSavedPassenger === true}
                    onChange={(e) =>
                    handleInfantChange(index, "title", e.target.value)
                    }
                >
                    <option value="MSTR">MSTR</option>
                    <option value="MISS">Miss</option>
                </select>
                </div>
            )}

            {infant?.isSavedPassenger && infant?.firstName && (
                <div className="col-md-5">
                <label>First Name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First & Middle Name"
                    value={infant.firstName}
                    disabled={infant?.isSavedPassenger === true}
                    onChange={(e) =>
                    handleInfantChange(index, "firstName", e.target.value)
                    }
                />
                </div>
            )}

            {infant?.isSavedPassenger && infant?.lastName && (
                <div className="col-md-5">
                <label>Last Name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={infant.lastName}
                    disabled={infant?.isSavedPassenger === true}
                    onChange={(e) =>
                    handleInfantChange(index, "lastName", e.target.value)
                    }
                />
                </div>
            )}
            {infant?.isSavedPassenger && infant?.dob && (
                <div className="col-md-4">

                    <label>Date of Birth</label>

                    <input
                        type="date"
                        className="form-control"
                        value={infant.dob}
                        disabled={infant?.isSavedPassenger === true}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 2))
                            .toISOString()
                            .split("T")[0]}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e)=>
                            handleInfantChange(index,"dob",e.target.value)
                        }
                    />

                </div>
            )}

        </div>
    );
};