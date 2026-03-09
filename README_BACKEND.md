# QuickAnnonce PHP Backend

## Architecture

This is a complete PHP/MySQL backend for the QuickAnnonce React application, designed to be deployed on InfinityFree hosting.

### Technology Stack
- **Backend**: PHP 8.x
- **Database**: MySQL (via phpMyAdmin)
- **Authentication**: PHP Sessions with bcrypt password hashing
- **Storage**: Local file system (uploads/)
- **API**: REST over HTTPS with JSON responses

## Directory Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── register.php      # User registration
│   │   ├── login.php         # User/admin login
│   │   ├── logout.php        # Logout
│   │   └── check.php         # Check auth status
│   ├── ads/
│   │   ├── list.php          # List ads (with filters)
│   │   ├── get.php           # Get single ad
│   │   ├── create.php        # Create ad
│   │   ├── update_status.php # Update status (admin)
│   │   └── delete.php        # Delete ad
│   ├── upload/
│   │   └── image.php         # Upload image
│   └── users/
│       ├── list.php          # List users (admin)
│       └── delete.php        # Delete user (admin)
├── config/
│   ├── config.php            # App configuration
│   └── database.php         # Database connection
├── utils/
│   ├── auth.php             # Auth helper functions
│   └── response.php         # JSON response helpers
├── database/
│   └── schema.sql           # MySQL schema
├── uploads/                 # Image upload directory
├── .htaccess                # Apache configuration
└── README.md                # Setup instructions
```

## Security Features

1. **Password Hashing**: Uses PHP's `password_hash()` with bcrypt (cost 12)
2. **Session Security**: 
   - HttpOnly cookies
   - SameSite protection
   - Secure cookie settings
3. **Input Validation**: All inputs are sanitized and validated
4. **SQL Injection Protection**: Prepared statements via PDO
5. **Rate Limiting**: Basic file-based rate limiting
6. **CSRF Protection**: Can be added via session tokens

## API Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }  // Optional validation errors
}
```

## Authentication

Authentication uses PHP sessions. After successful login:
- Session is created with `user_id`, `user_email`, and `user_role`
- Session cookie is sent to client
- Client includes cookie in subsequent requests (`credentials: 'include'`)

## Database Schema

### users
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `email` (VARCHAR(255), UNIQUE)
- `password_hash` (VARCHAR(255))
- `role` (ENUM: 'user', 'admin')
- `created_at`, `updated_at` (TIMESTAMP)

### ads
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY -> users.id)
- `title`, `description`, `type_annonce`, `category`, `subcategory`
- `price` (DECIMAL(10,2))
- `city` (VARCHAR(100))
- `images` (JSON array of URLs)
- `status` (ENUM: 'pending', 'accepted', 'refused')
- `created_at`, `updated_at` (TIMESTAMP)

### sessions (optional, for database session storage)
- `id` (VARCHAR(128), PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY -> users.id)
- `data` (TEXT)
- `last_activity` (INT)

## Deployment on InfinityFree

1. Upload `backend/` folder to your hosting
2. Import `database/schema.sql` via phpMyAdmin
3. Update `config/database.php` with your credentials
4. Set `uploads/` directory permissions (chmod 755)
5. Update CORS in `config/config.php` if needed
6. Test endpoints

## Rate Limiting

Simple file-based rate limiting is implemented:
- 100 requests per hour per IP
- Stored in system temp directory
- For production, consider Redis or database-based solution

## Error Handling

- All errors are logged via `error_log()`
- User-friendly error messages returned to client
- Database errors are caught and generic messages sent
- Never expose sensitive information in error responses

## Image Upload

- Max file size: 5MB (configurable in `config/config.php`)
- Allowed types: JPEG, PNG, WebP, GIF
- Files stored in `uploads/` directory
- Unique filenames: `{user_id}_{timestamp}_{random}.{ext}`
- Public URLs returned to client

## Admin Routes

All admin routes require:
1. Valid session (authenticated)
2. `role === 'admin'` in database
3. Server-side verification (not just frontend check)

## Performance Considerations

- Database connection is singleton (reused)
- Prepared statements for all queries
- Indexes on frequently queried columns
- JSON column for images (efficient storage)

## Future Enhancements

- Redis for session storage and rate limiting
- Image optimization/compression
- Pagination for large result sets
- Full-text search for ads
- Email verification
- Password reset functionality
- API versioning

