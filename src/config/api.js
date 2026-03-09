/**
 * API Configuration
 * Update this with your backend URL
 */

// For development (local PHP server)
// const API_BASE_URL = 'http://localhost/quickannonce/backend';

// Update this with your actual domain
const API_BASE_URL = '';

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `/api/auth?action=login`,
  AUTH_REGISTER: `/api/auth?action=register`,
  AUTH_LOGOUT: `/api/auth?action=logout`,
  AUTH_CHECK: `/api/auth?action=check`,

  // Ads
  ADS_BASE: `/api/ads`,
  ADS_LIST: `/api/ads?action=list`,
  ADS_CREATE: `/api/ads?action=create`,
  ADS_UPDATE_STATUS: `/api/ads?action=update_status`,
  ADS_UPDATE: `/api/ads?action=update`,
  ADS_DELETE: `/api/ads?action=delete`,
  ADS_GET: `/api/ads?action=get`,
  UPLOAD_IMAGE: `/api/common?action=upload_image`,

  // Users (Admin)
  USERS_LIST: `/api/admin?action=users_list`,
  USERS_DELETE: `/api/admin?action=user_delete`,

  // Categories & Moderation
  LIST_CATEGORIES: `/api/common?action=categories_list`,
  REPORT_AD: `/api/common?action=report_ad`,
};

/**
 * Make API request with credentials
 */
export async function apiRequest(url, options = {}) {
  const defaultOptions = {
    credentials: 'include', // Include cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    // Get response as text first to see what we actually received
    const text = await response.text();
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Log the full response for debugging
      console.error('=== API DEBUG INFO ===');
      console.error('URL:', url);
      console.error('Status:', response.status);
      console.error('Content-Type:', contentType);
      console.error('Response (first 500 chars):', text.substring(0, 500));
      console.error('========================');
      
      // Check if it's PHP code
      if (text.trim().startsWith('<?php') || text.includes('<?php')) {
        throw new Error(`PHP is not executing. The server returned PHP code instead of JSON. Check: 1) PHP is enabled on your server, 2) File paths are correct, 3) .htaccess is working. Response: ${text.substring(0, 100)}...`);
      }
      
      // Check if it's an HTML error page
      if (text.includes('<html') || text.includes('<!DOCTYPE')) {
        throw new Error(`Server returned HTML instead of JSON. This might be a 404 error or server configuration issue. Check the URL: ${url}`);
      }
      
      throw new Error(`Server returned non-JSON response (${contentType || 'unknown'}). Response: ${text.substring(0, 200)}...`);
    }
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Response text:', text.substring(0, 500));
      throw new Error(`Invalid JSON response. Server returned: ${text.substring(0, 200)}...`);
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // 401s are expected (e.g. unauthenticated session check) — use warn, not error
    if (error.message === 'Unauthorized' || error.message?.includes('401')) {
      console.warn('API request returned unauthorized:', url);
    } else {
      console.error('API request failed:', error);
    }
    throw error;
  }
}

