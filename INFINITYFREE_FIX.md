# InfinityFree PHP Not Executing - Fix Guide

## Problem
PHP files are being returned as plain text instead of executing. You see the PHP code in the response instead of JSON.

## Root Cause
On InfinityFree, PHP files must be in the `htdocs/` directory, and PHP must be enabled in your account settings.

## Solution Steps

### Step 1: Verify File Structure on InfinityFree

Your files should be structured like this on InfinityFree:

```
htdocs/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── check.php
│   │   │   ├── login.php
│   │   │   └── ...
│   │   ├── ads/
│   │   └── ...
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   └── .htaccess
└── (your React build files - index.html, etc.)
```

**Important**: On InfinityFree, ALL files must be in the `htdocs/` directory!

### Step 2: Check PHP is Enabled

1. Log into InfinityFree control panel
2. Go to **PHP Settings** or **Account Settings**
3. Ensure **PHP is enabled** for your account
4. Check PHP version (should be 8.x)

### Step 3: Verify .htaccess Location

The `.htaccess` file must be in:
- `htdocs/backend/.htaccess` (for backend folder)
- OR `htdocs/.htaccess` (for root)

### Step 4: Test PHP Execution

1. Upload `backend/api/test.php` to your server
2. Visit: `https://yourdomain.com/backend/api/test.php`
3. **Expected**: JSON response like `{"success":true,"message":"PHP is working!",...}`
4. **If you see PHP code**: PHP is not executing - continue to Step 5

### Step 5: Alternative .htaccess (if Step 1-4 don't work)

If PHP still doesn't execute, try this `.htaccess` in `htdocs/backend/`:

```apache
# Force PHP execution
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>

# Ensure PHP files are processed
AddType application/x-httpd-php .php
AddHandler application/x-httpd-php .php
```

### Step 6: Check File Permissions

Via FTP or File Manager:
- PHP files: **644** or **755**
- Directories: **755**
- `.htaccess`: **644**

### Step 7: Contact InfinityFree Support

If nothing works:
1. Contact InfinityFree support
2. Ask: "PHP files are not executing, they're being returned as plain text"
3. Provide: Your domain and the test file URL

## Quick Test

Create `htdocs/backend/api/phpinfo.php`:
```php
<?php phpinfo(); ?>
```

Visit: `https://yourdomain.com/backend/api/phpinfo.php`

- **If you see PHP info page**: PHP is working!
- **If you see PHP code**: PHP is NOT executing

## Common InfinityFree Issues

### Issue 1: Files not in htdocs/
**Solution**: Move all files to `htdocs/` directory

### Issue 2: PHP disabled
**Solution**: Enable PHP in InfinityFree control panel

### Issue 3: Wrong file structure
**Solution**: Ensure structure matches Step 1

### Issue 4: .htaccess not working
**Solution**: Try placing `.htaccess` in `htdocs/` root instead of `backend/`

## After Fix

Once PHP is executing:
1. Test: `https://yourdomain.com/backend/api/test.php` should return JSON
2. Your React app should work correctly
3. API calls should return JSON responses

