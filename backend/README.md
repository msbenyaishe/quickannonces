# QuickAnnonce PHP Backend

## Setup Instructions

### 1. Database Setup

1. Log into your InfinityFree phpMyAdmin
2. Create a new database (or use existing)
3. Import `database/schema.sql` to create tables
4. Update `config/database.php` with your database credentials:
   ```php
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_database_password');
   ```

### 2. File Permissions

Ensure the uploads directory is writable:
```bash
chmod 755 backend/uploads/
```

### 3. Create Admin User

Run this SQL query in phpMyAdmin to create an admin user:
```sql
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@example.com', '$2y$12$YourHashedPasswordHere', 'admin');
```

To generate a password hash, use PHP:
```php
echo password_hash('your_password', PASSWORD_BCRYPT);
```

### 4. API Endpoints

#### Authentication
- `POST /api/auth/register.php` - Register new user
- `POST /api/auth/login.php` - Login (include `is_admin: true` for admin login)
- `POST /api/auth/logout.php` - Logout
- `GET /api/auth/check.php` - Check authentication status

#### Ads
- `GET /api/ads/list.php` - List ads (with optional filters)
- `GET /api/ads/get.php?id=123` - Get single ad
- `POST /api/ads/create.php` - Create ad (authenticated)
- `POST /api/ads/update_status.php` - Update ad status (admin only)
- `POST /api/ads/delete.php` - Delete ad (owner or admin)

#### Upload
- `POST /api/upload/image.php` - Upload image (multipart/form-data, field: `image`)

#### Users (Admin only)
- `GET /api/users/list.php` - List all users
- `POST /api/users/delete.php` - Delete user

### 5. CORS Configuration

Update `config/config.php` to set your frontend domain:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

### 6. Security Notes

- All passwords are hashed using `password_hash()` with bcrypt
- Sessions use secure cookie settings
- Input is sanitized and validated
- Rate limiting is implemented (simple file-based)
- Admin routes require server-side role verification
- SQL injection protection via prepared statements

### 7. Production Checklist

- [ ] Update database credentials
- [ ] Set `display_errors = 0` in `config.php`
- [ ] Update CORS origin to your domain
- [ ] Enable HTTPS and set `session.cookie_secure = 1`
- [ ] Review and adjust rate limiting
- [ ] Set up proper error logging
- [ ] Test all endpoints

