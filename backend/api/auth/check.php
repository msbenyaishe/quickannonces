<?php
/**
 * Check Authentication Status Endpoint
 * GET /api/auth/check.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$user = getCurrentUser();

if ($user) {
    jsonSuccess([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ], 'Authenticated');
} else {
    jsonError('Not authenticated', 401);
}

