import { useMemo, useState } from "react";
import "./ScholarshipCard.css";

function ScholarshipCard({ data, isAdmin = false, onDelete, onEdit }) {
  const [docsOpen, setDocsOpen] = useState(true);

  const documents = useMemo(() => {
    if (data.documents && data.documents.length) {
      return data.documents;
    }

    const list = [
      "Aadhaar Card",
      "Passport Size Photo",
      "Bank Passbook / Account Details",
      "Mobile Number (linked with Aadhaar)",
      "Previous Marks Memo / Report Card",
      "Bonafide Certificate (from school/college)",
      "Admission Proof / Fee Receipt"
    ];

    if (data.incomeLimit) {
      list.push("Income Certificate");
    }

    if (data.casteRequired) {
      list.push("Caste Certificate (SC/ST/OBC if applicable)");
    }

    if (data.ewsRequired) {
      list.push("EWS Certificate (if applicable)");
    }

    list.push("Residence / Domicile Certificate");

    if (data.disabilityRequired) {
      list.push("Disability Certificate (if applicable)");
    }

    return list;
  }, [data]);

  const daysLeft = useMemo(() => {
    const deadline = new Date(data.deadline);
    const diff = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  }, [data.deadline]);

  const matchScore = useMemo(() => {
    let score = 68;
    if (data.minMarks) score += Math.min(20, Math.max(0, (data.minMarks - 55) * 0.5));
    if (data.incomeLimit && data.incomeLimit <= 500000) score += 10;
    if (data.incomeLimit && data.incomeLimit > 500000) score += 6;
    if (data.state) score += 3;
    return Math.min(96, Math.round(score));
  }, [data.minMarks, data.incomeLimit, data.state]);

  return (
    <div className="sch-card">
      <div className="sch-card-top">
        <div>
          <h2 className="sch-title">{data.name || "Scholarship"}</h2>
          <div className="sch-badges">
            <span className="badge">{data.provider || "Provider"}</span>
            <span className="badge secondary">{data.state || "Location"}</span>
          </div>
        </div>

        <div className="sch-score">
          <span>Funding fit</span>
          <strong>{matchScore}%</strong>
        </div>
      </div>

      <div className="sch-meta">
        <div className="meta-pill">
          <span>Deadline</span>
          <strong>{daysLeft} days</strong>
        </div>
        <div className="meta-pill">
          <span>Min marks</span>
          <strong>{data.minMarks}%</strong>
        </div>
        <div className="meta-pill">
          <span>Income</span>
          <strong>₹{data.incomeLimit || "N/A"}</strong>
        </div>
      </div>

      <div className="sch-details">
        <p><b>🏢 Provider:</b> {data.provider}</p>
        <p><b>📍 State:</b> {data.state}</p>
      </div>

      <div className="doc-section">
        <button
          className="doc-toggle"
          onClick={() => setDocsOpen((prev) => !prev)}
          type="button"
        >
          <span>📄 Documents Required</span>
          <span>{docsOpen ? "Hide" : "View"}</span>
        </button>

        {docsOpen && (
          <ul className="doc-list">
            {documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        )}
      </div>

      {!isAdmin && (
        <div className="sch-footer">
          <a
            href={data.link}
            target="_blank"
            rel="noreferrer"
            className="apply-link"
          >
            Apply Now
          </a>
        </div>
      )}

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