// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  try {
    const token = sessionStorage.getItem("token");

    // 🚫 No token → redirect to main login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (!decoded || decoded.exp < now) {
      sessionStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // ✅ If user is admin, allow access
    if (decoded.role !== "admin") {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (err) {
    console.error("❌ Invalid or expired token:", err);
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;