<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Access-Control-Allow-Origin: https://your-site.infinityfreeapp.com");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// TEMP: disable rate limit for testing
// if (!checkRateLimit($_SERVER['REMOTE_ADDR'] . '_login')) {
//     jsonError('Too many requests. Please try again later.', 429);
// }

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonError('Invalid JSON input', 400);
}

$email = sanitizeInput($input['email'] ?? '', 'email');
$password = $input['password'] ?? '';
$isAdminLogin = isset($input['is_admin']) && $input['is_admin'] === true;

if (empty($email) || !isValidEmail($email)) {
    jsonError('Valid email is required', 400);
}

if (empty($password)) {
    jsonError('Password is required', 400);
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare("SELECT id, email, password_hash, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !verifyPassword($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }

    if ($isAdminLogin && $user['role'] !== 'admin') {
        jsonError('Admin access required', 403);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    jsonSuccess([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ], 'Login successful');

} catch (Throwable $e) {
    error_log("Login error: " . $e->getMessage());
    jsonError('Login failed', 500);
}
