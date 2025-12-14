import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { FileText, Users, UserPlus, Mail } from "lucide-react";

const ManageVTS = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "blogs",
      name: "Blogs",
      icon: <FileText size={18} />,
      path: "/manage-vts/blogs",
    },
    {
      id: "mentors",
      name: "Mentor Details",
      icon: <Users size={18} />,
      path: "/manage-vts/mentors",
    },
    {
      id: "joinus",
      name: "Join Us",
      icon: <UserPlus size={18} />,
      path: "/manage-vts/joinus",
    },
    {
      id: "contact",
      name: "Contact Us",
      icon: <Mail size={18} />,
      path: "/manage-vts/contact",
    },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    return tabs.find((tab) => currentPath.includes(tab.id))?.id || "blogs";
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Manage VTS
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage blogs, mentors, and view form submissions
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-red-600 text-red-600 bg-red-50"
                  : "border-transparent text-gray-600 hover:text-red-600 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageVTS;

