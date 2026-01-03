import { useState, useEffect } from "react";
import { updatePlaylist, fetchPlaylistById } from "../API/playlistApi";

const EditPlaylistModal = ({ playlistId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    tags: "",
    isPublic: true,
    thumbnail: null,
    thumbnailUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (playlistId) {
      loadPlaylistData();
    }
  }, [playlistId]);

  const loadPlaylistData = async () => {
    try {
      setLoadingData(true);
      const playlist = await fetchPlaylistById(playlistId);
      if (playlist) {
        setFormData({
          title: playlist.title || "",
          slug: playlist.slug || "",
          description: playlist.description || "",
          tags: Array.isArray(playlist.tags) ? playlist.tags.join(", ") : playlist.tags || "",
          isPublic: playlist.isPublic !== undefined ? playlist.isPublic : true,
          thumbnail: null,
          thumbnailUrl: playlist.thumbnailUrl || "",
        });
      }
    } catch (error) {
      console.error("Error loading playlist:", error);
      setErrors({ submit: error.message || "Failed to load playlist data" });
    } finally {
      setLoadingData(false);
    }
  };

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
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare playlist data
      const playlistData = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description.trim(),
        isPublic: formData.isPublic,
      };

      // Add tags if provided
      if (formData.tags.trim()) {
        playlistData.tags = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      // Add thumbnail if provided
      if (formData.thumbnail) {
        playlistData.thumbnail = formData.thumbnail;
      } else if (formData.thumbnailUrl.trim()) {
        playlistData.thumbnailUrl = formData.thumbnailUrl.trim();
      }

      await updatePlaylist(playlistId, playlistData);
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating playlist:", error);
      setErrors({ submit: error.message || "Failed to update playlist" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading playlist data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Playlist</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., DSA Mastery"
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
              placeholder="e.g., dsa-mastery"
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
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe the playlist content..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="e.g., dsa, beginner, cpp (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <p className="text-gray-500 text-xs mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <p className="text-gray-500 text-xs mt-1">
              Or provide a thumbnail URL below
            </p>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="https://example.com/image.png"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {formData.thumbnailUrl && (
              <div className="mt-2">
                <img
                  src={formData.thumbnailUrl}
                  alt="Current thumbnail"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Public Visibility */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Make playlist public
            </label>
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
            {loading ? "Updating..." : "Update Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;

