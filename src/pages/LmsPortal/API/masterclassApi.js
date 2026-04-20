import { lmsApi } from "../../../services/apiService";

/**
 * Fetch all masterclasses with pagination and filtering
 * @param {Object} params - Query parameters (page, limit, status, category, search)
 * @returns {Promise} Masterclass list response
 */
export const fetchMasterclasses = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    const endpoint = `/api/masterclasses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await lmsApi.get(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
  } catch (error) {
    console.error('Error fetching masterclasses:', error);
    throw error;
  }
};

/**
 * Fetch a single masterclass by slug
 * @param {string} slug - Masterclass slug
 * @returns {Promise} Masterclass details
 */
export const fetchMasterclassBySlug = async (slug) => {
  try {
    const response = await lmsApi.get(`/api/masterclasses/${slug}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Masterclass not found');
  } catch (error) {
    console.error('Error fetching masterclass:', error);
    throw error;
  }
};

/**
 * Create a new masterclass
 * @param {Object} masterclassData - Masterclass data
 * @param {File} masterclassData.thumbnail - Optional: Thumbnail image file
 * @returns {Promise} Created masterclass
 */
export const createMasterclass = async (masterclassData) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('title', masterclassData.title);
    formData.append('slug', masterclassData.slug);
    formData.append('description', masterclassData.description);
    formData.append('instructor', masterclassData.instructor);
    
    // Optional fields
    if (masterclassData.category) formData.append('category', masterclassData.category);
    if (masterclassData.duration) formData.append('duration', masterclassData.duration);
    if (masterclassData.status) formData.append('status', masterclassData.status);
    if (masterclassData.badge) formData.append('badge', masterclassData.badge);
    if (masterclassData.thumbnailUrl) formData.append('thumbnailUrl', masterclassData.thumbnailUrl);
    if (masterclassData.startAt) formData.append('startAt', masterclassData.startAt);
    if (masterclassData.registrationOpen !== undefined) {
      formData.append('registrationOpen', masterclassData.registrationOpen.toString());
    }
    if (masterclassData.joinUrl) formData.append('joinUrl', masterclassData.joinUrl);
    if (masterclassData.notes) formData.append('notes', masterclassData.notes);
    if (masterclassData.about) formData.append('about', masterclassData.about);
    if (masterclassData.whatWeLearn) formData.append('whatWeLearn', masterclassData.whatWeLearn);
    if (masterclassData.whyMatters) formData.append('whyMatters', masterclassData.whyMatters);
    if (masterclassData.year) formData.append('year', masterclassData.year.toString());
    if (masterclassData.modules) formData.append('modules', masterclassData.modules.toString());
    
    // Array fields
    if (masterclassData.whatThisSessionCovers && Array.isArray(masterclassData.whatThisSessionCovers)) {
      formData.append('whatThisSessionCovers', JSON.stringify(masterclassData.whatThisSessionCovers));
    }
    if (masterclassData.keyTakeaways && Array.isArray(masterclassData.keyTakeaways)) {
      formData.append('keyTakeaways', JSON.stringify(masterclassData.keyTakeaways));
    }
    if (masterclassData.techStack && Array.isArray(masterclassData.techStack)) {
      formData.append('techStack', JSON.stringify(masterclassData.techStack));
    }
    
    // Object fields
    if (masterclassData.trainerInfo && typeof masterclassData.trainerInfo === 'object') {
      formData.append('trainerInfo', JSON.stringify(masterclassData.trainerInfo));
    }
    
    // File upload
    if (masterclassData.thumbnail) {
      formData.append('thumbnail', masterclassData.thumbnail);
    }

    const response = await lmsApi.postFormData('/admin/masterclasses', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create masterclass');
  } catch (error) {
    console.error('Error creating masterclass:', error);
    throw error;
  }
};

/**
 * Update an existing masterclass
 * @param {string} masterclassId - Masterclass ID
 * @param {Object} masterclassData - Updated masterclass data (all fields optional)
 * @returns {Promise} Updated masterclass
 */
