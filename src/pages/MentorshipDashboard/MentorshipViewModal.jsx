
import React, { useState } from "react";
import { X, CalendarDays, Clock, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MentorshipViewModal = ({ session, onClose, mentorsList, onUpdate }) => {
  if (!session) return null;
  
  const normalized = {
    ...session,
    mentor: session.mentor || session.mentorName || "",
    status:
      session.status.charAt(0).toUpperCase() +
      session.status.slice(1).toLowerCase(),
    date: session._groupDate || session.date || "",
    query: session.query || "",
  };

  const [form, setForm] = useState(normalized);
  const [loading, setLoading] = useState(false);

  const statuses = ["Pending", "Scheduled", "Live", "Completed"];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateForBackend = (inputDate) => {
    if (!inputDate) return "";
    // Assuming input is DD-MM-YYYY or similar, adjust if necessary
    return inputDate;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Prepare Payload
      const payload = {
        mentorName: form.mentor,
        query: form.query,
        status: form.status.toLowerCase(),
        date: formatDateForBackend(form.date),
        time: form.time,
      };

      // 2. API Call
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mentorship/${session.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("Session updated successfully!");

        // 3. Update Parent State
        // We pass back the form data to the parent so it updates the UI instantly
        if (onUpdate) {
          onUpdate({
            ...form,
            id: session.id,
            status: form.status, // Keep the Capitalized version for UI Pill
            mentor: form.mentor,
          });
        }
      }
    } catch (e) {
      console.error("Error updating:", e);
      alert("Failed to update session.");
    } finally {
      // 4. Always Close Modal (even if API fails, or after success)
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Mentorship Session Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 transition"
            >
              <X size={26} />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-6 space-y-8 font-nunito">
            {/* STUDENT INFO */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-3">
                Student Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReadOnlyField label="Name" value={form.student} />
                <ReadOnlyField label="Email" value={form.email} />
                <ReadOnlyField label="Mobile" value={form.mobile} />
                <ReadOnlyField label="Subject" value={form.subject || "—"} />
              </div>
            </div>

            {/* QUERY */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <label className="label">Student Query</label>
              <textarea
                rows={3}
                value={form.query}
                onChange={(e) => handleChange("query", e.target.value)}
                className="input resize-none mt-1"
              />
            </div>

            {/* FILE SECTION */}
            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <label className="text-gray-700 font-semibold">
                Attached File
              </label>

              {session.file ? (
                <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg mt-2">
                  <span className="text-gray-700 truncate w-2/3">
                    {session.file.split("/").pop()}
                  </span>

                  <button
                    onClick={() => window.open(session.file, "_blank")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={18} /> Download
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-100 px-4 py-3 rounded-lg mt-2 italic">
                  No file uploaded
                </p>
              )}
            </div>

            {/* UPDATE SECTION */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-3">
                Update Details
              </h3>

              {/* MENTOR */}
              <div className="mb-4">
                <label className="label">Assign Mentor</label>
                <select
                  value={form.mentor}
                  onChange={(e) => handleChange("mentor", e.target.value)}
                  className="input mt-1"
                >
                  <option value="">Select Mentor</option>
                  {mentorsList?.length > 0 ? (
                    mentorsList.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))
                  ) : (
                    <option>No mentors available</option>
                  )}
                </select>
              </div>

              {/* STATUS */}
              <div className="mb-4">
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="input mt-1"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE + TIME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DATE */}
                <div>
                  <label className="label">Session Date</label>
                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      className="input pl-10 mt-1"
                    />
                  </div>
                </div>

                {/* TIME */}
                <div>
                  <label className="label">Session Time</label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      value={form.time}
                      onChange={(e) => handleChange("time", e.target.value)}
                      className="input pl-10 mt-1"
                      placeholder="e.g., 5:00 PM"
                    />
                  </div>
                </div>
              </div>
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
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* REUSABLE COMPONENT */
const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="label">{label}</label>
    <input
      type="text"
      readOnly
      value={value || "—"}
      className="input bg-gray-100 cursor-not-allowed"
    />
  </div>
);

/* Tailwind Utilities */
const styles = `
.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none;
}
`;

export default MentorshipViewModal;