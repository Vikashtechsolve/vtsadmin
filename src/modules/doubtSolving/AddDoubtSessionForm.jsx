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
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Student Doubt Details
            </h2>
            <p className="text-sm text-gray-500">
              Fill in the details to record the student’s doubt session
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              placeholder="Mathematics"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.topic}
              onChange={(e) => update("topic", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              placeholder="Integration"
            />
          </div>

          {/* Mentor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor Name <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.mentor}
              onChange={(e) => update("mentor", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-red-200 focus:outline-none"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doubt <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.doubt}
              onChange={(e) => update("doubt", e.target.value)}
              placeholder='“I am having trouble understanding how to solve ∫(2x² + 3x + 1) dx. Can you please explain the step-by-step process and constant of integration?”'
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-red-200 focus:outline-none"
            >
              <option>Live</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Scheduled</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doubt Raised on <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
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
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoubtSessionForm;
