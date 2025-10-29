import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Our Programs", path: "/programs" },
    { name: "Our Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Blogs", path: "/blogs" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col p-6">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2 mb-10">
        <img src={logo} alt="VTS Logo" className="w-45 h-45 object-contain" />
      
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col space-y-3 text-gray-700 font-medium">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`text-left py-2 px-3 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path
                ? "bg-red-50 text-red-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
