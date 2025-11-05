import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
>>>>>>> 51811db (removed error)

import DashboardHeader from "./DashboardHeader";
import DashboardBanner from "./DashboardBanner";
import DashboardCard from "./DashboardCard";
import ActivityList from "./ActivityList";
import DashboardRightPanel from "./DashboardRightPanel";
import dashboardData from "./dashboardData.json";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    // 🔐 Store token if it comes from URL (e.g., login redirect)
    if (tokenFromUrl) {
      try {
<<<<<<< HEAD
        const decoded = jwtDecode(tokenFromUrl);
        if (decoded.role === "admin") {
          sessionStorage.setItem("token", tokenFromUrl);
          Cookies.set("token", tokenFromUrl, { secure: true, sameSite: "strict" });
        }
        // Clean URL (remove ?token=)
=======
        const decoded = jwtDecode(tokenFromUrl); // ✅ simpler

        if (decoded.role === "admin") {
          sessionStorage.setItem("token", tokenFromUrl);
          Cookies.set("token", tokenFromUrl, {
            secure: true,
            sameSite: "strict",
          });
        }

        // clean URL
>>>>>>> 51811db (removed error)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (err) {
        console.error("Invalid token in URL:", err);
      }
    }

<<<<<<< HEAD
    // ✅ Check for existing token in cookies or session
    const token = Cookies.get("token") || sessionStorage.getItem("token");

    if (!token) {
      navigate(
        `/login?message=${encodeURIComponent("Please login to access the dashboard.")}`,
        { replace: true }
      );
=======
    const token = Cookies.get("token") || sessionStorage.getItem("token");
    if (!token) {
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${encodeURIComponent(
        window.location.href
      )}`;
>>>>>>> 51811db (removed error)
      return;
    }

    try {
      const decoded = jwtDecode(token);
<<<<<<< HEAD
      if (decoded.role !== "admin") {
        navigate(
          `/login?message=${encodeURIComponent("Access denied. Admin privileges required.")}`,
          { replace: true }
        );
        return;
      }

      // Mock loading dashboard data
=======

      // expiry check
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        Cookies.remove("token");
        sessionStorage.removeItem("token");
        window.location.href = `https://www.vikashtechsolution.com/login?redirect=${encodeURIComponent(
          window.location.href
        )}`;
        return;
      }

      if (decoded.role !== "admin") {
        Cookies.remove("token");
        sessionStorage.removeItem("token");
        window.location.href = `https://www.vikashtechsolution.com/login?redirect=${encodeURIComponent(
          window.location.href
        )}`;
        return;
      }

>>>>>>> 51811db (removed error)
      setUser(dashboardData.user);
      setStats(dashboardData.stats);
      setActivities(dashboardData.activities);
      setLoading(false);
<<<<<<< HEAD
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      navigate(
        `/login?message=${encodeURIComponent("Session expired. Please login again.")}`,
        { replace: true }
      );
    }
  }, [navigate]);
=======
    } catch (err) {
      console.error("JWT validation error:", err);
      Cookies.remove("token");
      sessionStorage.removeItem("token");
      window.location.href = `https://www.vikashtechsolution.com/login?redirect=${encodeURIComponent(
        window.location.href
      )}`;
    }
  }, []);
>>>>>>> 51811db (removed error)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <DashboardHeader user={user} />
      </div>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <section className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DashboardBanner user={user} />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            <DashboardCard title="Total Users" value={stats.totalUsers} />
            <DashboardCard title="Master Classes" value={stats.masterClasses} />
            <DashboardCard title="Mentor Sessions" value={stats.mentorSessions} />
            <DashboardCard title="Doubt Sessions" value={stats.doubtSessions} />
            <DashboardCard title="Online Contests" value={stats.onlineContests} />
            <DashboardCard title="Resume Review" value={stats.resumeReviews} />
          </div>

          <div className="mt-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
              Recent Activities
            </h2>
            <ActivityList activities={activities} />
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 sm:p-6 shadow-inner overflow-y-auto">
          <DashboardRightPanel user={user} activities={activities} />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
