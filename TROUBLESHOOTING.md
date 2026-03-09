# Troubleshooting: PHP Files Not Executing

## Problem
PHP files are being returned as plain text instead of being executed, causing errors like:
```
SyntaxError: Unexpected token '<', "<?php /**"... is not valid JSON
```

## Solutions

### 1. Check API Base URL

The API base URL in `src/config/api.js` is set to `/backend`. This assumes:
- Your backend folder is at the root of your domain
- The path is accessible as `https://yourdomain.com/backend/`

**If your backend is in a different location, update `src/config/api.js`:**

```javascript
// Option 1: If backend is at root
const API_BASE_URL = '/backend';

// Option 2: If backend is in a subdirectory
const API_BASE_URL = '/your-subdirectory/backend';

// Option 3: Full URL (if backend is on different domain/subdomain)
const API_BASE_URL = 'https://api.yourdomain.com';
```

### 2. Test PHP Execution

1. **Test the test endpoint:**
   - Open in browser: `https://yourdomain.com/backend/api/test.php`
   - You should see JSON: `{"success":true,"message":"PHP is working!",...}`
   - If you see PHP code instead, PHP is not executing

2. **Check InfinityFree PHP Settings:**
   - Log into InfinityFree control panel
   - Ensure PHP is enabled for your account
   - Check PHP version (should be 8.x)

### 3. Verify File Structure

Your file structure should be:
```
your-domain-root/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── check.php
│   │   │   ├── login.php
│   │   │   └── ...
│   │   ├── ads/
│   │   │   └── ...
│   │   └── test.php
│   ├── config/
│   │   ├── config.php
│   │   └── database.php
│   ├── utils/
│   ├── uploads/
│   └── .htaccess
└── (your React build files)
```

### 4. Check .htaccess

The `.htaccess` file in `backend/` should have:
```apache
AddHandler application/x-httpd-php .php
```

If InfinityFree doesn't support this, remove it (PHP should execute automatically).

### 5. Check File Permissions

Ensure PHP files are readable:
- Files: 644 or 755
- Directories: 755

### 6. Check for PHP Errors

Add this temporarily to `backend/config/config.php` to see errors:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

Then check the browser console or response for PHP errors.

### 7. Verify Database Connection

If PHP is executing but you get database errors:
- Check `backend/config/database.php` credentials
- Verify database exists in phpMyAdmin
- Test connection manually

### 8. Common InfinityFree Issues

**Issue**: PHP files download instead of execute
- **Solution**: Check file extension is `.php` (not `.php.txt`)

**Issue**: 404 errors on API endpoints
- **Solution**: Check file paths and URL structure

**Issue**: CORS errors
- **Solution**: Update `Access-Control-Allow-Origin` in `backend/config/config.php`

## Quick Debug Steps

1. **Test endpoint**: Visit `https://yourdomain.com/backend/api/test.php`
   - ✅ JSON response = PHP is working
   - ❌ PHP code visible = PHP not executing

2. **Check browser Network tab**:
   - Look at the actual request URL
   - Check response headers (should be `application/json`)
   - Check response body (should be JSON, not PHP code)

3. **Check console errors**:
   - The improved error handler will show what's actually returned
   - Look for the "API returned non-JSON response" message

4. **Test with curl** (if available):
   ```bash
   curl -v https://yourdomain.com/backend/api/test.php
   ```
   Should return JSON, not PHP code.

## Still Not Working?

1. Contact InfinityFree support to verify PHP is enabled
2. Check InfinityFree documentation for PHP setup
3. Verify your account type supports PHP execution
4. Try uploading a simple `phpinfo.php` file to test:
   ```php
   <?php phpinfo(); ?>
   ```

