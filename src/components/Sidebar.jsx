import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Laptop,
  Info,
  Newspaper,
  Settings,
  ChevronRight,
  Users,
  GraduationCap,
  ClipboardList,
  Headphones,
  FileCheck2,
} from "lucide-react";
import logo from "../assets/logo.png";

const Sidebar = ({ isOpen = false, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState("Our Programs");
  const navigate = useNavigate();

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    {
      name: "Our Programs",
      icon: <BookOpen size={18} />,
      children: [
        { name: "Master Class", path: "/programs/master-classes" },
        { name: "Mentorship", path: "/programs/mentorship" },
        { name: "Online Contests", path: "/programs/online-contests" },
        { name: "Resume Review & Roadmap", path: "/programs/resume-review" },
        { name: "Live Doubt Solving", path: "/programs/doubt-solving" },
      ],
    },
    {
      name: "Our Products",
      icon: <Laptop size={18} />,
      children: [
        { name: "LMS Portal", path: "/products/lms" },
        { name: "Interview Portal", path: "/products/interview" },
        { name: "Manpower Management", path: "/products/manpower" },
      ],
    },
    { name: "About Us", icon: <Info size={18} />, path: "/about" },
    { name: "Blogs", icon: <Newspaper size={18} />, path: "/blogs" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
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
        md:h-auto h-full font-['Inter']`}
      >
        {/* ===== Logo Section ===== */}
        <div className="flex items-center justify-center">
        <img
          src={logo}
          alt="VTS Logo"
          className="h-45 object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>


        {/* ===== Navigation ===== */}
        <nav className="flex flex-col px-3 py-5 text-gray-700 font-medium text-[14px] space-y-2">
          {navItems.map((item) => (
            <div key={item.name}>
              {!item.children ? (
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 border-l-[3px] ${
                      isActive
                        ? "text-red-600 bg-red-50 border-red-600 font-semibold"
                        : "text-gray-700 border-transparent hover:bg-gray-50 hover:text-red-600"
                    }`
                  }
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <>
                  {/* Dropdown Button */}
                  <button
                    onClick={() => handleDropdownToggle(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-200 border-l-[3px] ${
                      openDropdown === item.name
                        ? "bg-red-50 text-red-600 border-red-600 font-semibold"
                        : "text-gray-700 border-transparent hover:bg-gray-50 hover:text-red-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-300 ${
                        openDropdown === item.name ? "rotate-90 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Links */}
                  {openDropdown === item.name && (
                    <div className="ml-7 mt-1 flex flex-col gap-1 border-l border-red-200 pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          onClick={() => {
                            navigate(child.path);
                            onClose();
                          }}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                              isActive
                                ? "bg-red-100 text-red-600 font-medium"
                                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
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
