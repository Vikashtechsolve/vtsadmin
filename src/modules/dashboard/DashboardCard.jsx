import React from "react";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-200">
      {/* Left content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{title}</p>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-1">
          {value}
        </h3>
      </div>

      {/* Right circle icon */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-100 rounded-full text-red-600 text-lg font-bold shrink-0">
        •
      </div>
    </div>
  );
};

export default DashboardCard;
