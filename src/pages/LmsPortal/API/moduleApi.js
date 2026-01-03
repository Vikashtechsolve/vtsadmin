import { lmsApi } from "../../../services/apiService";

/**
 * Create a new module
 * @param {Object} moduleData - Module data
 * @param {string} moduleData.title - Required: Module title
 * @param {string} moduleData.playlistId - Optional: Playlist ID to add module to
 * @param {string} moduleData.description - Optional: Module description
 * @param {number} moduleData.order - Optional: Module order (default: 1)
 * @param {string[]|string} moduleData.tags - Optional: Tags (array or comma-separated string)
 * @returns {Promise} Created module
 */
export const createModule = async (moduleData) => {
  try {
    const payload = {
      title: moduleData.title.trim(),
    };

    // Optional fields
    if (moduleData.playlistId) {
      payload.playlistId = moduleData.playlistId;
    }
    if (moduleData.description) {
      payload.description = moduleData.description.trim();
    }
    if (moduleData.order !== undefined && moduleData.order !== null) {
      payload.order = parseInt(moduleData.order);
    }
    if (moduleData.tags) {
      if (Array.isArray(moduleData.tags)) {
        payload.tags = moduleData.tags;
      } else if (typeof moduleData.tags === 'string') {
        payload.tags = moduleData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    const response = await lmsApi.post("/admin/modules", payload);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to create module");
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
};

/**
 * Update an existing module
 * @param {string} moduleId - Module ID
 * @param {Object} moduleData - Updated module data (all fields optional)
 * @returns {Promise} Updated module
 */
export const updateModule = async (moduleId, moduleData) => {
  try {
    const payload = {};

    // Add only provided fields
    if (moduleData.title !== undefined) payload.title = moduleData.title.trim();
    if (moduleData.playlistId !== undefined) payload.playlistId = moduleData.playlistId;
    if (moduleData.description !== undefined) payload.description = moduleData.description.trim();
    if (moduleData.order !== undefined && moduleData.order !== null) {
      payload.order = parseInt(moduleData.order);
    }
    if (moduleData.tags !== undefined) {
      if (Array.isArray(moduleData.tags)) {
        payload.tags = moduleData.tags;
      } else if (typeof moduleData.tags === 'string') {
        payload.tags = moduleData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    const response = await lmsApi.patch(`/admin/modules/${moduleId}`, payload);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update module");
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};

/**
 * Fetch a single module by ID
 * @param {string} moduleId - Module ID
 * @returns {Promise} Module details
 */
export const fetchModuleById = async (moduleId) => {
  try {
    const response = await lmsApi.get(`/modules/${moduleId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Module not found");
  } catch (error) {
    console.error("Error fetching module:", error);
    throw error;
  }
};

/**
 * Delete a module (soft delete)
 * @param {string} moduleId - Module ID
 * @returns {Promise} Success message
 */
export const deleteModule = async (moduleId) => {
  try {
    const response = await lmsApi.delete(`/admin/modules/${moduleId}`);
    if (response.success) {
      return response.message || "Module deleted successfully";
    }
    throw new Error(response.message || "Failed to delete module");
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
};

