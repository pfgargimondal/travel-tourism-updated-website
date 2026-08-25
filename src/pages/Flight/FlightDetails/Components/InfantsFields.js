export const InfantsFields = ({infant, index, infantRule, handleInfantChange}) => {
    return (
        <div className="row g-3">

            {infantRule?.Title && (
                <div className="col-md-2">
                <label>Title</label>
                <select
                    className="form-select"
                    value={infant.title}
                    onChange={(e) =>
                    handleInfantChange(index, "title", e.target.value)
                    }
                >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                </select>
                </div>
            )}

            {infantRule?.First_Name && (
                <div className="col-md-5">
                <label>First Name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First & Middle Name"
                    value={infant.firstName}
                    onChange={(e) =>
                    handleInfantChange(index, "firstName", e.target.value)
                    }
                />
                </div>
            )}

            {infantRule?.Last_Name && (
                <div className="col-md-5">
                <label>Last Name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={infant.lastName}
                    onChange={(e) =>
                    handleInfantChange(index, "lastName", e.target.value)
                    }
                />
                </div>
            )}
            {infantRule?.DOB && (
                <div className="col-md-4">

                    <label>Date of Birth</label>

                    <input
                        type="date"
                        className="form-control"
                        value={infant.dob}
                        onChange={(e)=>
                            handleInfantChange(index,"dob",e.target.value)
                        }
                    />

                </div>
            )}

        </div>
    );
};