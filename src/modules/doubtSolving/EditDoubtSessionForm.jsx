import React, { useState, useEffect } from "react";
import { X, Clock, CalendarDays, Upload } from "lucide-react";

const EditEventDetailsForm = ({ isOpen, onClose, eventData, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    mentor: "",
    date: "",
    time: "",
    status: "Scheduled",
    banner: null,
  });

  // Load selected event into form
  useEffect(() => {
    if (eventData) {
      setForm({
        title: eventData.title || "",
        subtitle: eventData.subtitle || "",
        mentor: eventData.mentor || "",
        date: eventData.date || "",
        time: eventData.time || "",
        status: eventData.status || "Scheduled",
        banner: eventData.banner || null,
      });
    }
  }, [eventData]);

  if (!isOpen) return null;

  // Update handler
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Save event
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...eventData, ...form });
    onClose();
  };

  // Handle file upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) update("banner", file.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Event Details
            </h2>
            <p className="text-sm text-gray-500">
              Update information for Upcoming Masterclass
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Master Class React in 2 hours"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Subtitle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Introduction to React"
            />
          </div>

          {/* Mentor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
              value={form.mentor}
              onChange={(e) => update("mentor", e.target.value)}
              placeholder="Arjun Mehta"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Event Date <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Event Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Upload Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Banner
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 cursor-pointer hover:bg-gray-50 transition">
                <Upload size={16} />
                <span>Upload Banner</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                  accept="image/*"
                />
              </label>
              {form.banner && (
                <span className="text-sm text-gray-600 truncate">
                  {form.banner}
                </span>
              )}
            </div>
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
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
            >
              <option>Scheduled</option>
              <option>Live</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Edit Event
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventDetailsForm;
