import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./modules/dashboard/Dashboard";
import Programs from "./pages/Programs";
import Products from "./pages/Products";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Settings from "./pages/Settings";
import MasterClasses from "./pages/MasterClasses";
import LoginPage from "./pages/LoginPage"; // ✅ Add this import

/**
 * Shared layout (sidebar + content)
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-red-600 text-2xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-red-600">VTS</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**
 * Root App Component
 */
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ✅ Public route */}
        <Route path="/login" element={<Navigate to="https://www.vikashtechsolution.com/login" replace />} />
        {/* ✅ Protect the entire admin layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/programs/master-classes" element={<MasterClasses />} />
          <Route
            path="/programs/master-classes/view/:id"
            element={<MasterClasses />}
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;