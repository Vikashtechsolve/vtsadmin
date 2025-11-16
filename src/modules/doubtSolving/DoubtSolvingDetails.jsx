import React, { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoubtSolvingDetails = ({ session, onBack, onSubmit }) => {
  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Session not found.
      </div>
    );

  // NORMALIZE session fields (backend → frontend mapping)
  const normalized = {
    ...session,
    topic: session.topic || session.subject || "",
    doubts: session.doubts || session.doubt || "",
    mentor: session.mentor || session.mentorName || "",
    _groupDate: session._groupDate || session.date || "",
  };

  const [editableSession, setEditableSession] = useState(normalized);
  const [showCalendar, setShowCalendar] = useState(false);

  // Update simple fields
  const handleChange = (field, value) => {
    setEditableSession((prev) => ({ ...prev, [field]: value }));
  };

  // Handle calendar date
  const handleDateChange = (date) => {
    const formatted = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
    handleChange("_groupDate", formatted);
    setShowCalendar(false);
  };

  const mentors = ["Arjun Mehta", "Priya Verma", "Ravi Singh", "Neha Kapoor"];
  const statuses = ["Live", "resolved", "Pending"];

  // SUBMIT: Call backend API
  const handleSubmit = async () => {
    try {
      const payload = {
        subject: editableSession.subject,
        topic: editableSession.topic,
        doubt: editableSession.doubts,
        mentorName: editableSession.mentor,
        status: editableSession.status.toLowerCase(),
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

      const data = await res.json();
      console.log("Update Response:", data);

      if (onSubmit) onSubmit(editableSession);
    } catch (error) {
      console.error("Error updating doubt:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] animate-fadeIn relative">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Student Doubt Details
          </h2>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={editableSession.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={editableSession.topic || ""}
                onChange={(e) => handleChange("topic", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

          </div>

          {/* Mentor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor
            </label>
            <select
              value={editableSession.mentor || ""}
              onChange={(e) => handleChange("mentor", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select Mentor</option>
              {mentors.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Doubt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doubt
            </label>
            <textarea
              rows={4}
              value={editableSession.doubts || ""}
              onChange={(e) => handleChange("doubts", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editableSession.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">Select Status</option>
              {statuses.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Date
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              />

              <input
                type="text"
                readOnly
                value={editableSession._groupDate || ""}
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-200 cursor-pointer"
              />
            </div>

            {showCalendar && (
              <div className="absolute top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                <Calendar onChange={handleDateChange} value={new Date()} />
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t mt-6">
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoubtSolvingDetails;
