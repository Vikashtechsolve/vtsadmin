// src/components/AddMasterClassForm.jsx
import React, { useState } from "react";

const AddMasterClassForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    mentor: "",
    date: "",
    time: "",
    status: "",
    banner: null,
  });

  if (!isOpen) return null; // Hide modal when not open

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          Add New Master Class
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Fill in the details below to create a new upcoming event
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="Enter the masterclass title (e.g., Resume Review Workshop)"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Event Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Subtitle <span className="text-red-500">*</span>
            </label>
            <input
              name="subtitle"
              type="text"
              placeholder="Enter event subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Mentor Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mentor Name <span className="text-red-500">*</span>
            </label>
            <input
              name="mentor"
              type="text"
              placeholder="Enter mentor's full name"
              value={formData.mentor}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Schedule Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Event Date <span className="text-red-500">*</span>
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Schedule Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Schedule Event Time <span className="text-red-500">*</span>
            </label>
            <input
              name="time"
              type="time"
              value={formData.time}
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
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMasterClassForm;