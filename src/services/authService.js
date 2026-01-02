/**
 * Authentication Service
 * Simple wrapper for admin authentication
 */

import { setAdminTokens, clearAdminTokens, getAdminToken, logout as apiLogout } from './apiService';

/**
 * Login function - uses admin login endpoint
 */
export const login = async (username, password) => {
  const VTS_API_URL = import.meta.env.VITE_VTS_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  const response = await fetch(`${VTS_API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (data.success && data.accessToken && data.refreshToken) {
    setAdminTokens(data.accessToken, data.refreshToken);
    return {
      success: true,
      admin: data.admin,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  throw new Error(data.message || 'Login failed');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAdminToken();
};

/**
 * Logout function
 */
export const logout = apiLogout;

/**
 * Get current admin info from token
 */
export const getCurrentAdmin = () => {
  try {
    const token = getAdminToken();
    if (!token) return null;

    // Simple decode without jwt-decode dependency
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

