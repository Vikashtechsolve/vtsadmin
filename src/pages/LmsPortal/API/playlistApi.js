import { lmsApi } from "../../../services/apiService";

/**
 * Fetch all playlists from backend
 * @param {Object} params - Query parameters (page, limit, tag, search)
 * @returns {Promise} Playlist list response
 */
export const fetchPlaylists = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.search) queryParams.append('search', params.search);

    const endpoint = `/playlists${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await lmsApi.get(endpoint);
    
    if (response.success && response.data) {
      return response.data.items || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

/**
 * Fetch a single playlist by slug or ID
 * @param {string} slugOrId - Playlist slug or ID
 * @returns {Promise} Playlist details
 */
export const fetchPlaylistById = async (slugOrId) => {
  try {
    const response = await lmsApi.get(`/playlists/${slugOrId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Playlist not found');
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};

/**
 * Create a new playlist
 * @param {Object} playlistData - Playlist data
 * @param {string} playlistData.title - Required: Playlist title
 * @param {string} playlistData.slug - Required: Unique slug
 * @param {string} playlistData.description - Required: Playlist description
 * @param {File} playlistData.thumbnail - Optional: Thumbnail image file
 * @param {string} playlistData.thumbnailUrl - Optional: Thumbnail URL
 * @param {string[]|string} playlistData.tags - Optional: Tags (array or comma-separated string)
 * @param {boolean} playlistData.isPublic - Optional: Public visibility (default: true)
 * @param {Object} playlistData.metadata - Optional: Metadata object
 * @returns {Promise} Created playlist
 */
export const createPlaylist = async (playlistData) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('title', playlistData.title);
    formData.append('slug', playlistData.slug);
    formData.append('description', playlistData.description);
    
    // Optional fields
    if (playlistData.thumbnail) {
      formData.append('thumbnail', playlistData.thumbnail);
    }
    if (playlistData.thumbnailUrl) {
      formData.append('thumbnailUrl', playlistData.thumbnailUrl);
    }
    if (playlistData.tags) {
      if (Array.isArray(playlistData.tags)) {
        formData.append('tags', JSON.stringify(playlistData.tags));
      } else {
        formData.append('tags', playlistData.tags);
      }
    }
    if (playlistData.isPublic !== undefined) {
      formData.append('isPublic', playlistData.isPublic.toString());
    }
    if (playlistData.metadata) {
      formData.append('metadata', JSON.stringify(playlistData.metadata));
    }

    const response = await lmsApi.postFormData('/admin/playlists', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create playlist');
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

/**
 * Update an existing playlist
 * @param {string} playlistId - Playlist ID
 * @param {Object} playlistData - Updated playlist data (all fields optional)
 * @returns {Promise} Updated playlist
 */
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const formData = new FormData();
    
    // Add only provided fields
    if (playlistData.title !== undefined) formData.append('title', playlistData.title);
    if (playlistData.slug !== undefined) formData.append('slug', playlistData.slug);
    if (playlistData.description !== undefined) formData.append('description', playlistData.description);
    if (playlistData.thumbnail) {
      formData.append('thumbnail', playlistData.thumbnail);
    }
    if (playlistData.thumbnailUrl !== undefined) {
      formData.append('thumbnailUrl', playlistData.thumbnailUrl);
    }
    if (playlistData.tags !== undefined) {
      if (Array.isArray(playlistData.tags)) {
        formData.append('tags', JSON.stringify(playlistData.tags));
      } else {
        formData.append('tags', playlistData.tags);
      }
    }
    if (playlistData.isPublic !== undefined) {
      formData.append('isPublic', playlistData.isPublic.toString());
    }
    if (playlistData.metadata !== undefined) {
      formData.append('metadata', JSON.stringify(playlistData.metadata));
    }

    const response = await lmsApi.patchFormData(`/admin/playlists/${playlistId}`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update playlist');
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

/**
 * Delete a playlist (soft delete)
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Success message
 */
export const deletePlaylist = async (playlistId) => {
  try {
    const response = await lmsApi.delete(`/admin/playlists/${playlistId}`);
    if (response.success) {
      return response.message || 'Playlist deleted successfully';
    }
    throw new Error(response.message || 'Failed to delete playlist');
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

/**
 * Fetch playlist modules with sessions
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Playlist modules with sessions
 */
export const fetchPlaylistModules = async (playlistId) => {
  try {
    const response = await lmsApi.get(`/playlists/${playlistId}/modules`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch playlist modules');
  } catch (error) {
    console.error('Error fetching playlist modules:', error);
    throw error;
  }
};
