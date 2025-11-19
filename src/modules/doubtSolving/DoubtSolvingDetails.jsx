
import React, { useState } from "react";
import { X, CalendarDays, Download } from "lucide-react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "react-calendar/dist/Calendar.css";

const DoubtSolvingDetails = ({ session, onBack, onSubmit }) => {
  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Session not found.
      </div>
    );

  const normalized = {
    ...session,
    doubts: session.doubt || session.doubts || "",
    mentor: session.mentor || session.mentorName || "",
    _groupDate: session._groupDate || session.date || "",
  };

  const [editableSession, setEditableSession] = useState(normalized);
  const [showCalendar, setShowCalendar] = useState(false);

  const mentors = ["Arjun Mehta", "Priya Verma", "Ravi Singh", "Neha Kapoor"];
  const statuses = ["Live", "Resolved", "Pending"];

  const handleChange = (field, value) => {
    setEditableSession((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date) => {
    const formatted = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
    handleChange("_groupDate", formatted);
    setShowCalendar(false);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        subject: editableSession.subject,
        doubt: editableSession.doubts,
        mentorName: editableSession.mentor,
        status: editableSession.status?.toLowerCase(),
        date: editableSession._groupDate,
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

      if (onSubmit) onSubmit(editableSession);
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const baseUrl = import.meta.env.VITE_API_URL;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Student Doubt Details
            </h2>
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-6 space-y-8">

            {/* ========== STUDENT INFO CARD (READ ONLY) ========== */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="text-gray-700 font-semibold mb-3">Student Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadOnly label="Name" value={editableSession.name} />
                <ReadOnly label="Email" value={editableSession.email} />
                <ReadOnly label="Mobile" value={editableSession.mobile} />
                <ReadOnly label="Plan" value={editableSession.plan || "N/A"} />
              </div>
            </div>

            {/* ========== FILE DOWNLOAD ========== */}
            {editableSession.file && (
              <div className="p-4 border rounded-xl shadow-sm bg-white">
                <h3 className="text-gray-700 font-semibold mb-2">Uploaded File</h3>

                <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg">
                  <span className="text-gray-700 truncate w-2/3">
                    {editableSession.file}
                  </span>

                  <button
                    onClick={() => window.open(`${baseUrl}/${editableSession.file}`, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={18} /> Download
                  </button>
                </div>
              </div>
            )}

            {/* ========== EDITABLE FIELDS CARD ========== */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="text-gray-700 font-semibold mb-3">Update Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Subject"
                  value={editableSession.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />

                <SelectField
                  label="Mentor"
                  value={editableSession.mentor}
                  onChange={(e) => handleChange("mentor", e.target.value)}
                  options={mentors}
                />
              </div>

              {/* Doubt */}
              <TextareaField
                label="Doubt"
                value={editableSession.doubts}
                onChange={(e) => handleChange("doubts", e.target.value)}
              />

              {/* Status */}
              <SelectField
                label="Status"
                value={editableSession.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={statuses}
              />

              {/* Date */}
              <div className="relative mt-4">
                <label className="label">Session Date</label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                    onClick={() => setShowCalendar(!showCalendar)}
                  />

                  <input
                    type="text"
                    readOnly
                    value={editableSession._groupDate || ""}
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="input pl-10 cursor-pointer"
                    placeholder="Pick a date"
                  />
                </div>

                {/* Floating Calendar */}
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 bg-white border rounded-xl shadow-xl p-2 top-full mt-3"
                  >
                    <Calendar onChange={handleDateChange} />
                  </motion.div>
                )}
              </div>

              {/* Time */}
              <InputField
                label="Time"
                value={editableSession.time}
                onChange={(e) => handleChange("time", e.target.value)}
                placeholder="e.g., 5:00 PM"
                className="mt-4"
              />
            </div>

            {/* TIMESTAMPS */}
            <div className="text-sm text-gray-500">
              <p>Created At: {new Date(session.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(session.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ------------------- Reusable UI Components ------------------- */

const ReadOnly = ({ label, value }) => (
  <div>
    <label className="label">{label}</label>
    <input
      type="text"
      value={value || ""}
      readOnly
      className="input bg-gray-100 text-gray-600 cursor-not-allowed"
    />
  </div>
);

const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="label">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
    />
  </div>
);

const TextareaField = ({ label, value, onChange }) => (
  <div>
    <label className="label">{label}</label>
    <textarea
      rows={4}
      value={value || ""}
      onChange={onChange}
      className="input resize-none"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="label">{label}</label>
    <select value={value || ""} onChange={onChange} className="input">
      <option value="">Select {label}</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);

/* ------------------- Tailwind Utilities ------------------- */
const styles = `
.label { @apply block text-sm font-medium text-gray-700 mb-1; }
.input { @apply w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none; }
`;

export default DoubtSolvingDetails;


