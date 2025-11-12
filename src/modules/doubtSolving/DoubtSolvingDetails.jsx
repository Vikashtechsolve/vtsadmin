import React, { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DoubtSolvingDetails = ({ session, onBack, onSubmit }) => {
  const [editableSession, setEditableSession] = useState({ ...session });
  const [showCalendar, setShowCalendar] = useState(false);

  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Session not found.
      </div>
    );

  // ✅ Update single field
  const handleChange = (field, value) => {
    setEditableSession((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Update registration details
  const handleRegistrationChange = (index, field, value) => {
    const updated = [...editableSession.registration];
    updated[index][field] = value;
    setEditableSession((prev) => ({ ...prev, registration: updated }));
  };

  // ✅ Save and close modal
  const handleSubmit = () => {
    if (onSubmit) onSubmit(editableSession);
  };

  // ✅ Handle calendar date select
  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    handleChange("_groupDate", formattedDate);
    setShowCalendar(false);
  };

  const mentors = ["Arjun Mehta", "Priya Verma", "Ravi Singh", "Neha Kapoor"];
  const statuses = ["Live", "Completed", "Pending"];

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
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none cursor-pointer bg-white"
              />
            </div>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div className="absolute top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                <Calendar onChange={handleDateChange} value={new Date()} />
              </div>
            )}
          </div>

          {/* Registered Students */}
          {editableSession.registration &&
            editableSession.registration.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Registered Students
                </h3>
                {editableSession.registration.map((r, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-0 gap-2"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={r.name}
                        onChange={(e) =>
                          handleRegistrationChange(i, "name", e.target.value)
                        }
                        className="w-full text-gray-800 font-medium bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500">
                        {r.email} • {r.mobile}
                      </p>
                    </div>
                    <div className="text-xs flex flex-col gap-1 sm:items-end">
                      <input
                        type="text"
                        value={r.graduationYear}
                        onChange={(e) =>
                          handleRegistrationChange(
                            i,
                            "graduationYear",
                            e.target.value
                          )
                        }
                        className="w-20 text-center border border-gray-200 rounded-lg px-1 py-0.5"
                      />
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleRegistrationChange(i, "status", e.target.value)
                        }
                        className="mt-1 inline-block px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-700 text-xs focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
