// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  try {
    // ✅ Check for admin token (preferred) or legacy token
    const token = sessionStorage.getItem("adminAccessToken") || sessionStorage.getItem("token");

    // 🚫 No token → redirect to login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    // ✅ Check if token is expired
    if (!decoded || decoded.exp < now) {
      // Try to refresh token if refresh token exists
      const refreshToken = sessionStorage.getItem("adminRefreshToken");
      if (refreshToken) {
        // Token expired, but we have refresh token - redirect to login to refresh
        // (In production, you might want to auto-refresh here)
        sessionStorage.removeItem("adminAccessToken");
        sessionStorage.removeItem("adminRefreshToken");
        sessionStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }
      sessionStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // ✅ Check if user is admin (supports both admin token types)
    const isAdmin = decoded.type === "admin" || decoded.role === "admin" || decoded.role === "super_admin";
    
    if (!isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (err) {
    console.error("❌ Invalid or expired token:", err);
    sessionStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("adminRefreshToken");
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;