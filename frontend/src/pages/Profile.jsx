import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import API from "../services/api";
import "./profile.css";

function Profile() {

  const { userId, getToken } = useAuth();
  const { user } = useUser(); // 🔥 get email
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    caste: "",
    income: "",
    gender: "",
    state: "",
    educationLevel: "",
    marks: "",
    role: "student"
  });

  const [existingProfile, setExistingProfile] = useState(null);

  // 🔥 FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        const res = await API.get("/students/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExistingProfile(res.data);
      } catch (err) {
        setExistingProfile(null);
      }
    };

    fetchProfile();
  }, [getToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      await API.post("/students", {
        ...form,
        clerkId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile saved");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  // ✅ IF PROFILE EXISTS → SHOW DATA + EMAIL + LOGOUT
  if (existingProfile) {
    return (
      <div className="profile-container">
        <div className="profile-view">

          <h2>Your Profile</h2>

          {/* 🔥 EMAIL FROM CLERK */}
          <p><b>Email:</b> {user?.primaryEmailAddress?.emailAddress}</p>

          <p><b>Name:</b> {existingProfile.name}</p>
          <p><b>Caste:</b> {existingProfile.caste}</p>
          <p><b>Income:</b> {existingProfile.income}</p>
          <p><b>Gender:</b> {existingProfile.gender}</p>
          <p><b>State:</b> {existingProfile.state}</p>
          <p><b>Education:</b> {existingProfile.educationLevel}</p>
          <p><b>Marks:</b> {existingProfile.marks}</p>

          {/* 🔥 LOGOUT BUTTON */}
          <SignOutButton>
            <button className="logout-btn">Logout</button>
          </SignOutButton>

        </div>
      </div>
    );
  }

  // ❌ IF NOT EXISTS → SHOW FORM
  return (
    <div className="profile-container">

      <form className="profile-form" onSubmit={saveProfile}>

        <h2>Complete Your Profile</h2>

        <input name="name" placeholder="Name" onChange={handleChange} required />

        <label>Caste:</label>
        <select name="caste" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="General">General</option>
        </select>

        <input name="income" placeholder="Family Income" onChange={handleChange} required />

        <label>Gender:</label>
        <select name="gender" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>State:</label>
        <select name="state" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>

        <label>Education Level:</label>
        <select name="educationLevel" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Postgraduate">Postgraduate</option>
        </select>

        <input name="marks" placeholder="Marks (%)" onChange={handleChange} required />

        <button type="submit">Save Profile</button>

      </form>

    </div>
  );
}

export default Profile;