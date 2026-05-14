import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // ✅ ADD
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";

function AdminDashboard() {
  const { getToken, isLoaded, isSignedIn } = useAuth(); // ✅ ADD

  const [stats, setStats] = useState({});
  const [eligibility, setEligibility] = useState([]);
  const [pendingScholarships, setPendingScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ⛔ wait until Clerk is ready
    if (!isLoaded || !isSignedIn) return;

    const fetchData = async () => {
      try {
        const token = await getToken(); // ✅ get token

        const statsRes = await API.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        });

        const eligibilityRes = await API.get("/admin/eligibility", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        });

        const pendingRes = await API.get("/scholarships/admin/pending", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("STATS:", statsRes.data);
        console.log("ELIGIBILITY:", eligibilityRes.data);
        console.log("PENDING:", pendingRes.data);

        // Ensure data is in correct format
        const safeStats = (typeof statsRes.data === 'object' && statsRes.data !== null) ? statsRes.data : {};
        const safeEligibility = Array.isArray(eligibilityRes.data) ? eligibilityRes.data : [];
        const safePendingScholarships = Array.isArray(pendingRes.data) ? pendingRes.data : [];

        setStats(safeStats || {});
        setEligibility(safeEligibility);
        setPendingScholarships(safePendingScholarships);

      } catch (err) {
        console.log("Dashboard Error:", err);
        setStats({});
        setEligibility([]);
        setPendingScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [isLoaded, isSignedIn]);

  const handleApproval = async (id, action) => {
    try {
      const token = await getToken();
      await API.put(`/scholarships/admin/approve/${id}`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Scholarship ${action}d successfully!`);
      // Refresh the data
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(`Error ${action}ing scholarship`);
    }
  };

  if (!isLoaded || loading) {
    return <p>Loading...</p>;
  }

  // TEMPORARY TEST - if error disappears, problem is in dashboard JSX
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={container}>
        <h1>Admin Dashboard Working ✅</h1>
        <p>Stats: {JSON.stringify(stats)}</p>
        <p>Eligibility count: {eligibility.length}</p>
        <p>Pending count: {pendingScholarships.length}</p>
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

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "15px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const approveBtn = {
  background: "#27ae60",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
};

const rejectBtn = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
};

export default AdminDashboard;