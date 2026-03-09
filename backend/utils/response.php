<?php
/**
 * Standardized JSON Response Helper (InfinityFree-safe)
 */

if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
}

/**
 * Send JSON success response
 */
function jsonSuccess($data = null, $message = 'Success', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Send JSON error response
 */
function jsonError($message = 'Error', $code = 400, $errors = null) {
    http_response_code($code);

    $response = [
        'success' => false,
        'message' => $message
    ];

    if ($errors !== null) {
        $response['errors'] = $errors;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sanitize input (SAFE)
 */
function sanitizeInput($data, $type = 'string') {
    if ($data === null) {
        return null;
    }

    switch ($type) {
        case 'email':
            return filter_var(trim($data), FILTER_SANITIZE_EMAIL);

        case 'int':
            return (int) $data;

        case 'float':
            return (float) $data;

        case 'string':
        default:
            return trim($data); // 🔥 DO NOT escape here
    }
}

/**
 * Validate email format
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Rate limiting (DISABLED on InfinityFree)
 */
function checkRateLimit($identifier) {
    return true; // 🔥 prevent 500 errors
}
