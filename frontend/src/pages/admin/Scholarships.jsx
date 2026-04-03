import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import AdminSidebar from "../../components/AdminSidebar";
import ScholarshipCard from "../../components/ScholarshipCard";
import API from "../../services/api";

function Scholarships() {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 Fetch scholarships
  const fetchData = async () => {
    try {
      const token = await getToken();
      const res = await API.get("/admin/scholarships", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("API RESPONSE:", res.data);

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error fetching scholarships:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      const token = await getToken();
      await API.delete(`/scholarships/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Deleted successfully");
      fetchData();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // 🔥 Edit
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={container}>
        <h1>All Scholarships</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No scholarships found</p>
        ) : (
          <div style={grid}>
            {data.map((s) => (
              <ScholarshipCard
                key={s._id}
                data={s}
                isAdmin={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
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
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

export default Scholarships;