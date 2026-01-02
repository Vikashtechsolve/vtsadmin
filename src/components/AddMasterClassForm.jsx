// src/components/AddMasterClassForm.jsx
import React, { useState } from "react";
import { vtsApi } from "../services/apiService";

const AddMasterClassForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    mentor: "",
    date: "",
    time: "",
    banner: null,
    meetingurl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null; // Hide modal when not open

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setError(""); // Clear error on input change
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // Prepare FormData for multipart upload
      const formPayload = new FormData();
      formPayload.append("eventTitle", formData.title);
      formPayload.append("eventSubtitle", formData.subtitle);
      formPayload.append("mentorName", formData.mentor);
      formPayload.append("scheduleEventDate", formData.date);
      formPayload.append("scheduleEventTime", formData.time);
      formPayload.append("meetingUrl", formData.meetingurl);
      if (formData.banner instanceof File) {
        formPayload.append("bannerImage", formData.banner);
      }

      const result = await vtsApi.postFormData('/api/masterclass', formPayload);

      if (result.success || result.data) {
        alert("✅ Masterclass added successfully!");
        if (onSubmit) onSubmit(result.data || result);
        // Reset form
        setFormData({
          title: "",
          subtitle: "",
          mentor: "",
          date: "",
          time: "",
          banner: null,
          meetingurl: "",
        });
        onClose();
      } else {
        setError(result.message || "Failed to add masterclass");
      }
    } catch (error) {
      console.error("Error adding masterclass:", error);
      setError(error.message || "❌ Failed to add masterclass. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

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
              placeholder="Enter the masterclass title"
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

          {/* Meeting URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Meeting URL <span className="text-red-500">*</span>
            </label>
            <input
              name="meetingurl"
              type="url"
              placeholder="Enter meeting URL"
              value={formData.meetingurl}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Upload Banner */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Banner <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 p-2"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </div>
              ) : (
                "Add Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMasterClassForm;
