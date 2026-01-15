// src/App.jsx
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

import Dashboard from "./modules/dashboard/Dashboard";
import Programs from "./pages/Programs";
import Products from "./pages/Products";
import About from "./pages/About";
import Settings from "./pages/Settings";
import MasterClasses from "./pages/MasterClasses";
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import DoubtSolving from "./modules/doubtSolving/DoubtSolving";
import MentorshipDashboard from "./pages/MentorshipDashboard/MentorshipDashboard";
import ResumeReviewMain from "./pages/ResumeReview/ResumeReviewMain";
import ManageVTS from "./pages/ManageVTS/ManageVTS";
import Blogs from "./pages/ManageVTS/Blogs";
import Mentors from "./pages/ManageVTS/Mentors";
import JoinUs from "./pages/ManageVTS/JoinUs";
import ContactUs from "./pages/ManageVTS/ContactUs";
import resumeReviewData from "./data/resumeReviewData.json";
import LmsDashboard from "./pages/LmsPortal/LmsDashboard";
import LmsLayout from "./LmsLayout";
import Playlists from "./pages/LmsPortal/Playlist/Playlists";
import PlaylistDetails from "./pages/LmsPortal/Playlist/PlaylistDetails";
import BlogsSection from "./pages/LmsPortal/Blogs/BlogsSection";
import SessionDetails from "./pages/LmsPortal/Playlist/PlaylistTabs/SessionDetails";
import QuestionForm from "./pages/LmsPortal/Playlist/PlaylistTabs/QuestionForm";
import TabRenderer from "./pages/LmsPortal/Playlist/PlaylistTabs/TabRenderer";
import NewsSection from "./pages/LmsPortal/News/NewsSection";
import MasterClassesSection from "./pages/LmsPortal/MasterClasses/MasterClassesSection";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-red-600 text-2xl font-bold"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-red-600">VTS Admin</h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
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
        {/* 🔐 Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🧩 Protected Admin Layout */}
        <Route element={<AppLayout />}>
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
          <Route path="/programs/doubt-solving" element={<DoubtSolving />} />
          <Route
            path="/programs/doubt-solving/view/:id"
            element={<DoubtSolving />}
          />
          <Route
            path="/programs/mentorship"
            element={<MentorshipDashboard />}
          />

          <Route
            path="/programs/resume-review"
            element={<ResumeReviewMain />}
          />
          <Route
            path="/programs/resume-review/view/:id"
            element={<ResumeReviewMain />}
          />

          {/* <Route element={<LmsLayout />}> */}
          <Route
            path="/lmsDashboard"
            element={
              <ProtectedRoute>
                <LmsDashboard />
              </ProtectedRoute>
            }
          />

          {/* LMS Playlists */}
          <Route
            path="/lmsDashboard/playlists"
            element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lmsDashboard/playlists/:id"
            element={
              <ProtectedRoute>
                <PlaylistDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lmsDashboard/playlists/:playlistId/session/:sid"
            element={
              <ProtectedRoute>
                <SessionDetails />
              </ProtectedRoute>
            }
          />

          <Route index element={<TabRenderer />} />

          <Route
            path="/lmsDashboard/playlists/:playlistId/session/:sid/question-form"
            element={
              <ProtectedRoute>
                <QuestionForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lmsDashboard/blogsSection"
            element={
              <ProtectedRoute>
                <BlogsSection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lmsDashboard/NewsSection"
            element={
              <ProtectedRoute>
                <NewsSection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lmsDashboard/masterClasses"
            element={
              <ProtectedRoute>
                <MasterClassesSection />
              </ProtectedRoute>
            }
          />

          {/* </Route> */}

          {/* Manage VTS Routes */}
          <Route path="/manage-vts" element={<ManageVTS />}>
            <Route
              index
              element={<Navigate to="/manage-vts/blogs" replace />}
            />
            <Route path="blogs" element={<Blogs />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="joinus" element={<JoinUs />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
