import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardBanner from "./DashboardBanner";
import DashboardCard from "./DashboardCard";
import ActivityList from "./ActivityList";
import DashboardRightPanel from "./DashboardRightPanel";
import dashboardData from "./dashboardData.json";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setUser(dashboardData.user);
    setStats(dashboardData.stats);
    setActivities(dashboardData.activities);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Dashboard Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <DashboardHeader user={user} />
      </div>

      {/* Dashboard Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ========== LEFT SECTION ========== */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Welcome Banner */}
          <DashboardBanner user={user} />

          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            <DashboardCard title="Total Users" value={stats.totalUsers} />
            <DashboardCard title="Master Classes" value={stats.masterClasses} />
            <DashboardCard title="Mentor Sessions" value={stats.mentorSessions} />
            <DashboardCard title="Doubt Sessions" value={stats.doubtSessions} />
            <DashboardCard title="Online Contests" value={stats.onlineContests} />
            <DashboardCard title="Resume Review" value={stats.resumeReviews} />
          </div>

          {/* Recent Activity List */}
            <div className="mt-10 pl-2 sm:pl-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 ml-1 sm:ml-0">
                Recent Activities
            </h2>
            <div className="-ml-2 sm:-ml-1">
                <ActivityList activities={activities} />
            </div>
            </div>

        </section>

        {/* ========== RIGHT PANEL (Hides on Mobile) ========== */}
        <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 sm:p-6 shadow-inner overflow-y-auto">
          <DashboardRightPanel user={user} activities={activities} />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
