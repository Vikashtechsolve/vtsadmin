// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

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
        className={`fixed md:static z-50 h-full w-64 bg-white border-r border-gray-100 p-6
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-600">VTS</div>
            <div className="text-xs text-gray-400">Vikash Tech Solution</div>
          </div>
          <button className="md:hidden text-gray-500 text-2xl" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 text-gray-600">
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
                        isActive ? "text-red-600" : "text-gray-700"
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </div>

                {/* Dropdown Indicator */}
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

              {/* Dropdown Items */}
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
                            ? "bg-red-100 text-red-600"
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
      </aside>
    </>
  );
};

export default Sidebar;
