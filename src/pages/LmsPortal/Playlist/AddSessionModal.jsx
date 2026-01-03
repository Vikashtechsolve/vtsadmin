import { useState } from "react";

const AddSessionModal = ({ onClose, onAdd, moduleId, playlistId }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    order: "",
    durationSeconds: "",
    visibility: "subscribers",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title), // Auto-generate slug if not manually set
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (formData.order && isNaN(formData.order)) {
      newErrors.order = "Order must be a number";
    } else if (formData.order && parseInt(formData.order) < 1) {
      newErrors.order = "Order must be at least 1";
    }

    if (formData.durationSeconds && isNaN(formData.durationSeconds)) {
      newErrors.durationSeconds = "Duration must be a number";
    } else if (formData.durationSeconds && parseInt(formData.durationSeconds) < 0) {
      newErrors.durationSeconds = "Duration cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sessionData = {
        moduleId: moduleId,
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        visibility: formData.visibility,
      };

      // Optional fields
      if (playlistId) {
        sessionData.playlistId = playlistId;
      }
      if (formData.description.trim()) {
        sessionData.description = formData.description.trim();
      }
      if (formData.order.trim()) {
        sessionData.order = parseInt(formData.order);
      }
      if (formData.durationSeconds.trim()) {
        sessionData.durationSeconds = parseInt(formData.durationSeconds);
      }
      if (formData.tags.trim()) {
        sessionData.tags = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      await onAdd(sessionData);
      // Reset form
      setFormData({
        title: "",
        slug: "",
        description: "",
        order: "",
        durationSeconds: "",
        visibility: "subscribers",
        tags: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating session:", error);
      setErrors({ submit: error.message || "Failed to create session" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Session</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Introduction to Arrays"
              value={formData.title}
              onChange={handleTitleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="slug"
              placeholder="e.g., introduction-to-arrays"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.slug
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              URL-friendly identifier (auto-generated from title)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe what this session covers..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              name="order"
              placeholder="e.g., 1 (leave empty for auto)"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.order
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.order && (
              <p className="text-red-500 text-xs mt-1">{errors.order}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Position of this session in the module (leave empty to add at the end)
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              name="durationSeconds"
              placeholder="e.g., 1800 (30 minutes)"
              value={formData.durationSeconds}
              onChange={handleChange}
              min="0"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.durationSeconds
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.durationSeconds && (
              <p className="text-red-500 text-xs mt-1">{errors.durationSeconds}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Video duration in seconds (optional, can be added later)
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="free">Free - Available to everyone</option>
              <option value="subscribers">Subscribers - Requires subscription</option>
              <option value="locked">Locked - Not accessible</option>
            </select>
            <p className="text-gray-500 text-xs mt-1">
              Who can access this session
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="e.g., arrays, beginner, dsa (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <p className="text-gray-500 text-xs mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;

