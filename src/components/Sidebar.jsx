// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen = false, onClose }) => {
  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/" },
    { name: "Our Programs", icon: "🎓", path: "/programs" },
    { name: "Our Products", icon: "💻", path: "/products" },
    { name: "About Us", icon: "ℹ️", path: "/about" },
    { name: "Blogs", icon: "📰", path: "/blogs" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <>
      {/* Background overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static z-50 h-full w-64 bg-white border-r border-gray-100 p-6
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-600">VTS</div>
            <div className="text-xs text-gray-400">Vikash Tech Solution</div>
          </div>

          {/* Close Button (mobile only) */}
          <button
            className="md:hidden text-gray-500 text-2xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "hover:bg-gray-50 text-gray-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
