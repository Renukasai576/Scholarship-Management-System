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

        setStats(statsRes.data || {});
        setEligibility(
          Array.isArray(eligibilityRes.data) ? eligibilityRes.data : []
        );
        setPendingScholarships(
          Array.isArray(pendingRes.data) ? pendingRes.data : []
        );

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

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={container}>
        <h1>Dashboard</h1>

        {/* 🔥 STATS */}
        <div style={cardContainer}>
          <div style={card}>
            <h3>Total Students</h3>
            <p>{stats?.totalStudents || 0}</p>
          </div>

          <div style={card}>
            <h3>Total Scholarships</h3>
            <p>{stats?.totalScholarships || 0}</p>
          </div>
        </div>

        {/* 🔥 ELIGIBILITY */}
        <h2 style={{ marginTop: "30px" }}>Eligibility Stats</h2>

        {eligibility.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div style={grid}>
            {eligibility.map((e, i) => (
              <div key={i} style={card}>
                <h3>{e?.scholarshipName || "Unknown"}</h3>
                <p style={{ fontWeight: "bold" }}>
                  {e?.eligibleStudents || 0} Students Eligible
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 PENDING SCHOLARSHIPS */}
        <h2 style={{ marginTop: "30px" }}>Pending Scholarship Approvals</h2>

        {pendingScholarships.length === 0 ? (
          <p>No pending scholarships</p>
        ) : (
          <div style={grid}>
            {pendingScholarships.map((scholarship) => (
              <div key={scholarship._id} style={card}>
                <h3>{scholarship.name}</h3>
                <p><strong>Provider:</strong> {scholarship.provider}</p>
                <p><strong>State:</strong> {scholarship.state}</p>
                <p><strong>Income Limit:</strong> ₹{scholarship.incomeLimit}</p>
                <p><strong>Min Marks:</strong> {scholarship.minMarks}%</p>
                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleApproval(scholarship._id, "approve")}
                    style={approveBtn}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(scholarship._id, "reject")}
                    style={rejectBtn}
                  >
                    Reject
                  </button>
                </div>
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