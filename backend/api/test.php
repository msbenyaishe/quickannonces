<?php
/**
 * Simple test endpoint to verify PHP is executing
 */

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'success' => true,
    'message' => 'PHP is working!',
    'php_version' => phpversion(),
    'timestamp' => date('Y-m-d H:i:s')
]);

