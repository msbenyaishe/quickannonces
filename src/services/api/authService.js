/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, apiRequest } from '../../config/api';

/**
 * Register a new user
 */
export async function register(email, password) {
  const response = await apiRequest(API_ENDPOINTS.AUTH_REGISTER, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.data;
}

/**
 * Login user
 */
export async function login(email, password, isAdmin = false) {
  const response = await apiRequest(API_ENDPOINTS.AUTH_LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password, is_admin: isAdmin }),
  });
  return response.data;
}

/**
 * Logout user
 */
export async function logout() {
  await apiRequest(API_ENDPOINTS.AUTH_LOGOUT, {
    method: 'POST',
  });
}

/**
 * Check authentication status
 */
export async function checkAuth() {
  try {
    const response = await apiRequest(API_ENDPOINTS.AUTH_CHECK, {
      method: 'GET',
    });
    return response.data;
  } catch {
    // Not authenticated
    return null;
  }
}

