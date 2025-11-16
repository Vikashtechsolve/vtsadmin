import React, { useState } from "react";
import { X, CalendarDays, Download } from "lucide-react";

const ResumeViewModal = ({ session, onClose }) => {
  if (!session) return null;

  const baseUrl = import.meta.env.VITE_API_URL;

  // 🔥 Editable fields
  const [mentorName, setMentorName] = useState(session.mentorName || "");
  const [status, setStatus] = useState(
    session.status.charAt(0).toUpperCase() + session.status.slice(1).toLowerCase()
  );

  const statuses = ["Pending", "Scheduled", "Live", "Completed"];

  const mentorsList = [
    "Aman Sharma",
    "Pooja Patel",
    "Rahul Gupta",
    "Sneha Desai",
    "No Mentor"
  ];

  // 🔥 Handle Submit
  const handleSubmit = async () => {
    try {
      const payload = {
        mentorName,
        status: status.toLowerCase(), // backend expects lowercase
      };

      const res = await fetch(`${baseUrl}/api/resume-review/${session._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        alert("Updated successfully!");
        onClose();
      } else {
        alert("Failed to update.");
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating data.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Resume Review Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Student Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Student Name
            </label>
            <input
              type="text"
              readOnly
              value={session.name || ""}
              className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="text"
              readOnly
              value={session.email || ""}
              className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Mentor Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Assign Mentor
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
            >
              <option value="">Select Mentor</option>
              {mentorsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Career Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Career Goal
            </label>
            <textarea
              readOnly
              value={session.careerGoal || ""}
              className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 cursor-not-allowed"
              rows={3}
            />
          </div>

          {/* Session Time */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Session Time
            </label>
            <input
              type="text"
              value={session.time || ""}
              className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Review Date */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Review Date
            </label>
            <div className="relative">
              <CalendarDays size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                readOnly
                value={session._groupDate || session.date || "—"}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Resume Download */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Resume
            </label>

            {session.resume ? (
              <a
                href={`${baseUrl}${session.resume}`}
                download
                target="_blank"
                className="flex items-center gap-2 text-blue-600 underline hover:text-blue-800"
              >
                <Download size={18} />
                Download Resume
              </a>
            ) : (
              <p className="text-gray-500 text-sm">No resume uploaded.</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewModal;
