/* eslint-env node */
import { query } from './utils/db.js';
import { requireAuth } from './utils/auth.js';

export default async function handler(req, res) {
  const { action } = req.query;
  const user = requireAuth(req, res);
  if (!user) return;

  try {
    if (user.role !== 'admin') return res.status(403).json({ error: true, message: 'Admin access required' });

    if (action === 'users_list' && req.method === 'GET') {
      const users = await query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
      return res.status(200).json({ error: false, data: users });
    }

    if (action === 'user_delete' && req.method === 'POST') {
      const { user_id } = req.body;
      if (!user_id || user_id.toString() === user.id.toString()) return res.status(400).json({ error: true, message: 'Invalid user ID' });
      await query('DELETE FROM users WHERE id = ?', [user_id]);
      return res.status(200).json({ error: false, message: 'User deleted' });
    }

    return res.status(404).json({ error: true, message: 'Action not found' });
  } catch (error) {
    console.error('Admin API Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
}
