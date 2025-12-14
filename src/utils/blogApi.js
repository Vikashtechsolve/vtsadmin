/**
 * ============================================================================
 * CENTRALIZED BLOG API SERVICE
 * ============================================================================
 * 
 * All blog-related API endpoints are consolidated here.
 * 
 * IMPORTANT FOR SWAGGER DOCUMENTATION:
 * - All endpoints use base path: /api/blogs
 * - All endpoints should be tagged as "Blogs" in Swagger (not "Admin Blogs")
 * - Ensure all 5 endpoints appear under ONE "Blogs" section in Swagger UI
 * - Remove any empty or duplicate Swagger sections
 * 
 * Endpoints:
 * 1. GET    /api/blogs          - Get all blogs
 * 2. GET    /api/blogs/:id      - Get single blog
 * 3. POST   /api/blogs          - Create blog
 * 4. PUT    /api/blogs/:id      - Update blog
 * 5. DELETE /api/blogs/:id      - Delete blog
 * 
 * See BLOG_API_DOCUMENTATION.md for detailed endpoint specifications
 * ============================================================================
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get all blogs
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} Blog data with pagination
 */
export const getBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${API_URL}/api/blogs?${queryString}`
      : `${API_URL}/api/blogs`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        pagination: result.pagination || {},
      };
    }
    
    return {
      success: false,
      data: [],
      pagination: {},
      error: result.message || "Failed to fetch blogs",
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      data: [],
      pagination: {},
      error: error.message || "Failed to fetch blogs",
    };
  }
};

/**
 * Get a single blog by ID
 * @param {string} id - Blog ID
 * @returns {Promise} Blog data
 */
export const getBlogById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
    
    return {
      success: false,
      data: null,
      error: result.message || "Failed to fetch blog",
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Failed to fetch blog",
    };
  }
};

/**
 * Create a new blog
 * @param {FormData} formData - Blog form data (includes file uploads)
 * @returns {Promise} Created blog data
 */
export const createBlog = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/blogs`, {
      method: "POST",
      body: formData,
    });
    
    const result = await response.json();
    
    if (response.ok || result.success) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || "Blog created successfully",
      };
    }
    
    return {
      success: false,
      error: result.message || "Failed to create blog",
    };
  } catch (error) {
    console.error("Error creating blog:", error);
    return {
      success: false,
      error: error.message || "Failed to create blog",
    };
  }
};

/**
 * Update an existing blog
 * @param {string} id - Blog ID
 * @param {FormData} formData - Updated blog form data
 * @returns {Promise} Updated blog data
 */
export const updateBlog = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });
    
    const result = await response.json();
    
    if (response.ok || result.success) {
      return {
        success: true,
        data: result.data || result,
        message: result.message || "Blog updated successfully",
      };
    }
    
    return {
      success: false,
      error: result.message || "Failed to update blog",
    };
  } catch (error) {
    console.error("Error updating blog:", error);
    return {
      success: false,
      error: error.message || "Failed to update blog",
    };
  }
};

/**
 * Delete a blog
 * @param {string} id - Blog ID
 * @returns {Promise} Deletion result
 */
export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: "DELETE",
    });
    
    const result = await response.json();
    
    if (response.ok || result.success) {
      return {
        success: true,
        message: result.message || "Blog deleted successfully",
      };
    }
    
    return {
      success: false,
      error: result.message || "Failed to delete blog",
    };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return {
      success: false,
      error: error.message || "Failed to delete blog",
    };
  }
};

/**
 * Helper function to prepare FormData for blog submission
 * @param {Object} blogData - Blog data object
 * @returns {FormData} FormData ready for API submission
 */
export const prepareBlogFormData = (blogData) => {
  const formData = new FormData();
  
  formData.append("title", blogData.title || "");
  formData.append("category", blogData.category || "");
  formData.append("excerpt", blogData.excerpt || "");
  formData.append("author", blogData.author || "");
  formData.append("date", blogData.date || "");
  formData.append("readTime", blogData.readTime || "");
  formData.append("tags", blogData.tags || "");
  formData.append("content", blogData.content || "");
  formData.append("status", blogData.status || "draft");
  
  if (blogData.hero instanceof File) {
    formData.append("hero", blogData.hero);
  }
  
  return formData;
};
