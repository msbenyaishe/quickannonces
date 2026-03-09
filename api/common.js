/* eslint-env node */
import { query } from './utils/db.js';
import { requireAuth } from './utils/auth.js';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    if (action === 'categories_list' && req.method === 'GET') {
      const categories = [
        { "id": "1", "name": "vehicles", "label": "Vehicles" },
        { "id": "2", "name": "real-estate", "label": "Real Estate" },
        { "id": "3", "name": "electronics", "label": "Electronics" },
        { "id": "4", "name": "clothing", "label": "Clothing" },
        { "id": "5", "name": "jobs", "label": "Jobs" },
      ];
      return res.status(200).json({ error: false, data: categories });
    }

    if (action === 'report_ad' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;
      const { ad_id, reason } = req.body;
      if (!ad_id || !reason) return res.status(400).json({ error: true, message: 'Missing fields' });
      await query('INSERT INTO moderation_reports (ad_id, user_id, reason) VALUES (?, ?, ?)', [ad_id, user.id, reason]);
      return res.status(201).json({ error: false, message: 'Report submitted' });
    }

    if (action === 'upload_image' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      // Note: In a serverless environment like Vercel, handling multipart/form-data 
      // usually requires a library like 'formidable' or 'busboy'.
      // To keep it simple, we assume the frontend sends a signed upload request or we use base64.
      // However, typical Cloudinary integration often happens client-side or via a backend proxy.
      // For this implementation, we'll implement a robust backend helper.

      const { image } = req.body; // Expecting base64 string or URL
      
      if (!image) {
        return res.status(400).json({ error: true, message: 'No image data provided' });
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'quickannonce_ads',
        });
        
        return res.status(200).json({
          error: false,
          data: { url: uploadResponse.secure_url }
        });
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(500).json({ error: true, message: 'Cloudinary upload failed' });
      }
    }

    return res.status(404).json({ error: true, message: 'Action not found' });
  } catch (error) {
    console.error('Common API Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
}
