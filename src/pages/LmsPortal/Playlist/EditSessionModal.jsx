import { useState, useEffect } from "react";
import { fetchSessionById, updateSession } from "../API/sessionApi";

const EditSessionModal = ({ onClose, onUpdate, sessionId, moduleId, playlistId, sessionData }) => {
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
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    loadSessionData();
  }, [sessionId, sessionData]);

  const loadSessionData = async () => {
    try {
      setLoadingSession(true);
      
      // If sessionData is provided (from parent), use it first
      if (sessionData) {
        console.log("📦 EditSessionModal - Using sessionData from parent:", sessionData);
        console.log("🏷️ Tags from sessionData:", sessionData.tags);
        
        const tagsString = sessionData.tags && Array.isArray(sessionData.tags) && sessionData.tags.length > 0
          ? sessionData.tags.join(", ")
          : (sessionData.tags && typeof sessionData.tags === 'string' ? sessionData.tags : "");
        
        setFormData({
          title: sessionData.title || "",
          slug: sessionData.slug || "",
          description: sessionData.description || "",
          order: sessionData.order?.toString() || "",
          durationSeconds: sessionData.durationSeconds?.toString() || "",
          visibility: sessionData.visibility || "subscribers",
          tags: tagsString,
        });
        setLoadingSession(false);
        return;
      }
      
      // Fallback: fetch from API if sessionData not provided
      console.log("📦 EditSessionModal - Fetching session from API");
      const session = await fetchSessionById(sessionId);
      console.log("📦 Session from API:", session);
      console.log("🏷️ Tags from API:", session.tags);
      
      const tagsString = session.tags && Array.isArray(session.tags) && session.tags.length > 0
        ? session.tags.join(", ")
        : (session.tags && typeof session.tags === 'string' ? session.tags : "");
      
      setFormData({
        title: session.title || "",
        slug: session.slug || "",
        description: session.description || "",
        order: session.order?.toString() || "",
        durationSeconds: session.durationSeconds?.toString() || "",
        visibility: session.visibility || "subscribers",
        tags: tagsString,
      });
    } catch (err) {
      console.error("Error loading session:", err);
      setErrors({ submit: "Failed to load session data" });
    } finally {
      setLoadingSession(false);
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
      const sessionUpdateData = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        visibility: formData.visibility,
      };

      // Optional fields - only include if changed
      if (formData.description.trim()) {
        sessionUpdateData.description = formData.description.trim();
      } else {
        sessionUpdateData.description = ""; // Allow clearing description
      }

      if (formData.order.trim()) {
        sessionUpdateData.order = parseInt(formData.order);
      }

      if (formData.durationSeconds.trim()) {
        sessionUpdateData.durationSeconds = parseInt(formData.durationSeconds);
      } else {
        sessionUpdateData.durationSeconds = 0; // Allow setting to 0
      }

      if (formData.tags.trim()) {
        sessionUpdateData.tags = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      } else {
        sessionUpdateData.tags = []; // Allow clearing tags
      }

      await updateSession(sessionId, sessionUpdateData);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating session:", error);
      setErrors({ submit: error.message || "Failed to update session" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading session data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Session</h2>

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
              value={formData.title || ""}
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

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="slug"
              placeholder="e.g., introduction-to-arrays"
              value={formData.slug || ""}
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
              URL-friendly identifier
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
              value={formData.description || ""}
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
              value={formData.order || ""}
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
              Position of this session in the module
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
              value={formData.durationSeconds || ""}
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
              Video duration in seconds
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility || "subscribers"}
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
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Updating..." : "Update Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSessionModal;

