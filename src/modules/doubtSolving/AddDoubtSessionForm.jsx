import React, { useState } from "react";
import { X, Clock, CalendarDays } from "lucide-react";

const AddDoubtSessionForm = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    student: "",
    mentor: "",
    subject: "",
    date: "",
    time: "",
    plan: "Quick mentor",
    doubts: "",
    status: "Scheduled",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add Doubt Solving Session
            </h2>
            <p className="text-sm text-gray-500">
              Enter details to schedule a new session
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.student}
                onChange={(e) => update("student", e.target.value)}
                className="input"
                placeholder="e.g., Ananya Sharma"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Mentor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.mentor}
                onChange={(e) => update("mentor", e.target.value)}
                className="input"
                placeholder="e.g., Arjun Mehta"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="input"
                placeholder="e.g., DSA"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Plan <span className="text-red-500">*</span>
              </label>
              <select
                className="input"
                value={form.plan}
                onChange={(e) => update("plan", e.target.value)}
              >
                <option>Quick mentor</option>
                <option>Deep learning</option>
                <option>Premium mentor</option>
              </select>
            </div>

            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-9 text-gray-400"
              />
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="input pl-9"
              />
            </div>

            <div className="relative">
              <Clock size={16} className="absolute left-3 top-9 text-gray-400" />
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className="input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Doubt Details
            </label>
            <textarea
              rows={3}
              value={form.doubts}
              onChange={(e) => update("doubts", e.target.value)}
              className="input"
              placeholder="e.g., Confusion in recursion problem"
            />
          </div>

          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Save Session
            </button>
          </div>
        </form>

        <style>{`
          .input {
            @apply w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddDoubtSessionForm;
