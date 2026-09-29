export const ChildFieldsReviewBooking = ({ child, index, childRule, handleChildChange }) => {


  return (
    <div className="row g-3">
      {child?.isSavedPassenger && child?.title && (
        <div className="col-md-2">
          <label>Title</label>
          <select
            className="form-select"
            value={child.title}
            disabled={child?.isSavedPassenger === true}
            onChange={(e) => handleChildChange(index, "title", e.target.value)}
          >
            <option value="MSTR">MSTR</option>
            <option value="MISS">Miss</option>
          </select>
        </div>
      )}

      {child?.isSavedPassenger && child?.firstName && (
        <div className="col-md-5">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First & Middle Name"
            value={child.firstName}
            disabled={child?.isSavedPassenger === true}
            onChange={(e) =>
              handleChildChange(index, "firstName", e.target.value)
            }
          />
        </div>
      )}

      {child?.isSavedPassenger && child?.lastName && (
        <div className="col-md-5">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            value={child.lastName}
            disabled={child?.isSavedPassenger === true}
            onChange={(e) =>
              handleChildChange(index, "lastName", e.target.value)
            }
          />
        </div>
      )}
      {child?.isSavedPassenger && child?.dob && (
        <div className="col-md-4">
          <label>Date of Birth</label>

          <input
            type="date"
            className="form-control"
            value={child.dob}
            disabled={child?.isSavedPassenger === true}
            onChange={(e) => handleChildChange(index, "dob", e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
