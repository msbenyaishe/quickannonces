<?php
/**
 * Image Upload Endpoint
 * POST /api/upload/image.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require authentication
$user = requireAuth();

// Rate limiting
if (!checkRateLimit($_SERVER['REMOTE_ADDR'] . '_upload')) {
    jsonError('Too many requests. Please try again later.', 429);
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    jsonError('No file uploaded or upload error', 400);
}

$file = $_FILES['image'];

// Validate file size
if ($file['size'] > MAX_FILE_SIZE) {
    jsonError('File size exceeds maximum allowed (5MB)', 400);
}

// Validate file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
    jsonError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.', 400);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = $user['id'] . '_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
$filePath = UPLOAD_DIR . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    jsonError('Failed to save file', 500);
}

// Generate public URL (adjust based on your server setup)
// For InfinityFree, you might need to adjust this path
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . 
           '://' . $_SERVER['HTTP_HOST'];
$publicUrl = $baseUrl . '/backend/uploads/' . $filename;

jsonSuccess([
    'url' => $publicUrl,
    'filename' => $filename
], 'Image uploaded successfully');

