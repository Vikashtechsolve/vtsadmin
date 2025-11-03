import React from "react";
import welcomeImg from "../../assets/welcome.png";

const DashboardBanner = ({ user }) => {
  return (
    <div className="w-full md:w-1/2 bg-red-700 text-white rounded-xl shadow-lg mt-6 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
      {/* Left Side - Text */}
      <div className="text-center sm:text-left flex-1">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1">
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-100">
          Here's a quick overview of today's activity!
        </p>
      </div>

      {/* Right Side - Image */}
       {/* Right Side - Image */}
      <div className="flex justify-center sm:justify-end flex-shrink-0">
        <img
          src={welcomeImg}
          alt="Welcome Illustration"
          className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
        />
      </div>
    </div>
  );
};

export default DashboardBanner;
