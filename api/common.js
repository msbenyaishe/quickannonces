/* eslint-env node */
import { query } from './utils/db.js';
import { requireAuth } from './utils/auth.js';

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
      // NOTE: Standard Vercel does not host files. In production, use Cloudinary or S3.
      // For now, we return a mock URL to prevent failure.
      return res.status(200).json({
        error: false,
        data: { url: 'https://images.unsplash.com/photo-1554034483-04fac767e290?w=800' }
      });
    }

    return res.status(404).json({ error: true, message: 'Action not found' });
  } catch (error) {
    console.error('Common API Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
}
