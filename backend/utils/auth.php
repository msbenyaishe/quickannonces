<?php
/**
 * Authentication Helper Functions
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/response.php';

/**
 * Get current authenticated user from session
 * @return array|null
 */
function getCurrentUser() {
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    try {
        $pdo = getDB();
        $stmt = $pdo->prepare(
            "SELECT id, email, role FROM users WHERE id = ?"
        );
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            session_unset();
            session_destroy();
            return null;
        }

        return $user;
    } catch (Exception $e) {
        error_log("getCurrentUser error: " . $e->getMessage());
        return null;
    }
}

/**
 * Require authentication
 */
function requireAuth($requireAdmin = false) {
    $user = getCurrentUser();

    if (!$user) {
        jsonError('Not authenticated', 401);
    }

    if ($requireAdmin && $user['role'] !== 'admin') {
        jsonError('Admin access required', 403);
    }

    return $user;
}

/**
 * Password helpers
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}
