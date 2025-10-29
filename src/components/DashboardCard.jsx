import React from "react";

const DashboardCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
    <p className="text-gray-600 font-medium">{title}</p>
    <p className="text-2xl font-bold text-red-600 mt-2">{value}</p>
  </div>
);

export default DashboardCard;
