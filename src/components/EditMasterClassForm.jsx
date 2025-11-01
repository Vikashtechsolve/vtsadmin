// src/components/EditMasterClassForm.jsx
import React, { useState, useEffect } from "react";

const EditMasterClassForm = ({ isOpen, onClose, eventData, onSave }) => {
  const [formData, setFormData] = useState(eventData || {});

  useEffect(() => {
    setFormData(eventData || {});
  }, [eventData]);

  if (!isOpen) return null; // hide modal if not open

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-1">
          Edit Event Details
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Update information for Upcoming Masterclass
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Master Class React in 2 hours"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Subtitle <span className="text-red-500">*</span>
            </label>
            <input
              name="subtitle"
              type="text"
              value={formData.subtitle || ""}
              onChange={handleChange}
              placeholder="Introduction to React"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Mentor */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mentor Name <span className="text-red-500">*</span>
            </label>
            <input
              name="mentor"
              type="text"
              value={formData.mentor || ""}
              onChange={handleChange}
              placeholder="Enter mentor's full name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Event Date <span className="text-red-500">*</span>
            </label>
            <input
              name="date"
              type="date"
              value={formData.date || ""}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Event Time <span className="text-red-500">*</span>
            </label>
            <input
              name="time"
              type="time"
              value={formData.time || ""}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Upload Banner */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Banner
            </label>
            <input
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 p-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
            >
              Edit Event
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMasterClassForm;
