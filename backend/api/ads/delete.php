<?php
/**
 * Delete Ad Endpoint
 * POST /api/ads/delete.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require authentication
$user = requireAuth();

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonError('Invalid JSON input', 400);
}

$adId = isset($input['ad_id']) ? intval($input['ad_id']) : 0;

if ($adId <= 0) {
    jsonError('Valid ad ID is required', 400);
}

try {
    $pdo = getDB();
    
    // Check if ad exists and user has permission (owner or admin)
    $stmt = $pdo->prepare("SELECT user_id, images FROM ads WHERE id = ?");
    $stmt->execute([$adId]);
    $ad = $stmt->fetch();
    
    if (!$ad) {
        jsonError('Ad not found', 404);
    }
    
    // Check permission
    if ($ad['user_id'] != $user['id'] && $user['role'] !== 'admin') {
        jsonError('Permission denied', 403);
    }
    
    // Delete images from filesystem
    $images = json_decode($ad['images'] ?? '[]', true) ?: [];
    foreach ($images as $imageUrl) {
        // Extract filename from URL
        $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
        $filePath = UPLOAD_DIR . $filename;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    // Delete ad
    $stmt = $pdo->prepare("DELETE FROM ads WHERE id = ?");
    $stmt->execute([$adId]);
    
    jsonSuccess(null, 'Ad deleted successfully');
    
} catch (PDOException $e) {
    error_log("Error deleting ad: " . $e->getMessage());
    jsonError('Failed to delete ad', 500);
} catch (Exception $e) {
    error_log("Error deleting ad: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

