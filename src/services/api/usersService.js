/**
 * Users Service (Admin only)
 */

import { API_ENDPOINTS, apiRequest } from '../../config/api';

/**
 * Fetch all users (admin only)
 */
export async function fetchUsers() {
  const response = await apiRequest(API_ENDPOINTS.USERS_LIST, {
    method: 'GET',
  });
  return response.data || [];
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId) {
  await apiRequest(API_ENDPOINTS.USERS_DELETE, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
}

