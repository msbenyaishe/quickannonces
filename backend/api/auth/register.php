<?php
/**
 * User Registration Endpoint
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    jsonError('Invalid JSON', 400);
}

$email = sanitizeInput($input['email'] ?? '', 'email');
$password = $input['password'] ?? '';

if (!isValidEmail($email)) {
    jsonError('Invalid email', 400);
}

if (strlen($password) < 6) {
    jsonError('Password must be at least 6 characters', 400);
}

try {
    $pdo = getDB();

    // Check email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonError('Email already exists', 409);
    }

    // Create user
    $hash = hashPassword($password);
    $stmt = $pdo->prepare(
        "INSERT INTO users (email, password_hash, role)
         VALUES (?, ?, 'user')"
    );
    $stmt->execute([$email, $hash]);

    $userId = $pdo->lastInsertId();

    // ✅ SESSION (CRITICAL)
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'user';

    jsonSuccess([
        'id' => $userId,
        'email' => $email,
        'role' => 'user'
    ], 'Registration successful', 201);

} catch (Exception $e) {
    error_log("Register error: " . $e->getMessage());
    jsonError('Registration failed', 500);
}
