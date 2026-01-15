import { lmsApi } from "../../../services/apiService";

/**
 * Upload a media asset (video, PDF, PPT)
 * @param {File} file - File to upload
 * @param {string} type - Asset type: "video", "pdf", "ppt"
 * @param {string} sessionId - Session ID (REQUIRED for PDF/PPT uploads)
 * @param {string} playlistId - Playlist ID (required)
 * @param {string} moduleId - Module ID (optional)
 * @param {string} label - Label for resource (optional, defaults to "PDF Notes" for PDF, "Slides" for PPT)
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
    // Validate required fields
    if (!file) {
      throw new Error("File is required");
    }
    if (!type) {
      throw new Error("Asset type is required");
    }
    
    // CRITICAL: sessionId MUST be included for PDF/PPT/ZIP/Notes uploads (assignments)
    if ((type === "pdf" || type === "ppt" || type === "zip" || type === "notes") && !sessionId) {
      console.warn(`⚠️ File uploaded but sessionId missing! Type: ${type}, File: ${file.name}`);
      throw new Error(`sessionId is required for ${type.toUpperCase()} uploads`);
    }
    
    if (!playlistId) {
      throw new Error("playlistId is required");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    
    // Ensure sessionId is always included (especially for PDF/PPT)
    if (sessionId) {
      formData.append("sessionId", sessionId);
    } else if (type !== "video") {
      // For non-video assets, sessionId should be present
      console.warn(`⚠️ Warning: sessionId not provided for ${type} upload`);
    }
    
    formData.append("playlistId", playlistId);
    if (moduleId) formData.append("moduleId", moduleId);
    
    // Add label for PDF/PPT/ZIP/Notes (default if not provided)
    // Always include label if provided, regardless of type
    if (label) {
      formData.append("label", label);
    } else if (type === "pdf" || type === "ppt") {
      formData.append("label", type === "pdf" ? "PDF Notes" : "Slides");
    } else if (type === "zip") {
      formData.append("label", "Assignment");
    } else if (type === "notes") {
      formData.append("label", "Notes");
    }
    
    if (type === "video") {
      formData.append("convertToHls", convertToHls.toString());
    }
    formData.append("downloadable", downloadable.toString());

    console.log(`📤 Uploading ${type} file: ${file.name}, sessionId: ${sessionId || 'NOT PROVIDED'}`);

    const response = await lmsApi.postFormData("/admin/media-assets/upload", formData);

    if (response.success && response.data) {
      const asset = response.data;
      // Log warning if sessionId was missing and asset was created
      if (!sessionId && (type === "pdf" || type === "ppt")) {
        console.warn(`⚠️ PDF/PPT uploaded but sessionId missing! Asset ID: ${asset._id || asset.id}`);
      }
      console.log(`✅ Successfully uploaded ${type} asset: ${asset._id || asset.id}`);
      return asset;
    }
    throw new Error(response.message || "Failed to upload media asset");
  } catch (error) {
    console.error(`❌ Error uploading ${type} asset:`, error);
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

