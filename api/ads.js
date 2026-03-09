import { query } from './utils/db.js';
import { requireAuth, getAuthUser } from './utils/auth.js';
import { applyCors } from './utils/cors.js';

// Helper to safely parse JSON (SQL longtext can sometimes return Buffer or double-stringified JSON)
const safeParse = (input, fallback = []) => {
  if (!input) return fallback;
  
  // Handle Buffer
  let str = input;
  if (Buffer.isBuffer(input)) {
    str = input.toString('utf8');
  }

  if (typeof str !== 'string' || !str.trim()) return fallback;

  try {
    let parsed = JSON.parse(str);
    // Handle double-stringified JSON
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error('JSON Parse Error:', e, 'Raw Input:', str);
    return fallback;
  }
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { action } = req.query;

  try {
    if (action === 'list' && req.method === 'GET') {
      const { status, category, user_id, type } = req.query;
      const currentUser = getAuthUser(req);
      
      let sql = 'SELECT * FROM ads WHERE 1=1';
      const params = [];

      // Logic for status filtering
      if (status === 'all') {
        // Only admins can see ALL ads
        if (!currentUser || currentUser.role !== 'admin') {
          sql += " AND (status = 'accepted'";
          if (currentUser) {
            sql += " OR user_id = ?";
            params.push(currentUser.id);
          }
          sql += ")";
        }
      } else if (status) {
        // Specific status requested
        if (status !== 'accepted') {
          // If requesting non-accepted, must be admin or own ads
          if (!currentUser || (currentUser.role !== 'admin')) {
             // For non-admins, if they ask for 'pending', they only get THEIR pending
             sql += " AND status = ? AND user_id = ?";
             params.push(status, currentUser ? currentUser.id : -1);
          } else {
             sql += " AND status = ?";
             params.push(status);
          }
        } else {
          sql += " AND status = 'accepted'";
        }
      } else {
        // Default: accepted for everyone, plus own ads for logged in
        sql += " AND (status = 'accepted'";
        if (currentUser) {
          sql += " OR user_id = ?";
          params.push(currentUser.id);
        }
        sql += ")";
      }

      if (category && category !== 'all') { sql += ' AND category = ?'; params.push(category); }
      if (user_id) { sql += ' AND user_id = ?'; params.push(user_id); }
      if (type && type !== 'all') { sql += ' AND type_annonce = ?'; params.push(type); }
      sql += ' ORDER BY created_at DESC';
      
      const ads = await query(sql, params);
      return res.status(200).json({ 
        error: false, 
        data: ads.map(ad => ({ 
          ...ad, 
          images: safeParse(ad.images) 
        })) 
      });
    }

    if (action === 'get' && req.method === 'GET') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: true, message: 'Ad ID is required' });
      const ads = await query('SELECT * FROM ads WHERE id = ?', [id]);
      if (ads.length === 0) return res.status(404).json({ error: true, message: 'Ad not found' });
      const ad = ads[0];
      // Ensure images are parsed correctly
      ad.images = safeParse(ad.images || ad.photos);
      return res.status(200).json({ error: false, data: ad });
    }

    const user = requireAuth(req, res);
    if (!user) return;

    if (action === 'create' && req.method === 'POST') {
      const { title, description, typeAnnonce, category, subcategory, price, city, images } = req.body;
      if (!title || !typeAnnonce || price === undefined || !city) return res.status(400).json({ error: true, message: 'Missing required fields' });
      
      const result = await query(
        `INSERT INTO ads (user_id, title, description, type_annonce, category, subcategory, price, city, images, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [user.id, title, description || null, typeAnnonce, category || null, subcategory || null, price, city, JSON.stringify(images || [])]
      );
      const inserted = await query('SELECT * FROM ads WHERE id = ?', [result.insertId]);
      const ad = inserted[0];
      ad.images = safeParse(ad.images);
      return res.status(201).json({ error: false, message: 'Ad created successfully', data: ad });
    }

    if (action === 'update_status' && req.method === 'POST') {
      if (user.role !== 'admin') return res.status(403).json({ error: true, message: 'Admin access required' });
      const { ad_id, status } = req.body;
      if (!ad_id || !status || !['pending', 'accepted', 'refused'].includes(status)) return res.status(400).json({ error: true, message: 'Invalid data' });
      await query('UPDATE ads SET status = ? WHERE id = ?', [status, ad_id]);
      return res.status(200).json({ error: false, message: 'Ad status updated' });
    }

    if (action === 'delete' && req.method === 'POST') {
      const { ad_id } = req.body;
      const ads = await query('SELECT user_id FROM ads WHERE id = ?', [ad_id]);
      if (ads.length === 0) return res.status(404).json({ error: true, message: 'Ad not found' });
      if (ads[0].user_id.toString() !== user.id.toString() && user.role !== 'admin') return res.status(403).json({ error: true, message: 'Unauthorized' });
      await query('DELETE FROM ads WHERE id = ?', [ad_id]);
      return res.status(200).json({ error: false, message: 'Ad deleted' });
    }

    if (action === 'update' && req.method === 'POST') {
      const { id, title, description, price, city, status } = req.body;
      if (!id) return res.status(400).json({ error: true, message: 'Ad ID is required' });
      
      const ads = await query('SELECT user_id FROM ads WHERE id = ?', [id]);
      if (ads.length === 0) return res.status(404).json({ error: true, message: 'Ad not found' });
      
      // Only owner or admin can update
      if (ads[0].user_id.toString() !== user.id.toString() && user.role !== 'admin') {
        return res.status(403).json({ error: true, message: 'Unauthorized' });
      }

      await query(
        'UPDATE ads SET title = ?, description = ?, price = ?, city = ?, status = ? WHERE id = ?',
        [title, description, price, city, status, id]
      );
      
      return res.status(200).json({ error: false, message: 'Ad updated successfully' });
    }

    return res.status(404).json({ error: true, message: 'Action not found' });
  } catch (error) {
    console.error('Ads API Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
}
