import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * Protects routes by validating JWT token and role.
 * If invalid/missing, redirects to external login page.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  try {
    // Get token from cookies or session
    const token =
      Cookies.get("token") || sessionStorage.getItem("token");

    if (!token) {
      // 🚫 No token — redirect to external login
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
      return null;
    }

    // Decode token
    const decoded = jwtDecode(token);

    if (!decoded || decoded.role !== "admin") {
      // 🚫 Not admin — clear token and redirect
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
      return null;
    }

    // ✅ Token valid and admin
    return children;
  } catch (error) {
    console.error("JWT validation failed:", error);
    Cookies.remove("token");
    sessionStorage.removeItem("token");
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
    return null;
  }
};

export default ProtectedRoute;
