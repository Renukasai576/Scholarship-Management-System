import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          🚪
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/scholarships">Scholarships</Link>
        <Link to="/admin/add">Add Scholarship</Link>
        <Link to="/admin/students">Students</Link>
        <Link to="/admin/support-tickets">🎫 Support Tickets</Link>
      </nav>
    </div>
  );
}

export default AdminSidebar;