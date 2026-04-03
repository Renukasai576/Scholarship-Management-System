import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // ✅ ADD
import API from "../services/api";
import "./SelectRole.css";

function SelectRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth(); // ✅ ADD
  const navigate = useNavigate();

  const handleRole = async (role) => {
    try {
      console.log("Clicked role:", role);

      setLoading(true);
      setError("");

      const token = await getToken(); // ✅ FIX

      const res = await API.post(
        "/users/role",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        }
      );

      console.log("Response:", res.data);

      // ✅ redirect
      if (role === "partner") {
        navigate("/partner");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.log("Error:", err);
      setError(err.response?.data?.message || "Error setting role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-container">
      <div className="role-card">
        <h1>Select Your Role</h1>

        <button onClick={() => handleRole("student")} disabled={loading}>
          🎓 Student
        </button>

        <button onClick={() => handleRole("partner")} disabled={loading}>
          🏢 Partner
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default SelectRole;