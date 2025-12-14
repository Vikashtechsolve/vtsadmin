import React, { useState, useEffect, useRef } from "react";
import { X, CalendarDays, Download, User, Mail, Phone, Clock, BookOpen, CheckCircle } from "lucide-react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "react-calendar/dist/Calendar.css";

const DoubtSolvingDetails = ({ session, onBack, onSubmit }) => {
  const [editableSession, setEditableSession] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const calendarRef = useRef(null);

  const mentors = ["Arjun Mehta", "Priya Verma", "Ravi Singh", "Neha Kapoor", "Meera Jain", "Akash Rajput"];
  const statuses = ["Live", "Resolved", "Pending", "Scheduled", "Completed"];

  // Initialize editable session with proper normalization
  useEffect(() => {
    if (session) {
      const normalized = {
        _id: session._id || session.id,
        name: session.name || session.student || "Unknown",
        email: session.email || "",
        mobile: session.mobile || "",
        plan: session.plan || "N/A",
        subject: session.subject || "",
        topic: session.topic || "",
        mentor: session.mentor || session.mentorName || "",
        doubts: session.doubts || session.doubt || "",
        status: session.status || "Pending",
        time: session.time || "",
        _groupDate: session._groupDate || session.date || "",
        file: session.file || null,
        createdAt: session.createdAt || null,
        updatedAt: session.updatedAt || null,
      };
      setEditableSession(normalized);
    }
  }, [session]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  if (!session || !editableSession) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-gray-600">Session not found.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setEditableSession((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleDateChange = (date) => {
    // Format date as "Month DD, YYYY" to match the display format
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    handleChange("_groupDate", formatted);
    setShowCalendar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as formatted string like "October 28, 2025"
        return dateString;
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return dateString || "Not available";
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Convert date back to API format if needed (DD-MM-YYYY)
      let apiDate = editableSession._groupDate;
      if (apiDate && apiDate.includes(",")) {
        // Convert "October 28, 2025" to "28-10-2025"
        const date = new Date(apiDate);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          apiDate = `${day}-${month}-${year}`;
        }
      }

      const payload = {
        subject: editableSession.subject,
        doubt: editableSession.doubts,
        mentorName: editableSession.mentor,
        status: editableSession.status?.toLowerCase(),
        date: apiDate,
        time: editableSession.time,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/doubts/${editableSession._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setSuccess("Doubt session updated successfully!");
        
        // Update the session with new data
        const updatedSession = {
          ...editableSession,
          mentorName: editableSession.mentor,
          status: editableSession.status,
          doubts: editableSession.doubts,
          updatedAt: new Date().toISOString(),
        };

        // Call parent's onSubmit to update the list
        if (onSubmit) {
          setTimeout(() => {
            onSubmit(updatedSession);
          }, 1000);
        }
      } else {
        setError(result.message || "Failed to update doubt session");
      }
    } catch (err) {
      console.error("Update Error:", err);
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4 overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8"
        >
          {/* HEADER */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b text-white"
            style={{ background: 'linear-gradient(90deg, #ED0331, #87021C)' }}
          >
            <div>
              <h2 className="text-xl font-semibold">Student Doubt Details</h2>
              <p className="text-sm text-white/90 mt-1">View and update doubt solving session</p>
            </div>
            <button
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* ========== STUDENT INFO CARD ========== */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-red-600" />
                Student Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField
                  icon={<User size={18} className="text-gray-500" />}
                  label="Name"
                  value={editableSession.name}
                />
                <InfoField
                  icon={<Mail size={18} className="text-gray-500" />}
                  label="Email"
                  value={editableSession.email || "Not provided"}
                />
                <InfoField
                  icon={<Phone size={18} className="text-gray-500" />}
                  label="Mobile"
                  value={editableSession.mobile || "Not provided"}
                />
                <InfoField
                  icon={<BookOpen size={18} className="text-gray-500" />}
                  label="Plan"
                  value={editableSession.plan}
                />
              </div>
            </div>

            {/* ========== FILE DOWNLOAD ========== */}
            {editableSession.file && (
              <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <Download size={20} className="text-red-600" />
                  Uploaded File
                </h3>

                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-gray-700 truncate flex-1 mr-4">
                    {editableSession.file}
                  </span>

                  <button
                    onClick={() => {
                      const fileUrl = editableSession.file.startsWith("http")
                        ? editableSession.file
                        : `${import.meta.env.VITE_API_URL}/${editableSession.file}`;
                      window.open(fileUrl, "_blank");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white rounded-lg hover:opacity-90 transition shrink-0"
                  >
                    <Download size={18} /> Download
                  </button>
                </div>
              </div>
            )}

            {/* ========== EDITABLE FIELDS CARD ========== */}
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-red-600" />
                Update Session Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Subject"
                  value={editableSession.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="e.g., Mathematics"
                />

                <SelectField
                  label="Mentor"
                  value={editableSession.mentor}
                  onChange={(e) => handleChange("mentor", e.target.value)}
                  options={mentors}
                />
              </div>

              {/* Doubt/Query */}
              <TextareaField
                label="Doubt / Query"
                value={editableSession.doubts}
                onChange={(e) => handleChange("doubts", e.target.value)}
                placeholder="Enter the student's doubt or query..."
                rows={5}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Status */}
                <SelectField
                  label="Status"
                  value={editableSession.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  options={statuses}
                />

                {/* Time */}
                <InputField
                  label="Time"
                  value={editableSession.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  placeholder="e.g., 5:00 PM"
                />
              </div>

              {/* Date */}
              <div className="relative mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarDays size={18} className="text-red-600" />
                  Session Date
                </label>

                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={editableSession._groupDate || ""}
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
                    placeholder="Select a date"
                  />
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-3 text-gray-400 pointer-events-none"
                  />
                </div>

                {/* Floating Calendar */}
                {showCalendar && (
                  <div className="absolute z-50 mt-2" ref={calendarRef}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white border border-gray-200 rounded-xl shadow-xl p-3"
                    >
                      <Calendar
                        onChange={handleDateChange}
                        value={
                          editableSession._groupDate
                            ? (() => {
                                try {
                                  const date = new Date(editableSession._groupDate);
                                  return isNaN(date.getTime()) ? new Date() : date;
                                } catch {
                                  return new Date();
                                }
                              })()
                            : new Date()
                        }
                        className="react-calendar-custom"
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* TIMESTAMPS */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Timestamps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(editableSession.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(editableSession.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onBack}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white hover:opacity-90 transition font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Session"
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ------------------- Reusable UI Components ------------------- */

const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-200">
        {value || "—"}
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition"
    />
  </div>
);

const TextareaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      rows={rows}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none resize-none transition"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition"
    >
      <option value="">Select {label}</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);

export default DoubtSolvingDetails;
