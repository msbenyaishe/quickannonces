/**
 * CORS Utility for Vercel Serverless Functions
 * Handles Origin echo for multiple origins + credentials
 */

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://quickannonces.vercel.app', // Update with actual URL if known
  // Add other production URLs here
];

export const applyCors = (req, res) => {
  const origin = req.headers.origin;
  
  // If the origin is in our allowed list, allow it
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Non-browser request or same-origin
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};
