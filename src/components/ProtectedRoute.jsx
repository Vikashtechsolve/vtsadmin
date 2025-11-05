import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

/**
 * ProtectedRoute
 * Wraps around pages that require admin JWT auth.
 */
const ProtectedRoute = ({ children }) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || localStorage.getItem("token");

    // 🔒 No token → go to login
    if (!token) return <Navigate to="https://www.vikashtechsolution.com/login" replace />;

    const decoded = jwtDecode(token);

    // 🚫 Not admin → clear and go to login
    if (decoded.role !== "admin") {
      localStorage.removeItem("token");
      return <Navigate to="https://www.vikashtechsolution.com/login" replace />;
    }

    // ✅ Store token for later API calls
    localStorage.setItem("token", token);
    return children;
  } catch (err) {
    console.error("Invalid or expired token:", err);
    localStorage.removeItem("token");
    return <Navigate to="https://www.vikashtechsolution.com/login" replace />;
  }
};

export default ProtectedRoute;
