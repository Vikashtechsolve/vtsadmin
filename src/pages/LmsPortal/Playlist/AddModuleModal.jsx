import { useState } from "react";

const AddModuleModal = ({ onClose, onAdd, playlistId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (formData.order && isNaN(formData.order)) {
      newErrors.order = "Order must be a number";
    } else if (formData.order && parseInt(formData.order) < 1) {
      newErrors.order = "Order must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const moduleData = {
        title: formData.title.trim(),
        playlistId: playlistId, // Always include playlistId
      };

      // Optional fields
      if (formData.description.trim()) {
        moduleData.description = formData.description.trim();
      }
      if (formData.order.trim()) {
        moduleData.order = parseInt(formData.order);
      }
      if (formData.tags.trim()) {
        moduleData.tags = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      await onAdd(moduleData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        order: "",
        tags: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating module:", error);
      setErrors({ submit: error.message || "Failed to create module" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Module</h2>

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
              onChange={handleChange}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe what this module covers..."
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
              Position of this module in the playlist (leave empty to add at the end)
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
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Module"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModuleModal;

