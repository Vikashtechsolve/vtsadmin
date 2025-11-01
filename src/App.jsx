// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// Global utilities & components
import ScrollToTop from "./components/ScrollToTop";
import Sidebar from "./components/Sidebar";

// Pages / Modules
import Dashboard from "./modules/dashboard/Dashboard";
import Programs from "./pages/Programs";
import Products from "./pages/Products";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Settings from "./pages/Settings";
import MasterClasses from "./pages/MasterClasses";

/**
 * Layout Component
 * Provides a shared structure (Sidebar + main content) for all pages
 * Also handles responsive sidebar toggling for mobile
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (visible on large, toggleable on small) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar / Hamburger for mobile */}
        <header className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-red-600 text-2xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-red-600">VTS</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* renders current route content here */}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Shared layout for main dashboard routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/programs/master-classes" element={<MasterClasses />} />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
