import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * ✅ Protects all pages. Redirects to /login if:
 * - No token found
 * - Token invalid
 * - Role !== 'admin'
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  try {
    // Check token in cookies or session
    const token =
      Cookies.get("token") || sessionStorage.getItem("token");

    if (!token) {
      // 🚫 No token — force login
      return (
        <Navigate
          to={`/login?message=${encodeURIComponent("Please login to continue.")}`}
          state={{ from: location }}
          replace
        />
      );
    }

    // Decode token
    const decoded = jwtDecode(token);

    if (!decoded || decoded.role !== "admin") {
      // 🚫 Not admin or invalid token
      Cookies.remove("token");
      sessionStorage.removeItem("token");

      return (
        <Navigate
          to={`/login?message=${encodeURIComponent(
            "Access denied. Admin privileges required."
          )}`}
          replace
        />
      );
    }

    // ✅ Valid admin token → grant access
    return children;
  } catch (err) {
    console.error("JWT validation failed:", err);
    Cookies.remove("token");
    sessionStorage.removeItem("token");

    return (
      <Navigate
        to={`/login?message=${encodeURIComponent("Session expired. Please login again.")}`}
        replace
      />
    );
  }
};

export default ProtectedRoute;
