<?php
/**
 * Report Ad Endpoint
 * POST /api/moderation/report.php
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

// Rate limiting
if (!checkRateLimit($_SERVER['REMOTE_ADDR'] . '_report_ad')) {
    jsonError('Too many requests. Please try again later.', 429);
}

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonError('Invalid JSON input', 400);
}

$adId = isset($input['ad_id']) ? intval($input['ad_id']) : 0;
$reason = sanitizeInput($input['reason'] ?? '', 'string');

if ($adId <= 0 || empty($reason)) {
    jsonError('Ad ID and reason are required', 400);
}

try {
    $pdo = getDB();
    
    // Create the moderation_reports table if it doesn't exist yet
    $pdo->exec("CREATE TABLE IF NOT EXISTS moderation_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        user_id INT NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    $stmt = $pdo->prepare("INSERT INTO moderation_reports (ad_id, user_id, reason) VALUES (?, ?, ?)");
    $stmt->execute([$adId, $user['id'], $reason]);
    
    jsonSuccess(null, 'Report submitted successfully', 201);
    
} catch (PDOException $e) {
    error_log("Error creating report: " . $e->getMessage());
    jsonError('Failed to submit report', 500);
}
