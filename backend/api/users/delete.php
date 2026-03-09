<?php
/**
 * Delete User Endpoint (Admin only)
 * POST /api/users/delete.php
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

$userId = isset($input['user_id']) ? intval($input['user_id']) : 0;

if ($userId <= 0) {
    jsonError('Valid user ID is required', 400);
}

// Prevent self-deletion
if ($userId == $user['id']) {
    jsonError('Cannot delete your own account', 400);
}

try {
    $pdo = getDB();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch()) {
        jsonError('User not found', 404);
    }
    
    // Delete user (CASCADE will delete their ads)
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    jsonSuccess(null, 'User deleted successfully');
    
} catch (PDOException $e) {
    error_log("Error deleting user: " . $e->getMessage());
    jsonError('Failed to delete user', 500);
} catch (Exception $e) {
    error_log("Error deleting user: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

