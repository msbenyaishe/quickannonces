<?php
/**
 * List Users Endpoint (Admin only)
 * GET /api/users/list.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

// Require admin
$user = requireAuth(true);

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT id, email, role, created_at FROM users ORDER BY created_at DESC");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    jsonSuccess($users);
    
} catch (PDOException $e) {
    error_log("Error fetching users: " . $e->getMessage());
    jsonError('Failed to fetch users', 500);
} catch (Exception $e) {
    error_log("Error fetching users: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

