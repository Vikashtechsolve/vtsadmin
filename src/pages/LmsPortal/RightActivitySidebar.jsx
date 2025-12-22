import React from "react";
import user from "../../assets/user-profile.jpg";
import { UserRound } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: "20 new students registrations",
    time: "Today",
    icon: "👥",
    bg: "bg-blue-500",
  },
  {
    id: 2,
    title: "Newly added playlist",
    time: "1 hour ago",
    icon: "📃",
    bg: "bg-pink-400",
  },
  {
    id: 3,
    title: "New blog published: 04 Common Resume Mistakes",
    time: "2 hours ago",
    icon: "📰",
    bg: "bg-yellow-400",
  },
  {
    id: 4,
    title: "Instructor uploaded notes",
    time: "4 hours ago",
    icon: "📘",
    bg: "bg-purple-500",
  },
  {
    id: 5,
    title: "News article published",
    time: "5 hours ago",
    icon: "🗞️",
    bg: "bg-blue-600",
  },
];

const RightActivitySidebar = () => {
  return (
    <div className="w-full lg:w-[320px]  bg-white rounded-xl shadow-sm p-5">
      
      {/* Profile */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user}
          alt="Admin"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">Vikash Dubey</h3>
          <p className="flex items-center gap-1 text-sm font-semibold">
            <UserRound style={{ color: "#B11C20" }}/>Admin
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Recent Activities</h2>
        <span className="text-gray-400 cursor-pointer">⋯</span>
      </div>

      {/* Activity List */}
      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-[38px] top-0 bottom-0 w-[2px] bg-gray-200"></div>

        {activities.map((item) => (
          <div key={item.id} className="flex gap-4 mb-6 relative">
            {/* Icon */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${item.bg}`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div>
              <p className="text-sm text-gray-700">{item.title}</p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightActivitySidebar;
