import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api";
import "./Partner.css";

function Partner() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    name: "",
    provider: "",
    link: "",
    state: "",
    incomeLimit: "",
    minMarks: "",
    deadline: "",
    gender: "",
    caste: [],
    educationLevel: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e, field) => {
    const value = e.target.value;
    setForm((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || !form.provider || !form.link || !form.state || !form.incomeLimit || !form.minMarks || !form.deadline || form.caste.length === 0 || form.educationLevel.length === 0) {
      alert("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        incomeLimit: Number(form.incomeLimit),
        minMarks: Number(form.minMarks)
      };

      console.log("Submitting partner proposal to /scholarships/submit:", payload);
      const token = await getToken();
      await API.post("/scholarships/submit", payload, { headers: { Authorization: `Bearer ${token}` } });

      alert("Proposal submitted successfully — admin will review shortly.");
      setForm({ name: "", provider: "", link: "", state: "", incomeLimit: "", minMarks: "", deadline: "", gender: "", caste: [], educationLevel: [] });
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-container">
      <div className="form-card">
        <h1>Partner with Us 🤝</h1>
        <p className="subtitle">Submit scholarship opportunities and help students achieve their dreams.</p>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h2>📌 Scholarship Info</h2>
            <div className="grid-2">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Scholarship Name" required />
              <input type="text" name="provider" value={form.provider} onChange={handleChange} placeholder="Provider / Organization" required />
            </div>
            <input type="url" name="link" value={form.link} onChange={handleChange} placeholder="Application Link" required />
          </div>

          <div className="form-section">
            <h2>🎯 Eligibility Criteria</h2>
            <div className="grid-2">
              <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" required />
              <input type="number" name="incomeLimit" value={form.incomeLimit} onChange={handleChange} placeholder="Income Limit (₹)" required />
            </div>
            <div className="grid-3">
              <input type="number" name="minMarks" value={form.minMarks} onChange={handleChange} placeholder="Min Marks (%)" required />
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>📚 Categories</h2>
            <div className="checkbox-group">
              <p>Caste</p>
              {['General', 'OBC', 'SC', 'ST'].map((caste) => (
                <label key={caste}>
                  <input type="checkbox" value={caste} checked={form.caste.includes(caste)} onChange={(e) => handleCheckbox(e, 'caste')} />
                  {caste}
                </label>
              ))}
            </div>

            <div className="checkbox-group">
              <p>Education Level</p>
              {['10th', '12th', 'Undergraduate', 'Postgraduate'].map((level) => (
                <label key={level}>
                  <input type="checkbox" value={level} checked={form.educationLevel.includes(level)} onChange={(e) => handleCheckbox(e, 'educationLevel')} />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : '🚀 Submit Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Partner;
