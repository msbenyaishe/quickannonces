/**
 * Upload Service
 * Handles file uploads
 */

import { API_ENDPOINTS } from '../../config/api';

/**
 * Upload a single image
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  const data = await response.json();
  return data.data.url;
}

/**
 * Upload multiple images
 */
export async function uploadImages(files) {
  const uploadPromises = Array.from(files).map(file => uploadImage(file));
  const urls = await Promise.all(uploadPromises);
  return urls;
}

