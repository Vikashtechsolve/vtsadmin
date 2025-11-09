// src/components/EditMasterClassForm.jsx
import React, { useState, useEffect } from "react";

const EditMasterClassForm = ({ isOpen, onClose, eventData, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Populate form when eventData changes
  useEffect(() => {
    if (eventData) {
      setFormData({
        eventTitle: eventData.eventTitle || "",
        eventSubtitle: eventData.eventSubtitle || "",
        mentorName: eventData.mentorName || "",
        scheduleEventDate: eventData.scheduleEventDate || "",
        scheduleEventTime: eventData.scheduleEventTime || "",
        meetingUrl: eventData.meetingUrl || "",
        status: eventData.status || "scheduled",
        bannerImage: eventData.bannerImage || null,
      });
    }
  }, [eventData]);

  if (!isOpen) return null; // hide modal if not open

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData?._id) {
      alert("Event ID is missing!");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/masterclass/${eventData._id}`;
      const formPayload = new FormData();

      // Append fields
      formPayload.append("eventTitle", formData.eventTitle || "");
      formPayload.append("eventSubtitle", formData.eventSubtitle || "");
      formPayload.append("mentorName", formData.mentorName || "");
      formPayload.append("scheduleEventDate", formData.scheduleEventDate || "");
      formPayload.append("scheduleEventTime", formData.scheduleEventTime || "");
      formPayload.append("meetingUrl", formData.meetingUrl || "");
      formPayload.append("status", formData.status || "scheduled");

      // Append banner only if user uploaded a new file
      if (formData.bannerImage instanceof File) {
        formPayload.append("bannerImage", formData.bannerImage);
      }

      const res = await fetch(apiUrl, {
        method: "PUT",
        body: formPayload,
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Event updated successfully!");
        onSave(result);
        onClose();
      } else {
        alert(`❌ Error: ${result.message || "Failed to update event."}`);
      }
    } catch (error) {
      console.error("Error updating masterclass:", error);
      alert("❌ Something went wrong while updating the event.");
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
          Edit Masterclass
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Update event details below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              name="eventTitle"
              type="text"
              value={formData.eventTitle || ""}
              onChange={handleChange}
              placeholder="Enter event title"
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
              name="eventSubtitle"
              type="text"
              value={formData.eventSubtitle || ""}
              onChange={handleChange}
              placeholder="Enter subtitle"
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
              name="mentorName"
              type="text"
              value={formData.mentorName || ""}
              onChange={handleChange}
              placeholder="Enter mentor name"
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
              name="scheduleEventDate"
              type="date"
              value={formData.scheduleEventDate || ""}
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
              name="scheduleEventTime"
              type="time"
              value={formData.scheduleEventTime || ""}
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
              name="meetingUrl"
              type="url"
              value={formData.meetingUrl || ""}
              onChange={handleChange}
              placeholder="Enter meeting URL"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status || "scheduled"}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Upload Banner */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Banner
            </label>
            <input
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 p-2"
            />
           
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-3">
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
                  Updating...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMasterClassForm;
