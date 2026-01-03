import { lmsApi } from "../../../services/apiService";

/**
 * Create a new session
 * @param {Object} sessionData - Session data
 * @param {string} sessionData.moduleId - Required: Module ID
 * @param {string} sessionData.title - Required: Session title
 * @param {string} sessionData.slug - Required: Unique slug
 * @param {string} sessionData.playlistId - Optional: Playlist ID
 * @param {string} sessionData.description - Optional: Session description
 * @param {number} sessionData.order - Optional: Session order (default: 1)
 * @param {number} sessionData.durationSeconds - Optional: Duration in seconds
 * @param {string} sessionData.visibility - Optional: Visibility ("free", "subscribers", "locked", default: "subscribers")
 * @param {string[]|string} sessionData.tags - Optional: Tags (array or comma-separated string)
 * @returns {Promise} Created session
 */
export const createSession = async (sessionData) => {
  try {
    const payload = {
      moduleId: sessionData.moduleId,
      title: sessionData.title.trim(),
      slug: sessionData.slug.trim().toLowerCase(),
    };

    // Optional fields
    if (sessionData.playlistId) {
      payload.playlistId = sessionData.playlistId;
    }
    if (sessionData.description) {
      payload.description = sessionData.description.trim();
    }
    if (sessionData.order !== undefined && sessionData.order !== null) {
      payload.order = parseInt(sessionData.order);
    }
    if (sessionData.durationSeconds !== undefined && sessionData.durationSeconds !== null) {
      payload.durationSeconds = parseInt(sessionData.durationSeconds);
    }
    if (sessionData.visibility) {
      payload.visibility = sessionData.visibility;
    }
    if (sessionData.tags) {
      if (Array.isArray(sessionData.tags)) {
        payload.tags = sessionData.tags;
      } else if (typeof sessionData.tags === 'string') {
        payload.tags = sessionData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    const response = await lmsApi.post("/admin/sessions", payload);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to create session");
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Update an existing session
 * @param {string} sessionId - Session ID
 * @param {Object} sessionData - Updated session data (all fields optional)
 * @returns {Promise} Updated session
 */
export const updateSession = async (sessionId, sessionData) => {
  try {
    const payload = {};

    // Add only provided fields
    if (sessionData.title !== undefined) payload.title = sessionData.title.trim();
    if (sessionData.slug !== undefined) payload.slug = sessionData.slug.trim().toLowerCase();
    if (sessionData.description !== undefined) payload.description = sessionData.description.trim();
    if (sessionData.order !== undefined && sessionData.order !== null) {
      payload.order = parseInt(sessionData.order);
    }
    if (sessionData.durationSeconds !== undefined && sessionData.durationSeconds !== null) {
      payload.durationSeconds = parseInt(sessionData.durationSeconds);
    }
    if (sessionData.visibility !== undefined) {
      payload.visibility = sessionData.visibility;
    }
    if (sessionData.tags !== undefined) {
      if (Array.isArray(sessionData.tags)) {
        payload.tags = sessionData.tags;
      } else if (typeof sessionData.tags === 'string') {
        payload.tags = sessionData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    const response = await lmsApi.patch(`/admin/sessions/${sessionId}`, payload);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update session");
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

/**
 * Fetch a single session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise} Session details
 */
export const fetchSessionById = async (sessionId) => {
  try {
    const response = await lmsApi.get(`/sessions/${sessionId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Session not found");
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * Delete a session (soft delete)
 * @param {string} sessionId - Session ID
 * @returns {Promise} Success message
 */
export const deleteSession = async (sessionId) => {
  try {
    const response = await lmsApi.delete(`/admin/sessions/${sessionId}`);
    if (response.success) {
      return response.message || "Session deleted successfully";
    }
    throw new Error(response.message || "Failed to delete session");
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

/**
 * Fetch session details with all resources
 * @param {string} sessionId - Session ID
 * @returns {Promise} Session details with video, resources, and quiz
 */
export const fetchSessionDetails = async (sessionId) => {
  try {
    const response = await lmsApi.get(`/sessions/${sessionId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Session not found");
  } catch (error) {
    console.error("Error fetching session details:", error);
    throw error;
  }
};

/**
 * Fetch quiz for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Quiz details or null
 */
export const fetchSessionQuiz = async (sessionId) => {
  try {
    const response = await lmsApi.get(`/sessions/${sessionId}/quiz`);
    if (response.success) {
      return response.data; // Can be null if no quiz
    }
    throw new Error(response.message || "Failed to fetch quiz");
  } catch (error) {
    console.error("Error fetching session quiz:", error);
    throw error;
  }
};

