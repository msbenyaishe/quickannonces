<?php
/**
 * User Logout Endpoint
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../utils/response.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Destroy session
session_destroy();

jsonSuccess(null, 'Logout successful');

