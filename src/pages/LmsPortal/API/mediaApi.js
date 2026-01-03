import { lmsApi } from "../../../services/apiService";

/**
 * Upload a media asset (video, PDF, PPT, notes)
 * @param {File} file - File to upload
 * @param {string} type - Asset type: "video", "pdf", "ppt", "notes"
 * @param {string} sessionId - Session ID
 * @param {string} playlistId - Playlist ID (required)
 * @param {string} moduleId - Module ID (optional)
 * @param {string} label - Label for resource (optional, for PDF/PPT/notes)
 * @param {boolean} convertToHls - Convert video to HLS (default: true for videos)
 * @param {boolean} downloadable - Allow file download (default: false)
 * @returns {Promise} Uploaded media asset
 */
export const uploadMediaAsset = async ({
  file,
  type,
  sessionId,
  playlistId,
  moduleId,
  label,
  convertToHls = true,
  downloadable = false,
}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("sessionId", sessionId);
    formData.append("playlistId", playlistId);
    if (moduleId) formData.append("moduleId", moduleId);
    if (label) formData.append("label", label);
    if (type === "video") {
      formData.append("convertToHls", convertToHls.toString());
    }
    formData.append("downloadable", downloadable.toString());

    const response = await lmsApi.postFormData("/admin/media-assets/upload", formData);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to upload media asset");
  } catch (error) {
    console.error("Error uploading media asset:", error);
    throw error;
  }
};

/**
 * Delete a media asset
 * @param {string} assetId - Media asset ID
 * @returns {Promise} Success message
 */
export const deleteMediaAsset = async (assetId) => {
  try {
    const response = await lmsApi.delete(`/admin/media-assets/${assetId}`);
    if (response.success) {
      return response.message || "Media asset deleted successfully";
    }
    throw new Error(response.message || "Failed to delete media asset");
  } catch (error) {
    console.error("Error deleting media asset:", error);
    throw error;
  }
};

