import React from "react";

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-semibold text-red-600">Dashboard</h1>
      <input
        type="text"
        placeholder="Search here..."
        className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none w-64"
      />
    </header>
  );
};

export default DashboardHeader;
