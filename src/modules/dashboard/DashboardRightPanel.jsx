import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import userProfilePic from "../../assets/user-profile.jpg";
import ActivityList from "./ActivityList";

const DashboardRightPanel = ({ user, activities }) => {
  return (
    <aside
      className="w-full lg:w-96 bg-white px-5 py-6 overflow-y-auto lg:overflow-visible
                 lg:sticky lg:top-0 lg:h-screen"
    >
      {/* Profile Info */}
      <div className="flex items-center mb-6">
        <img
          src={userProfilePic}
          alt="User Avatar"
          className="w-14 h-14 rounded-full shadow-md object-cover"
        />
        <div className="ml-4">
          <h3 className="font-semibold text-lg text-gray-800">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-50 rounded-xl shadow p-4 mb-6">
        <Calendar className="!w-full !max-w-none" />
      </div>

      {/* Activities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Recent Activities
        </h2>
        <ActivityList activities={activities} compact />
      </div>
    </aside>
  );
};

export default DashboardRightPanel;
