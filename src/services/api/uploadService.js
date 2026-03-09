/**
 * Upload Service
 * Handles file uploads
 */

import { API_ENDPOINTS } from '../../config/api';

/**
 * Upload a single image
 */
export async function uploadImage(file) {
  // Convert file to base64 for simpler backend handling in serverless
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64 }),
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

