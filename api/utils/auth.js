/* eslint-env node */
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'quickannonce_default_secret_dont_use_in_prod';

/**
 * Sign a JWT token
 * @param {Object} payload 
 * @returns {string} The signed token
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token
 * @param {string} token 
 * @returns {Object|null} The decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Create an HTTP-only cookie containing the JWT
 * @param {string} token 
 * @returns {string} The serialized cookie header
 */
export function setAuthCookie(token) {
  return serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Create a specialized clearing cookie for logout
 * @returns {string} Serialized cookie header to delete auth_token
 */
export function clearAuthCookie() {
  return serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expire immediately
    path: '/',
  });
}

/**
 * Authenticate incoming request based on cookies.
 * Use this at the start of protected API endpoints.
 * @param {Object} req Vercel Request Object
 * @param {Object} res Vercel Response Object
 * @returns {Object|null} Returns user object if valid, sends 401 response and returns null otherwise.
 */
export function requireAuth(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) {
    res.status(401).json({ error: true, message: 'Unauthorized' });
    return null;
  }

  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: true, message: 'Invalid or expired token' });
    return null;
  }

  return user;
}

/**
 * Optionally get user from request without failing if not present
 */
export function getAuthUser(req) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth_token;
  if (!token) return null;
  return verifyToken(token);
}
