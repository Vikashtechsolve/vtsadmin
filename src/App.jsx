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

/**
 * AppLayout: shared layout with sidebar and top bar
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Area */}
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

        {/* Dynamic outlet */}
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
        {/* Shared Layout */}
        <Route element={<AppLayout />}>
          {/* ✅ Protected Routes */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <ProtectedRoute>
                <Programs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/master-classes"
            element={
              <ProtectedRoute>
                <MasterClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/master-classes/view/:id"
            element={
              <ProtectedRoute>
                <MasterClasses />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
