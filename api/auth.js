/* eslint-env node */
import bcrypt from 'bcryptjs';
import { query } from './utils/db.js';
import { signToken, setAuthCookie, clearAuthCookie, requireAuth } from './utils/auth.js';
import { applyCors } from './utils/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { action } = req.query;

  try {
    if (action === 'login' && req.method === 'POST') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: true, message: 'Email and password are required' });
      
      const users = await query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) return res.status(401).json({ error: true, message: 'Invalid credentials' });
      
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) return res.status(401).json({ error: true, message: 'Invalid credentials' });
      
      const userPayload = { id: user.id.toString(), email: user.email, role: user.role };
      const token = signToken(userPayload);
      res.setHeader('Set-Cookie', setAuthCookie(token));
      return res.status(200).json({ error: false, message: 'Login successful', data: userPayload });
    }

    if (action === 'register' && req.method === 'POST') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: true, message: 'Email and password are required' });
      if (password.length < 6) return res.status(400).json({ error: true, message: 'Password must be at least 6 characters' });
      
      const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) return res.status(409).json({ error: true, message: 'Email already exists' });
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const result = await query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, passwordHash, 'user']);
      
      const userPayload = { id: result.insertId, email, role: 'user' };
      const token = signToken(userPayload);
      res.setHeader('Set-Cookie', setAuthCookie(token));
      return res.status(201).json({ error: false, message: 'Registration successful', data: userPayload });
    }

    if (action === 'logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', clearAuthCookie());
      return res.status(200).json({ error: false, message: 'Logged out successfully' });
    }

    if (action === 'check' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;
      return res.status(200).json({ error: false, data: user });
    }

    return res.status(404).json({ error: true, message: 'Action not found' });
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
}
