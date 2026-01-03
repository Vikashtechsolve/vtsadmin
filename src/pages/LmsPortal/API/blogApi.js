import { lmsApi } from "../../../services/apiService";

/**
 * Fetch all blogs with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} Blog list response
 */
export const fetchBlogs = async (params = {}) => {
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

    const endpoint = `/api/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await lmsApi.get(endpoint);
    
    if (response.success && response.data) {
      return {
        blogs: response.data,
        pagination: response.pagination || {}
      };
    }
    return { blogs: [], pagination: {} };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

/**
 * Fetch a single blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise} Blog details
 */
export const fetchBlogById = async (blogId) => {
  try {
    const response = await lmsApi.get(`/api/blogs/${blogId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Blog not found');
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

/**
 * Create a new blog
 * @param {Object} blogData - Blog data
 * @param {File} blogData.image - Optional: Image file
 * @param {string} blogData.imageUrl - Optional: Image URL
 * @returns {Promise} Created blog
 */
export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    
    // Required fields
    formData.append('title', blogData.title);
    formData.append('description', blogData.description);
    formData.append('content', blogData.content);
    formData.append('author', blogData.author);
    
    // Optional fields
    if (blogData.image) {
      formData.append('image', blogData.image);
    } else if (blogData.imageUrl) {
      formData.append('image', blogData.imageUrl);
    }
    
    if (blogData.date) {
      formData.append('date', blogData.date);
    }
    
    if (blogData.tags) {
      if (Array.isArray(blogData.tags)) {
        formData.append('tags', JSON.stringify(blogData.tags));
      } else {
        formData.append('tags', blogData.tags);
      }
    }
    
    if (blogData.category) {
      formData.append('category', blogData.category);
    }

    const response = await lmsApi.postFormData('/api/blogs', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create blog');
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/**
 * Update an existing blog
 * @param {string} blogId - Blog ID
 * @param {Object} blogData - Updated blog data
 * @returns {Promise} Updated blog
 */
export const updateBlog = async (blogId, blogData) => {
  try {
    const formData = new FormData();
    
    // Add only provided fields
    if (blogData.title !== undefined) formData.append('title', blogData.title);
    if (blogData.description !== undefined) formData.append('description', blogData.description);
    if (blogData.content !== undefined) formData.append('content', blogData.content);
    if (blogData.author !== undefined) formData.append('author', blogData.author);
    
    if (blogData.image) {
      formData.append('image', blogData.image);
    } else if (blogData.imageUrl !== undefined) {
      formData.append('image', blogData.imageUrl);
    }
    
    if (blogData.date !== undefined) formData.append('date', blogData.date);
    
    if (blogData.tags !== undefined) {
      if (Array.isArray(blogData.tags)) {
        formData.append('tags', JSON.stringify(blogData.tags));
      } else {
        formData.append('tags', blogData.tags);
      }
    }
    
    if (blogData.category !== undefined) formData.append('category', blogData.category);

    const response = await lmsApi.putFormData(`/api/blogs/${blogId}`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update blog');
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

/**
 * Delete a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} Success message
 */
export const deleteBlog = async (blogId) => {
  try {
    const response = await lmsApi.delete(`/api/blogs/${blogId}`);
    if (response.success) {
      return response.message || 'Blog deleted successfully';
    }
    throw new Error(response.message || 'Failed to delete blog');
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

/**
 * Fetch comments for a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} Comments list
 */
export const fetchBlogComments = async (blogId) => {
  try {
    const response = await lmsApi.get(`/api/comments/blog/${blogId}`);
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

