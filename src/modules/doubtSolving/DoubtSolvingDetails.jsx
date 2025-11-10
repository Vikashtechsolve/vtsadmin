import React from "react";
import { X, CalendarDays } from "lucide-react";

const DoubtSolvingDetails = ({ session, onBack }) => {
  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Session not found.
      </div>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Student Doubt Details
          </h2>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Grid for responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                readOnly
                value={session.subject || ""}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                readOnly
                value={session.topic || ""}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor
            </label>
            <input
              type="text"
              readOnly
              value={session.mentor || ""}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doubt
            </label>
            <textarea
              rows={4}
              readOnly
              value={session.doubts || ""}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
              <span
                className={`h-3 w-3 rounded-full ${
                  session.status === "Live"
                    ? "bg-red-500"
                    : session.status === "Completed"
                    ? "bg-green-500"
                    : session.status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              ></span>
              <span className="capitalize text-gray-700 font-medium">
                {session.status}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                readOnly
                value={session._groupDate || ""}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50"
              />
            </div>
          </div>

          {session.registration && session.registration.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Registered Students
              </h3>
              {session.registration.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{r.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.email} • {r.mobile}
                    </p>
                  </div>
                  <div className="text-xs">
                    <p>{r.graduationYear}</p>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 rounded-full ${
                        r.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtSolvingDetails;
