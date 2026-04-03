import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const { isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  // Hide navbar for admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // ✅ FETCH ROLE (WITH TOKEN)
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getToken(); // ✅ get token

        const res = await API.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        });

        console.log("ROLE:", res.data);

        setRole(res.data?.role);

      } catch (err) {
        console.log("Role fetch error:", err);
      }
    };

    const checkAdmin = async () => {
      try {
        const token = await getToken();

        await API.get("/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      }
    };

    if (isSignedIn) {
      fetchRole();
      checkAdmin();
    }
  }, [isSignedIn]);

  // ✅ prevent wrong UI before role loads
  if (isSignedIn && (role === null || isAdmin === null)) return null;

  return (
    <nav className="navbar">

      {/* LEFT - LOGO */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
        <span className="brand">Scholoholic</span>
      </div>

      {/* CENTER */}
      <div className="nav-center">

        {/* 🎓 STUDENT or ADMIN */}
        {(role === "student" || isAdmin) && (
          <>
            <Link to="/scholarships">Scholarships</Link>
            <Link to="/services">Student Services</Link>
            <Link to="/guidance">Career Guidance</Link>
            <Link to="/results">Results</Link>
          </>
        )}

        {/* 🏢 PARTNER */}
        {role === "partner" && (
          <>
            <Link to="/results">Results</Link>
            <Link to="/partner">Become a Partner</Link>
          </>
        )}

      </div>

      {/* RIGHT */}
      <div className="nav-right">

        {!isSignedIn ? (
          <>
            <button
              className="btn-outline"
              onClick={() => navigate("/sign-in")}
            >
              Register
            </button>

            <button
              className="btn-solid"
              onClick={() => navigate("/sign-in")}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <button
              className="profile-btn-main"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;