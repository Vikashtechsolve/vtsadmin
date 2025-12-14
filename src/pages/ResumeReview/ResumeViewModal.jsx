import React, { useState, useEffect, useRef } from "react";
import { X, CalendarDays, Download, User, Mail, Phone, BookOpen, CheckCircle, FileText, Briefcase, Clock } from "lucide-react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "react-calendar/dist/Calendar.css";

const ResumeViewModal = ({ session, onClose, onUpdate }) => {
  const [form, setForm] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const calendarRef = useRef(null);

  const statuses = ["Pending", "Scheduled", "Live", "Completed"];
  const mentorsList = [
    "Aman Sharma",
    "Pooja Patel",
    "Rahul Gupta",
    "Sneha Desai",
    "Arjun Mehta",
    "Meera Jain",
    "No Mentor",
  ];

  // Initialize form with proper normalization
  useEffect(() => {
    if (session) {
      const normalized = {
        _id: session._id || session.id,
        name: session.name || "Unknown",
        email: session.email || "",
        mobile: session.mobile || "",
        careerGoal: session.careerGoal || "",
        mentorName: session.mentorName || "",
        status: session.status
          ? session.status.charAt(0).toUpperCase() + session.status.slice(1).toLowerCase()
          : "Pending",
        date: session._groupDate || session.date || "",
        time: session.time || "",
        resume: session.resume || null,
        createdAt: session.createdAt || null,
        updatedAt: session.updatedAt || null,
      };
      setForm(normalized);
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

  if (!session || !form) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-gray-600">Session not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleDateChange = (date) => {
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    handleChange("date", formatted);
    setShowCalendar(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
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
      const payload = {
        mentorName: form.mentorName,
        status: form.status.toLowerCase(),
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume-review/${form._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (json.success || res.ok) {
        setSuccess("Resume review updated successfully!");
        
        if (onUpdate) {
          setTimeout(() => {
            onUpdate({
              ...form,
              mentorName: form.mentorName,
              status: form.status.toLowerCase(),
            });
            onClose();
          }, 1000);
        } else {
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        setError(json.message || "Failed to update resume review");
      }
    } catch (err) {
      console.error("Update Error:", err);
      setError("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-8"
        >
          {/* HEADER */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b text-white"
            style={{ background: 'linear-gradient(90deg, #ED0331, #87021C)' }}
          >
            <div>
              <h2 className="text-xl font-semibold">Resume Review Details</h2>
              <p className="text-sm text-white/90 mt-1">View and update resume review session</p>
            </div>
            <button
              onClick={onClose}
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

            {/* STUDENT INFO CARD */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-red-600" />
                Student Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField
                  icon={<User size={18} className="text-gray-500" />}
                  label="Name"
                  value={form.name}
                />
                <InfoField
                  icon={<Mail size={18} className="text-gray-500" />}
                  label="Email"
                  value={form.email || "Not provided"}
                />
                <InfoField
                  icon={<Phone size={18} className="text-gray-500" />}
                  label="Mobile"
                  value={form.mobile || "Not provided"}
                />
                <InfoField
                  icon={<Briefcase size={18} className="text-gray-500" />}
                  label="Career Goal"
                  value={form.careerGoal || "—"}
                />
              </div>
            </div>

            {/* RESUME FILE SECTION */}
            {form.resume && (
              <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-red-600" />
                  Resume File
                </h3>

                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-gray-700 truncate flex-1 mr-4">
                    {form.resume.split("/").pop()}
                  </span>

                  <button
                    onClick={() => {
                      const fileUrl = form.resume.startsWith("http")
                        ? form.resume
                        : `${import.meta.env.VITE_API_URL}/${form.resume}`;
                      window.open(fileUrl, "_blank");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ED0331] to-[#87021C] text-white rounded-lg hover:opacity-90 transition shrink-0"
                  >
                    <Download size={18} /> Download
                  </button>
                </div>
              </div>
            )}

            {/* CAREER GOAL SECTION */}
            {form.careerGoal && (
              <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <Briefcase size={20} className="text-red-600" />
                  Career Goal
                </h3>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {form.careerGoal}
                  </p>
                </div>
              </div>
            )}

            {/* UPDATE SECTION */}
            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-red-600" />
                Update Review Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* MENTOR */}
                <SelectField
                  label="Assign Mentor"
                  value={form.mentorName}
                  onChange={(e) => handleChange("mentorName", e.target.value)}
                  options={mentorsList}
                />

                {/* STATUS */}
                <SelectField
                  label="Status"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  options={statuses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* DATE */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CalendarDays size={18} className="text-red-600" />
                    Review Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={form.date || "—"}
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                      placeholder="Date not set"
                    />
                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-3 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Floating Calendar (read-only for display) */}
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
                            form.date && form.date !== "—"
                              ? (() => {
                                  try {
                                    const date = new Date(form.date);
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

                {/* TIME */}
                <InfoField
                  icon={<Clock size={18} className="text-gray-500" />}
                  label="Time"
                  value={form.time || "—"}
                />
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
                  <span className="font-medium">Created:</span> {formatDate(form.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(form.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
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
                "Update Review"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition"
    >
      <option value="">Select {label}</option>
      {options.map((op, idx) => (
        <option key={idx} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);

export default ResumeViewModal;
