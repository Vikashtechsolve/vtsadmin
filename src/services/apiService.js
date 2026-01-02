/**
 * Centralized API Service for Admin Panel
 * Handles authentication and API calls to both VTS and LMS backends
 * Uses admin token that works for both backends
 */

// Environment variables with fallbacks
const VTS_API_URL = import.meta.env.VITE_VTS_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const LMS_API_URL = import.meta.env.VITE_LMS_API_URL || 'http://localhost:3000';

/**
 * Get admin access token from storage
 */
export const getAdminToken = () => {
  return sessionStorage.getItem('adminAccessToken') || sessionStorage.getItem('token');
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = () => {
  return sessionStorage.getItem('adminRefreshToken');
};

/**
 * Store admin tokens
 */
export const setAdminTokens = (accessToken, refreshToken) => {
  sessionStorage.setItem('adminAccessToken', accessToken);
  sessionStorage.setItem('adminRefreshToken', refreshToken);
  sessionStorage.setItem('token', accessToken); // Legacy support
};

/**
 * Clear admin tokens
 */
export const clearAdminTokens = () => {
  sessionStorage.removeItem('adminAccessToken');
  sessionStorage.removeItem('adminRefreshToken');
  sessionStorage.removeItem('token');
};

/**
 * Refresh admin access token
 */
export const refreshAdminToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${VTS_API_URL}/api/admin/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success && data.accessToken) {
      setAdminTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }

    throw new Error(data.message || 'Token refresh failed');
  } catch (error) {
    clearAdminTokens();
    throw error;
  }
};

/**
 * Make authenticated API request to either backend
 * @param {string} backend - 'vts' or 'lms'
 * @param {string} endpoint - API endpoint (e.g., '/api/blogs')
 * @param {Object} options - Fetch options
 */
export const apiRequest = async (backend, endpoint, options = {}) => {
  const baseURL = backend === 'lms' ? LMS_API_URL : VTS_API_URL;
  const token = getAdminToken();

  if (!token) {
    throw new Error('No authentication token available. Please login again.');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${baseURL}${endpoint}`, config);

    // If token expired (401), try to refresh
    if (response.status === 401) {
      try {
        const newToken = await refreshAdminToken();
        // Retry request with new token
        config.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${baseURL}${endpoint}`, config);
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Authentication failed after token refresh');
        }
        
        return await retryResponse.json();
      } catch (refreshError) {
        clearAdminTokens();
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${backend}):`, error);
    throw error;
  }
};

/**
 * Convenience methods for VTS backend
 */
export const vtsApi = {
  get: (endpoint, options) => apiRequest('vts', endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => apiRequest('vts', endpoint, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint, data, options) => apiRequest('vts', endpoint, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint, options) => apiRequest('vts', endpoint, { ...options, method: 'DELETE' }),
  // For FormData (file uploads) - don't set Content-Type header
  postFormData: async (endpoint, formData, options) => {
    const token = getAdminToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(`${VTS_API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  },
  putFormData: async (endpoint, formData, options) => {
    const token = getAdminToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(`${VTS_API_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  },
};

/**
 * Convenience methods for LMS backend
 */
export const lmsApi = {
  get: (endpoint, options) => apiRequest('lms', endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => apiRequest('lms', endpoint, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint, data, options) => apiRequest('lms', endpoint, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint, options) => apiRequest('lms', endpoint, { ...options, method: 'DELETE' }),
  // For FormData (file uploads)
  postFormData: async (endpoint, formData, options) => {
    const token = getAdminToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch(`${LMS_API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  },
};

/**
 * Logout function
 */
export const logout = async () => {
  const refreshToken = getRefreshToken();
  
  // Call logout endpoint if refresh token exists
  if (refreshToken) {
    try {
      const token = getAdminToken();
      await fetch(`${VTS_API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }
  
  // Clear tokens
  clearAdminTokens();
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

