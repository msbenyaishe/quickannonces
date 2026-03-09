# Migration Guide: Supabase to PHP/MySQL Backend

This guide explains how to migrate from Supabase to the new PHP/MySQL backend architecture.

## Overview

The application has been completely migrated from Supabase to a PHP/MySQL backend compatible with InfinityFree hosting. All Supabase dependencies, services, and logic have been removed and replaced with PHP API endpoints.

## What Changed

### Backend
- **Before**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **After**: PHP 8.x + MySQL (InfinityFree compatible)

### Authentication
- **Before**: Supabase Auth with JWT tokens
- **After**: PHP sessions with secure password hashing (bcrypt)

### Database
- **Before**: Supabase PostgreSQL tables
- **After**: MySQL tables (users, ads, sessions)

### Storage
- **Before**: Supabase Storage buckets
- **After**: Local file system (backend/uploads/)

### API Communication
- **Before**: Supabase SDK with real-time subscriptions
- **After**: REST API over HTTPS with JSON responses

## Setup Instructions

### 1. Backend Setup

1. **Upload Backend Files**
   - Upload the entire `backend/` directory to your InfinityFree hosting
   - Ensure PHP 8.x is available

2. **Database Setup**
   - Log into phpMyAdmin on InfinityFree
   - Create a new database (or use existing)
   - Import `backend/database/schema.sql` to create tables

3. **Configure Database**
   - Edit `backend/config/database.php`
   - Update with your InfinityFree database credentials:
     ```php
     define('DB_NAME', 'your_database_name');
     define('DB_USER', 'your_database_user');
     define('DB_PASS', 'your_database_password');
     ```

4. **Set Permissions**
   - Ensure `backend/uploads/` directory is writable (chmod 755)

5. **Create Admin User**
   - Run this SQL in phpMyAdmin:
     ```sql
     INSERT INTO users (email, password_hash, role) 
     VALUES ('admin@example.com', '$2y$12$YourHashedPasswordHere', 'admin');
     ```
   - Generate password hash using PHP:
     ```php
     echo password_hash('your_password', PASSWORD_BCRYPT);
     ```

6. **Configure CORS** (if needed)
   - Edit `backend/config/config.php`
   - Update `Access-Control-Allow-Origin` header with your frontend domain

### 2. Frontend Setup

1. **Update API Base URL**
   - Edit `src/config/api.js`
   - Update `API_BASE_URL` to match your backend location:
     ```javascript
     // For production (InfinityFree)
     const API_BASE_URL = '/backend';
     
     // Or full URL if backend is on different domain
     const API_BASE_URL = 'https://yourdomain.com/backend';
     ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   Note: `@supabase/supabase-js` has been removed from package.json

3. **Build Frontend**
   ```bash
   npm run build
   ```

4. **Deploy**
   - Upload the `dist/` folder contents to your InfinityFree hosting
   - Ensure the backend folder is accessible at `/backend/`

## API Endpoints

### Authentication
- `POST /backend/api/auth/register.php` - Register new user
- `POST /backend/api/auth/login.php` - Login (include `is_admin: true` for admin)
- `POST /backend/api/auth/logout.php` - Logout
- `GET /backend/api/auth/check.php` - Check authentication status

### Ads
- `GET /backend/api/ads/list.php` - List ads (with optional query params for filters)
- `GET /backend/api/ads/get.php?id=123` - Get single ad
- `POST /backend/api/ads/create.php` - Create ad (authenticated)
- `POST /backend/api/ads/update_status.php` - Update ad status (admin only)
- `POST /backend/api/ads/delete.php` - Delete ad (owner or admin)

### Upload
- `POST /backend/api/upload/image.php` - Upload image (multipart/form-data, field: `image`)

### Users (Admin only)
- `GET /backend/api/users/list.php` - List all users
- `POST /backend/api/users/delete.php` - Delete user

## Key Differences

### Authentication Flow

**Before (Supabase):**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
```

**After (PHP API):**
```javascript
const userData = await login(email, password, false);
// Session is automatically set via cookies
```

### Data Format

**Before (Supabase):**
- Ad fields: `title`, `user_id`, `status`, `created_at`
- Images: Array of Supabase Storage URLs

**After (PHP API):**
- Ad fields: `title`, `user_id`, `status`, `created_at` (same, but IDs are integers)
- Images: Array of local file URLs

### Session Management

**Before:**
- JWT tokens stored in localStorage
- Real-time auth state changes via Supabase listeners

**After:**
- PHP sessions stored in cookies
- Auth state checked on app load via `/api/auth/check.php`

## Security Improvements

1. **Password Hashing**: Uses PHP's `password_hash()` with bcrypt (cost 12)
2. **Session Security**: HttpOnly cookies, SameSite protection
3. **Input Validation**: Server-side validation and sanitization
4. **Rate Limiting**: Basic file-based rate limiting (upgrade to Redis for production)
5. **CSRF Protection**: Can be added via session tokens if needed

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Admin login works and redirects correctly
- [ ] Logout clears session
- [ ] Auth state persists on page refresh
- [ ] Ad creation with images works
- [ ] Ad listing and filtering works
- [ ] Admin can accept/refuse/delete ads
- [ ] Admin can view and delete users
- [ ] Images upload and display correctly
- [ ] Route protection works (admin vs user routes)

## Troubleshooting

### Session Not Persisting
- Check PHP session configuration in `backend/config/config.php`
- Ensure cookies are enabled in browser
- Verify session directory is writable

### CORS Errors
- Update `Access-Control-Allow-Origin` in `backend/config/config.php`
- Ensure credentials are included in requests (`credentials: 'include'`)

### Image Upload Fails
- Check `backend/uploads/` directory permissions (chmod 755)
- Verify `MAX_FILE_SIZE` in `backend/config/config.php`
- Check PHP `upload_max_filesize` and `post_max_size` settings

### Database Connection Errors
- Verify database credentials in `backend/config/database.php`
- Check InfinityFree database host (may not be `localhost`)
- Ensure database user has proper permissions

## Production Checklist

- [ ] Update database credentials
- [ ] Set `display_errors = 0` in `config.php`
- [ ] Update CORS origin to your domain
- [ ] Enable HTTPS and set `session.cookie_secure = 1`
- [ ] Review and adjust rate limiting
- [ ] Set up proper error logging
- [ ] Test all endpoints
- [ ] Backup database before going live
- [ ] Monitor error logs for issues

## Support

For InfinityFree-specific issues, refer to:
- InfinityFree documentation
- PHP version compatibility (PHP 8.x required)
- MySQL database limits
- File upload size limits