export const updateMasterclass = async (masterclassId, masterclassData) => {
  try {
    const formData = new FormData();
    
    // Add only provided fields
    if (masterclassData.title !== undefined) formData.append('title', masterclassData.title);
    if (masterclassData.slug !== undefined) formData.append('slug', masterclassData.slug);
    if (masterclassData.description !== undefined) formData.append('description', masterclassData.description);
    if (masterclassData.category !== undefined) formData.append('category', masterclassData.category);
    if (masterclassData.instructor !== undefined) formData.append('instructor', masterclassData.instructor);
    if (masterclassData.duration !== undefined) formData.append('duration', masterclassData.duration);
    if (masterclassData.status !== undefined) formData.append('status', masterclassData.status);
    if (masterclassData.badge !== undefined) formData.append('badge', masterclassData.badge);
    if (masterclassData.thumbnailUrl !== undefined) formData.append('thumbnailUrl', masterclassData.thumbnailUrl);
    if (masterclassData.startAt !== undefined) formData.append('startAt', masterclassData.startAt);
    if (masterclassData.registrationOpen !== undefined) {
      formData.append('registrationOpen', masterclassData.registrationOpen.toString());
    }
    if (masterclassData.joinUrl !== undefined) formData.append('joinUrl', masterclassData.joinUrl);
    if (masterclassData.notes !== undefined) formData.append('notes', masterclassData.notes);
    if (masterclassData.about !== undefined) formData.append('about', masterclassData.about);
    if (masterclassData.whatWeLearn !== undefined) formData.append('whatWeLearn', masterclassData.whatWeLearn);
    if (masterclassData.whyMatters !== undefined) formData.append('whyMatters', masterclassData.whyMatters);
    if (masterclassData.year !== undefined) formData.append('year', masterclassData.year.toString());
    if (masterclassData.modules !== undefined) formData.append('modules', masterclassData.modules.toString());
    if (masterclassData.isPublic !== undefined) {
      formData.append('isPublic', masterclassData.isPublic.toString());
    }
    
    // Array fields
    if (masterclassData.whatThisSessionCovers !== undefined) {
      formData.append('whatThisSessionCovers', JSON.stringify(masterclassData.whatThisSessionCovers));
    }
    if (masterclassData.keyTakeaways !== undefined) {
      formData.append('keyTakeaways', JSON.stringify(masterclassData.keyTakeaways));
    }
    if (masterclassData.techStack !== undefined) {
      formData.append('techStack', JSON.stringify(masterclassData.techStack));
    }
    
    // Object fields
    if (masterclassData.trainerInfo !== undefined) {
      formData.append('trainerInfo', JSON.stringify(masterclassData.trainerInfo));
    }
    
    // File upload
    if (masterclassData.thumbnail) {
      formData.append('thumbnail', masterclassData.thumbnail);
    }

    const response = await lmsApi.patchFormData(`/admin/masterclasses/${masterclassId}`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update masterclass');
  } catch (error) {
    console.error('Error updating masterclass:', error);
    throw error;
  }
};

/**
 * Delete a masterclass (soft delete)
 * @param {string} masterclassId - Masterclass ID
 * @returns {Promise} Success message
 */
export const deleteMasterclass = async (masterclassId) => {
  try {
    const response = await lmsApi.delete(`/admin/masterclasses/${masterclassId}`);
    if (response.success) {
      return response.message || 'Masterclass deleted successfully';
    }
    throw new Error(response.message || 'Failed to delete masterclass');
  } catch (error) {
    console.error('Error deleting masterclass:', error);
    throw error;
  }
};

/**
 * Upload video for a masterclass
 * @param {string} masterclassId - Masterclass ID
 * @param {File} videoFile - Video file
 * @returns {Promise} Upload result
 */
export const uploadMasterclassVideo = async (masterclassId, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await lmsApi.postFormData(`/admin/masterclasses/${masterclassId}/upload-video`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to upload video');
  } catch (error) {
    console.error('Error uploading masterclass video:', error);
    throw error;
  }
};

/**
 * Upload notes for a masterclass
 * @param {string} masterclassId - Masterclass ID
 * @param {File} notesFile - Notes file (PDF, PPT, ZIP)
 * @returns {Promise} Upload result
 */
export const uploadMasterclassNotes = async (masterclassId, notesFile) => {
  try {
    const formData = new FormData();
    formData.append('notes', notesFile);

    const response = await lmsApi.postFormData(`/admin/masterclasses/${masterclassId}/upload-notes`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to upload notes');
  } catch (error) {
    console.error('Error uploading masterclass notes:', error);
    throw error;
  }
};

