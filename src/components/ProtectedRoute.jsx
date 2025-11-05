// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token =
    Cookies.get("token") || sessionStorage.getItem("token") || null;

  if (!token) {
    return (
      <Navigate
        to={`/login?message=${encodeURIComponent(
          "Please login first to access the dashboard."
        )}`}
        state={{ from: location }}
        replace
      />
    );
  }

  try {
    const decoded = jwtDecode(token);

    // Ensure only admins can access
    if (decoded.role !== "admin") {
      return (
        <Navigate
          to={`/unauthorized?message=${encodeURIComponent(
            "Access denied. Admin privileges required."
          )}`}
          replace
        />
      );
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    // If decode fails, clear token and redirect to login
    Cookies.remove("token");
    sessionStorage.removeItem("token");

    return (
      <Navigate
        to={`/login?message=${encodeURIComponent(
          "Invalid or expired session. Please login again."
        )}`}
        replace
      />
    );
  }
};

export default ProtectedRoute;
