/**
 * Ads Service
 * Handles all ads-related API calls
 */

import { API_ENDPOINTS, apiRequest } from '../../config/api';

/**
 * Fetch all ads (with optional filters)
 */
export async function fetchAds(filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.keyword) queryParams.append('keyword', filters.keyword);
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.price_min) queryParams.append('price_min', filters.price_min);
  if (filters.price_max) queryParams.append('price_max', filters.price_max);
  if (filters.city) queryParams.append('city', filters.city);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.user_id) queryParams.append('user_id', filters.user_id);
  
  const url = `${API_ENDPOINTS.ADS_LIST}${queryParams.toString() ? '&' + queryParams.toString() : ''}`;
  const response = await apiRequest(url, {
    method: 'GET',
  });
  return response.data || [];
}

/**
 * Get single ad by ID
 */
export async function getAdById(adId) {
  const response = await apiRequest(`${API_ENDPOINTS.ADS_GET}&id=${adId}`, {
    method: 'GET',
  });
  return response.data;
}

/**
 * Create a new ad
 */
export async function createAd(adData) {
  const response = await apiRequest(API_ENDPOINTS.ADS_CREATE, {
    method: 'POST',
    body: JSON.stringify({
      title: adData.title,
      description: adData.description,
      typeAnnonce: adData.typeAnnonce,
      category: adData.category,
      subcategory: adData.subcategory,
      price: adData.price,
      city: adData.city,
      images: adData.images || [],
    }),
  });
  return response.data;
}

/**
 * Update ad status (admin only)
 */
export async function updateAdStatus(adId, status) {
  const response = await apiRequest(API_ENDPOINTS.ADS_UPDATE_STATUS, {
    method: 'POST',
    body: JSON.stringify({
      ad_id: adId,
      status: status, // 'pending', 'accepted', 'refused'
    }),
  });
  return response.data;
}

/**
 * Delete an ad
 */
export async function deleteAd(adId) {
  await apiRequest(API_ENDPOINTS.ADS_DELETE, {
    method: 'POST',
    body: JSON.stringify({ ad_id: adId }),
  });
}

/**
 * Update an ad (full update)
 */
export async function updateAd(adId, adData) {
  const response = await apiRequest(API_ENDPOINTS.ADS_UPDATE, {
    method: 'POST',
    body: JSON.stringify({
      id: adId,
      ...adData
    }),
  });
  return response.data;
}

