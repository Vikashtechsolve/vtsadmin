// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ replace with your actual logo file

const Sidebar = ({ isOpen = false, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/" },
    {
      name: "Our Programs",
      icon: "🎓",
      path: "/programs",
      children: [
        { name: "Master Classes", path: "/programs/master-classes" },
      ],
    },
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
        className={`fixed md:static z-50 h-full w-64 bg-white border-r border-gray-100 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="VTS Logo"
                className="h-45 w-45 object-contain rounded-lg"
              />
              </div>
               

            {/* Close Button (mobile only) */}
            <button
              className="md:hidden text-gray-500 text-2xl hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-gray-600">
            {navItems.map((item) => (
              <div key={item.name}>
                {/* Main Item */}
                <div
                  onClick={() =>
                    item.children ? handleDropdownToggle(item.name) : onClose()
                  }
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer font-medium transition-colors ${
                    openDropdown === item.name
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {item.children ? (
                      <span>{item.name}</span>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `transition-colors ${
                            isActive ? "text-red-600 font-semibold" : "text-gray-700"
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    )}
                  </div>

                  {/* Dropdown Arrow */}
                  {item.children && (
                    <span
                      className={`transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  )}
                </div>

                {/* Dropdown Children */}
                {item.children && openDropdown === item.name && (
                  <div className="ml-8 mt-2 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isActive
                              ? "bg-red-100 text-red-600 font-medium"
                              : "hover:bg-gray-50 text-gray-700"
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer (optional for settings/info) */}
        <div className="border-t border-gray-100 mt-4 pt-4 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} VTS. All Rights Reserved.
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
