import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";
import "./AddScholarship.css";

function AddScholarship() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    name: "",
    provider: "",
    caste: [],
    incomeLimit: "",
    gender: "",
    state: "",
    educationLevel: [],
    minMarks: "",
    deadline: "",
    link: ""
  });

  // 🔥 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  // 🔥 handle checkbox
  const handleCheckbox = (e, field) => {
    const value = e.target.value;

    if (form[field].includes(value)) {
      setForm({
        ...form,
        [field]: form[field].filter((v) => v !== value)
      });
    } else {
      setForm({
        ...form,
        [field]: [...form[field], value]
      });
    }
  };

  // 🔥 submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ validate required fields
  if (
    !form.name ||
    !form.provider ||
    !form.state ||
    !form.link ||
    !form.incomeLimit ||
    !form.minMarks ||
    form.caste.length === 0 ||
    form.educationLevel.length === 0
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    // 🔥 SAFE conversion
    const payload = {
      ...form,
      incomeLimit: parseInt(form.incomeLimit),
      minMarks: parseInt(form.minMarks),
      deadline: form.deadline ? new Date(form.deadline) : null
    };

    // ❌ prevent NaN
    if (isNaN(payload.incomeLimit) || isNaN(payload.minMarks)) {
      alert("Income and Marks must be valid numbers");
      return;
    }

    console.log("FINAL PAYLOAD:", payload);

    const token = await getToken();
    await API.post("/scholarships", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Scholarship Added Successfully ✅");

    // reset
    setForm({
      name: "",
      provider: "",
      caste: [],
      incomeLimit: "",
      gender: "",
      state: "",
      educationLevel: [],
      minMarks: "",
      deadline: "",
      link: ""
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    alert("Failed to add scholarship ❌");
  }
};

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Add Scholarship</h1>

          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label htmlFor="name">Scholarship Name *</label>
              <input
                id="name"
                name="name"
                placeholder="e.g., TCS Talent Scholarship"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="provider">Provider/Organization *</label>
              <input
                id="provider"
                name="provider"
                placeholder="e.g., TCS"
                value={form.provider}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Caste Categories *</label>
              <div className="checkbox-group">
                <label><input type="checkbox" value="SC" onChange={(e) => handleCheckbox(e, "caste")} /> SC</label>
                <label><input type="checkbox" value="ST" onChange={(e) => handleCheckbox(e, "caste")} /> ST</label>
                <label><input type="checkbox" value="OBC" onChange={(e) => handleCheckbox(e, "caste")} /> OBC</label>
                <label><input type="checkbox" value="General" onChange={(e) => handleCheckbox(e, "caste")} /> General</label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="incomeLimit">Income Limit (₹) *</label>
              <input
                id="incomeLimit"
                name="incomeLimit"
                placeholder="e.g., 500000"
                value={form.incomeLimit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="gender">Gender *</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="state">State *</label>
              <input
                id="state"
                name="state"
                placeholder="e.g., Goa"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Education Level *</label>
              <div className="checkbox-group">
                <label><input type="checkbox" value="10th" onChange={(e) => handleCheckbox(e, "educationLevel")} /> 10th</label>
                <label><input type="checkbox" value="12th" onChange={(e) => handleCheckbox(e, "educationLevel")} /> 12th</label>
                <label><input type="checkbox" value="Undergraduate" onChange={(e) => handleCheckbox(e, "educationLevel")} /> UG</label>
                <label><input type="checkbox" value="Postgraduate" onChange={(e) => handleCheckbox(e, "educationLevel")} /> PG</label>
              </div>
            </div>

            <input
              name="minMarks"
              placeholder="Minimum Marks"
              value={form.minMarks}
              onChange={handleChange}
            />

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <input
              name="link"
              placeholder="Application Link"
              value={form.link}
              onChange={handleChange}
            />

            <button className="submit-btn">Add Scholarship</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddScholarship;