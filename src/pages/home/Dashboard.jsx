import React from "react";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ActivityList from "../../components/ActivityList";
import data from "../../data/dashboardData.json";

const Dashboard = () => {
  const { user, stats, activities } = data;

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-red-600">Dashboard</h1>
          <input
            type="text"
            className="border rounded-lg px-4 py-2 shadow-sm w-64"
            placeholder="Search here..."
          />
        </div>

        <div className="bg-red-600 text-white rounded-xl shadow-lg mt-6 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {user.name}</h2>
            <p>Here's a quick overview of today's activity!</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <DashboardCard title="Total Users" value={stats.totalUsers} />
          <DashboardCard title="Master Classes" value={stats.masterClasses} />
          <DashboardCard title="Mentor Sessions" value={stats.mentorSessions} />
          <DashboardCard title="Doubt Sessions" value={stats.doubtSessions} />
          <DashboardCard title="Online Contests" value={stats.onlineContests} />
          <DashboardCard title="Resume Review" value={stats.resumeReviews} />
        </div>

        <div className="mt-8">
          <ActivityList activities={activities} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
