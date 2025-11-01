import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen = false, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/" },
    {
      name: "Our Programs",
      icon: "🎓",
      children: [{ name: "Master Classes", path: "/programs/master-classes" }],
    },
    { name: "Our Products", icon: "💻", path: "/products" },
    { name: "About Us", icon: "ℹ️", path: "/about" },
    { name: "Blogs", icon: "📰", path: "/blogs" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:h-auto h-full`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 ">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="VTS Logo"
              className="h-[160px] w-[250px] object-contain rounded-md"
            />
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 text-2xl hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-3 py-4 text-gray-700">
          {navItems.map((item) => (
            <div key={item.name}>
              {/* Non-dropdown links */}
              {!item.children ? (
                <NavLink
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
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <>
                  {/* Dropdown Button */}
                  <button
                    onClick={() => handleDropdownToggle(item.name)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                      openDropdown === item.name
                        ? "bg-red-50 text-red-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {/* Dropdown Links */}
                  {openDropdown === item.name && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          onClick={() => {
                            navigate(child.path);
                            onClose();
                          }}
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
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
