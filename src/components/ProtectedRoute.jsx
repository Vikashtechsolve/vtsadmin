import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  try {
    const token = sessionStorage.getItem("token");

    // 🔒 No token? go back to login
    if (!token)
      return (
        <Navigate
          to="https://www.vikashtechsolution.com/login"
          replace
        />
      );

    const decoded = jwtDecode(token);

    // 🚫 Not admin or expired
    const now = Date.now() / 1000;
    if (decoded.role !== "admin" || decoded.exp < now) {
      sessionStorage.removeItem("token");
      return (
        <Navigate
          to="https://www.vikashtechsolution.com/login"
          replace
        />
      );
    }

    return children;
  } catch (err) {
    console.error("❌ Invalid or expired token:", err);
    sessionStorage.removeItem("token");
    return (
      <Navigate
        to="https://www.vikashtechsolution.com/login"
        replace
      />
    );
  }
};

export default ProtectedRoute;
