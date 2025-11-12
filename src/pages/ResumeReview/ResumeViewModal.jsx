import React from "react";
import { X, CalendarDays } from "lucide-react";

const ResumeViewModal = ({ session, onClose }) => {
  if (!session) return null;

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
              value={session.student || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
            />
          </div>

          {/* Mentor Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Mentor Name
            </label>
            <input
              type="text"
              readOnly
              value={session.mentor || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
            />
          </div>

          {/* Education */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Education
            </label>
            <input
              type="text"
              readOnly
              value={session.education || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
            />
          </div>

          {/* Career Goal */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Career Goal
            </label>
            <textarea
              readOnly
              value={session.careerGoal || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed resize-none"
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
              readOnly
              value={session.time || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status
            </label>
            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  session.status === "Live"
                    ? "bg-red-500"
                    : session.status === "Completed"
                    ? "bg-green-500"
                    : session.status === "Scheduled"
                    ? "bg-gray-400"
                    : "bg-yellow-500"
                }`}
              ></span>
              <span className="capitalize">{session.status}</span>
            </div>
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
                value={session._groupDate || "—"}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewModal;
