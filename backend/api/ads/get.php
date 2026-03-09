<?php
/**
 * Get Single Ad Endpoint
 * GET /api/ads/get.php?id=123
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$adId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($adId <= 0) {
    jsonError('Valid ad ID is required', 400);
}

$user = getCurrentUser();
$isAdmin = $user && $user['role'] === 'admin';

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT * FROM ads WHERE id = ?");
    $stmt->execute([$adId]);
    $ad = $stmt->fetch();
    
    if (!$ad) {
        jsonError('Ad not found', 404);
    }
    
    // Non-admin users: can only see accepted ads OR their own ads (regardless of status)
    if (!$isAdmin && $ad['status'] !== 'accepted') {
        // Check if this is the user's own ad
        if (!$user || $ad['user_id'] != $user['id']) {
            jsonError('Ad not found', 404);
        }
    }
    
    $ad['images'] = json_decode($ad['images'] ?? '[]', true) ?: [];
    
    jsonSuccess($ad);
    
} catch (PDOException $e) {
    error_log("Error fetching ad: " . $e->getMessage());
    jsonError('Failed to fetch ad', 500);
} catch (Exception $e) {
    error_log("Error fetching ad: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

