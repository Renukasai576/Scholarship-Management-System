import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";

function Students() {
  const { getToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = await getToken();
      const res = await API.get("/admin/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Students:", res.data);

      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error fetching students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={container}>
        <h1>All Students</h1>

        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No students found</p>
        ) : (
          <div style={grid}>
            {students.map((s) => (
              <div key={s._id} style={card}>
                <h3>{s.name}</h3>

                <p><b>Caste:</b> {s.caste}</p>
                <p><b>Gender:</b> {s.gender}</p>
                <p><b>State:</b> {s.state}</p>
                <p><b>Income:</b> ₹{s.income}</p>
                <p><b>Marks:</b> {s.marks}%</p>
                <p><b>Education:</b> {s.educationLevel}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  marginLeft: "240px",
  padding: "30px",
  width: "100%",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

export default Students;