<?php
/**
 * Update Ad Status Endpoint (Admin only)
 * POST /api/ads/update_status.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require admin
$user = requireAuth(true);

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonError('Invalid JSON input', 400);
}

$adId = isset($input['ad_id']) ? intval($input['ad_id']) : 0;
$status = sanitizeInput($input['status'] ?? '', 'string');

if ($adId <= 0) {
    jsonError('Valid ad ID is required', 400);
}

if (!in_array($status, ['pending', 'accepted', 'refused'])) {
    jsonError('Valid status is required', 400);
}

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("UPDATE ads SET status = ? WHERE id = ?");
    $stmt->execute([$status, $adId]);
    
    if ($stmt->rowCount() === 0) {
        jsonError('Ad not found', 404);
    }
    
    // Fetch updated ad
    $stmt = $pdo->prepare("SELECT * FROM ads WHERE id = ?");
    $stmt->execute([$adId]);
    $ad = $stmt->fetch();
    
    $ad['images'] = json_decode($ad['images'] ?? '[]', true) ?: [];
    
    jsonSuccess($ad, 'Ad status updated');
    
} catch (PDOException $e) {
    error_log("Error updating ad status: " . $e->getMessage());
    jsonError('Failed to update ad status', 500);
} catch (Exception $e) {
    error_log("Error updating ad status: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

