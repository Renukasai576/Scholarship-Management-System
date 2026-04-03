import "./ScholarshipCard.css";

function ScholarshipCard({ data, isAdmin = false, onDelete, onEdit }) {
  return (
    <div className="sch-card">

      <h2 className="sch-title">
        {data.name || "Scholarship"}
      </h2>

      <p><b>🏢 Provider:</b> {data.provider}</p>
      <p><b>📍 State:</b> {data.state}</p>
      <p><b>💰 Income Limit:</b> ₹{data.incomeLimit}</p>
      <p><b>📊 Min Marks:</b> {data.minMarks}%</p>
      <p><b>⏳ Deadline:</b> {new Date(data.deadline).toDateString()}</p>

      {/* 🎓 STUDENT VIEW */}
      {!isAdmin && (
        <a
          href={data.link}
          target="_blank"
          rel="noreferrer"
          className="apply-link"
        >
          Apply Now
        </a>
      )}

      {/* 🔥 ADMIN ACTIONS */}
      {isAdmin && (
        <div className="admin-actions">
          <button
            className="edit-btn"
            onClick={() => onEdit(data._id)}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => onDelete(data._id)}
          >
            Delete
          </button>
        </div>
      )}

    </div>
  );
}

export default ScholarshipCard;