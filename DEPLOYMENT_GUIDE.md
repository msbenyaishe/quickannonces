# Deployment Guide for InfinityFree

## What to Upload

### ✅ UPLOAD THESE:

1. **`backend/` folder** → Upload to `htdocs/backend/`
   - Contains all PHP API files
   - Must be in `htdocs/backend/` on InfinityFree

2. **Built React App** → Upload to `htdocs/`
   - First, build your React app: `npm run build`
   - This creates a `dist/` folder
   - Upload contents of `dist/` to `htdocs/`

### ❌ DO NOT UPLOAD:

1. **`node_modules/`** - Too large, not needed on server
2. **`src/`** - Source files, not needed (only built files)
3. **`public/`** - Usually handled by build process
4. **`.git/`** - Version control, not needed
5. **Development files** - Only production build

## Step-by-Step Upload Process

### Step 1: Build Your React App

```bash
npm run build
```

This creates a `dist/` folder with production-ready files.

### Step 2: Upload to InfinityFree

**Structure on InfinityFree should be:**

```
htdocs/
├── index.html              (from dist/)
├── assets/                 (from dist/assets/)
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
├── backend/                (entire backend folder)
│   ├── api/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   └── .htaccess
└── (other files from dist/)
```

### Step 3: Upload Process

1. **Via FTP or File Manager:**
   - Upload `dist/` contents → `htdocs/`
   - Upload `backend/` folder → `htdocs/backend/`

2. **File Structure:**
   ```
   htdocs/
   ├── index.html
   ├── assets/
   ├── backend/
   │   ├── api/
   │   ├── config/
   │   └── ...
   ```

### Step 4: Set Permissions

- PHP files: **644**
- Directories: **755**
- `.htaccess`: **644**
- `uploads/` directory: **755**

### Step 5: Configure Database

1. Import `backend/database/schema.sql` via phpMyAdmin
2. Update `backend/config/database.php` with your credentials

### Step 6: Test

1. Visit: `https://yourdomain.com/backend/api/test.php`
   - Should return JSON
2. Visit: `https://yourdomain.com/`
   - Should show your React app

## Quick Checklist

- [ ] Built React app (`npm run build`)
- [ ] Uploaded `dist/` contents to `htdocs/`
- [ ] Uploaded `backend/` folder to `htdocs/backend/`
- [ ] Set correct file permissions
- [ ] Imported database schema
- [ ] Updated database credentials
- [ ] Tested PHP execution
- [ ] Tested React app

## Important Notes

1. **Only upload built files** - Don't upload `src/` or `node_modules/`
2. **Backend must be in htdocs/** - InfinityFree requires files in `htdocs/`
3. **Build before upload** - Always run `npm run build` first
4. **Check file structure** - Ensure `backend/` is inside `htdocs/`

