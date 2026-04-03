import { SignIn, SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import "./App.css";

// 🎓 Student Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Scholarships from "./pages/Scholarship";
import StudentServices from "./pages/StudentServices";
import CareerGuidance from "./pages/CareerGuidance";
import Results from "./pages/Results";
import Partner from "./pages/Partner";
import SelectRole from "./pages/SelectRole";

// 🔥 Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AddScholarship from "./pages/admin/AddScholarship";
import Students from "./pages/admin/Students";
import AdminScholarships from "./pages/admin/Scholarships";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";

import API from "./services/api";


// 🔐 ADMIN ROUTE
function AdminRoute({ children }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (!user) return;

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

    checkAdmin();
  }, [user]);

  if (isAdmin === null) return <p>Loading...</p>;

  return isAdmin ? children : <Navigate to="/" />;
}


// 🎯 ROLE CHECK
function RoleCheck({ children }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkRole = async () => {
      try {
        const token = await getToken();

        const res = await API.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasRole(!!res.data?.role);

      } catch (err) {
        console.log("Role error:", err);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return hasRole ? children : <Navigate to="/select-role" />;
}


// 🎓 STUDENT ROUTE
function StudentRoute({ children }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (!user) return;

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

    checkAdmin();
  }, [user]);

  if (isAdmin === null) return <p>Loading...</p>;

  return isAdmin ? <Navigate to="/admin/dashboard" /> : children;
}


function App() {
  return (
    <BrowserRouter>

      {/* NOT LOGGED IN */}
      <SignedOut>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>

      {/* LOGGED IN */}
      <SignedIn>
        <Navbar />

        <Routes>

          {/* ROLE SELECTION */}
          <Route path="/select-role" element={<SelectRole />} />

          {/* STUDENT ROUTES */}
          <Route path="/" element={<RoleCheck><StudentRoute><Home /></StudentRoute></RoleCheck>} />
          <Route path="/dashboard" element={<RoleCheck><StudentRoute><Dashboard /></StudentRoute></RoleCheck>} />
          <Route path="/profile" element={<RoleCheck><StudentRoute><Profile /></StudentRoute></RoleCheck>} />
          <Route path="/scholarships" element={<RoleCheck><StudentRoute><Scholarships /></StudentRoute></RoleCheck>} />
          <Route path="/services" element={<RoleCheck><StudentRoute><StudentServices /></StudentRoute></RoleCheck>} />
          <Route path="/guidance" element={<RoleCheck><StudentRoute><CareerGuidance /></StudentRoute></RoleCheck>} />
          <Route path="/results" element={<RoleCheck><StudentRoute><Results /></StudentRoute></RoleCheck>} />
          <Route path="/partner" element={<RoleCheck><StudentRoute><Partner /></StudentRoute></RoleCheck>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/scholarships" element={<AdminRoute><AdminScholarships /></AdminRoute>} />
          <Route path="/admin/add" element={<AdminRoute><AddScholarship /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><Students /></AdminRoute>} />
          <Route path="/admin/support-tickets" element={<AdminRoute><AdminSupportTickets /></AdminRoute>} />

          {/* Redirect */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

          {/* 404 */}
          <Route path="*" element={<h1 style={{ padding: "40px" }}>Page Not Found</h1>} />

        </Routes>
      </SignedIn>

    </BrowserRouter>
  );
}

export default App;