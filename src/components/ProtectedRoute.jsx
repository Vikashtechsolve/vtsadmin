import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * Protects routes by validating JWT token and admin role.
 * Redirects to external login if missing or invalid.
 */
const ProtectedRoute = ({ children }) => {
  try {
    const token = Cookies.get("token") || sessionStorage.getItem("token");

    // 🚫 No token → redirect to main login
    if (!token) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
      return null;
    }

    const decoded = jwtDecode(token);

    // 🚫 Invalid or non-admin user
    if (!decoded || decoded.role !== "admin") {
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
      return null;
    }

    // ⏳ Expired token
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
      return null;
    }

    // ✅ Valid token & admin role
    return children;
  } catch (err) {
    console.error("JWT validation failed:", err);
    Cookies.remove("token");
    sessionStorage.removeItem("token");
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://www.vikashtechsolution.com/login?redirect=${redirectUrl}`;
    return null;
  }
};

export default ProtectedRoute;
