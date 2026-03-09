<?php
/**
 * List Ads Endpoint
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

// ✅ OPTIONAL AUTH (NO 401)
$user = getCurrentUser();
$isAdmin = $user && $user['role'] === 'admin';

try {
    $pdo = getDB();

    $query = "SELECT id, title, description, price, city, images, status, created_at, user_id
              FROM ads";

    $conditions = [];
    $params = [];

    if (!$isAdmin) {
        // Regular users: see accepted ads OR their own ads (regardless of status)
        if ($user) {
            $conditions[] = "(status = 'accepted' OR user_id = ?)";
            $params[] = $user['id'];
        } else {
            // Visitors: only see accepted ads
            $conditions[] = "status = 'accepted'";
        }
    }

    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $ads = $stmt->fetchAll();

    foreach ($ads as &$ad) {
        $ad['images'] = json_decode($ad['images'] ?? '[]', true);
    }

    jsonSuccess($ads);

} catch (Exception $e) {
    error_log("Ads list error: " . $e->getMessage());
    jsonError('An error occurred', 500);
}
