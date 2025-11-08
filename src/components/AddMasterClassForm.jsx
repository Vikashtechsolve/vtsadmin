import React, { useState } from "react";
import { X, CalendarDays } from "lucide-react";

const AddDoubtSessionForm = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    mentor: "",
    doubt: "",
    status: "Live",
    date: "",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Doubt Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="Mathematics"
              className="input"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.topic}
              onChange={(e) => update("topic", e.target.value)}
              placeholder="Integration"
              className="input"
            />
          </div>

          {/* Mentor */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Mentor Name <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.mentor}
              onChange={(e) => update("mentor", e.target.value)}
              className="input"
            >
              <option value="">Select mentor</option>
              <option>Akash Rajput</option>
              <option>Priya Chauhan</option>
              <option>Meera Jain</option>
              <option>Arjun Mehta</option>
            </select>
          </div>

          {/* Doubt */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Doubt <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.doubt}
              onChange={(e) => update("doubt", e.target.value)}
              placeholder='“I am having trouble understanding how to solve ∫(2x² + 3x + 1) dx. Can you please explain the step-by-step process and constant of integration?”'
              className="input resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="input"
            >
              <option>Live</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Scheduled</option>
            </select>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Doubt Raised on <span className="text-red-500">*</span>
            </label>
            <CalendarDays
              size={16}
              className="absolute left-3 top-9 text-gray-400"
            />
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="input pl-9"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t mt-6">
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
              Save Details
            </button>
          </div>
        </form>

        {/* Tailwind Styles */}
        <style>{`
          .input {
            @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200 focus:outline-none transition;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddDoubtSessionForm;
