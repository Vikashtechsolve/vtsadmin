import { lmsApi } from "../../../services/apiService";

/**
 * Fetch all news articles with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} News list response
 */
export const fetchNews = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.author) queryParams.append('author', params.author);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `/api/news${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await lmsApi.get(endpoint);
    
    if (response.success && response.data) {
      return {
        news: response.data,
        pagination: response.pagination || {}
      };
    }
    return { news: [], pagination: {} };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

/**
 * Fetch a single news article by ID
 * @param {string} newsId - News ID
 * @returns {Promise} News details
 */
export const fetchNewsById = async (newsId) => {
  try {
    const response = await lmsApi.get(`/api/news/${newsId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('News not found');
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

/**
 * Create a new news article
 * @param {Object} newsData - News data
 * @param {File} newsData.image - Optional: Image file
 * @param {string} newsData.imageUrl - Optional: Image URL
 * @returns {Promise} Created news
 */
export const createNews = async (newsData) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('title', newsData.title);
    formData.append('description', newsData.description);
    formData.append('content', newsData.content);
    formData.append('author', newsData.author);
    formData.append('date', newsData.date || new Date().toISOString());
    
    // Optional fields
    if (newsData.image) {
      formData.append('image', newsData.image);
    } else if (newsData.imageUrl) {
      formData.append('image', newsData.imageUrl);
    }
    
    if (newsData.tags) {
      if (Array.isArray(newsData.tags)) {
        formData.append('tags', JSON.stringify(newsData.tags));
      } else {
        formData.append('tags', newsData.tags);
      }
    }
    
    if (newsData.category) {
      formData.append('category', newsData.category);
    }

    const response = await lmsApi.postFormData('/api/news', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create news');
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

/**
 * Update an existing news article
 * @param {string} newsId - News ID
 * @param {Object} newsData - Updated news data
 * @returns {Promise} Updated news
 */
export const updateNews = async (newsId, newsData) => {
  try {
    const formData = new FormData();
    
    // Add only provided fields
    if (newsData.title !== undefined) formData.append('title', newsData.title);
    if (newsData.description !== undefined) formData.append('description', newsData.description);
    if (newsData.content !== undefined) formData.append('content', newsData.content);
    if (newsData.author !== undefined) formData.append('author', newsData.author);
    if (newsData.date !== undefined) formData.append('date', newsData.date);
    
    if (newsData.image) {
      formData.append('image', newsData.image);
    } else if (newsData.imageUrl !== undefined) {
      formData.append('image', newsData.imageUrl);
    }
    
    if (newsData.tags !== undefined) {
      if (Array.isArray(newsData.tags)) {
        formData.append('tags', JSON.stringify(newsData.tags));
      } else {
        formData.append('tags', newsData.tags);
      }
    }
    
    if (newsData.category !== undefined) formData.append('category', newsData.category);

    const response = await lmsApi.putFormData(`/api/news/${newsId}`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update news');
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

/**
 * Delete a news article
 * @param {string} newsId - News ID
 * @returns {Promise} Success message
 */
export const deleteNews = async (newsId) => {
  try {
    const response = await lmsApi.delete(`/api/news/${newsId}`);
    if (response.success) {
      return response.message || 'News deleted successfully';
    }
    throw new Error(response.message || 'Failed to delete news');
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

/**
 * Fetch comments for a news article
 * @param {string} newsId - News ID
 * @returns {Promise} Comments list
 */
export const fetchNewsComments = async (newsId) => {
  try {
    const response = await lmsApi.get(`/api/comments/news/${newsId}`);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} Success message
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await lmsApi.delete(`/api/comments/${commentId}`);
    if (response.success) {
      return response.message || 'Comment deleted successfully';
    }
    throw new Error(response.message || 'Failed to delete comment');
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
