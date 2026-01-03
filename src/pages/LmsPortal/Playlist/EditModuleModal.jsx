import { useState, useEffect } from "react";
import { fetchModuleById, updateModule } from "../API/moduleApi";

const EditModuleModal = ({ onClose, onUpdate, moduleId, playlistId, moduleData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingModule, setLoadingModule] = useState(true);

  useEffect(() => {
    loadModuleData();
  }, [moduleId, moduleData]);

  const loadModuleData = async () => {
    try {
      setLoadingModule(true);
      
      // If moduleData is provided (from parent), use it first as it has tags
      if (moduleData) {
        console.log("📦 EditModuleModal - Using moduleData from parent:", moduleData);
        console.log("🏷️ Tags from moduleData:", moduleData.tags);
        
        const tagsString = moduleData.tags && Array.isArray(moduleData.tags) && moduleData.tags.length > 0
          ? moduleData.tags.join(", ")
          : (moduleData.tags && typeof moduleData.tags === 'string' ? moduleData.tags : "");
        
        console.log("🏷️ Tags string:", tagsString);
        
        setFormData({
          title: moduleData.title || "",
          description: moduleData.description || "",
          order: moduleData.order?.toString() || "",
          tags: tagsString,
        });
        setLoadingModule(false);
        return;
      }
      
      // Fallback: fetch from API if moduleData not provided
      console.log("📦 EditModuleModal - Fetching module from API");
      const module = await fetchModuleById(moduleId);
      console.log("📦 Module from API:", module);
      console.log("🏷️ Tags from API:", module.tags);
      
      const tagsString = module.tags && Array.isArray(module.tags) && module.tags.length > 0
        ? module.tags.join(", ")
        : (module.tags && typeof module.tags === 'string' ? module.tags : "");
      
      setFormData({
        title: module.title || "",
        description: module.description || "",
        order: module.order?.toString() || "",
        tags: tagsString,
      });
    } catch (err) {
      console.error("Error loading module:", err);
      setErrors({ submit: "Failed to load module data" });
    } finally {
      setLoadingModule(false);
    }
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
      const moduleData = {};

      // Required field
      moduleData.title = formData.title.trim();

      // Optional fields - only include if changed
      if (formData.description.trim()) {
        moduleData.description = formData.description.trim();
      } else {
        moduleData.description = ""; // Allow clearing description
      }

      if (formData.order.trim()) {
        moduleData.order = parseInt(formData.order);
      }

      if (formData.tags.trim()) {
        moduleData.tags = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      } else {
        moduleData.tags = []; // Allow clearing tags
      }

      await updateModule(moduleId, moduleData);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating module:", error);
      setErrors({ submit: error.message || "Failed to update module" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingModule) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading module data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Module</h2>

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
              placeholder="e.g., 1"
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
              Position of this module in the playlist
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
              value={formData.tags || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {formData.tags && (
              <p className="text-gray-400 text-xs mt-1">
                Current tags: {formData.tags}
              </p>
            )}
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
            {loading ? "Updating..." : "Update Module"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModuleModal;

