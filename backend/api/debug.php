<?php
/**
 * Debug endpoint to check PHP execution and configuration
 */

// Set JSON header
header('Content-Type: application/json; charset=utf-8');

// Check if we can write to response
$debug = [
    'success' => true,
    'message' => 'PHP is executing correctly!',
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'script_filename' => __FILE__,
    'current_dir' => __DIR__,
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'timestamp' => date('Y-m-d H:i:s'),
    'config_exists' => file_exists(__DIR__ . '/../../config/config.php'),
    'database_config_exists' => file_exists(__DIR__ . '/../../config/database.php'),
];

// Try to include config to check for errors
try {
    if (file_exists(__DIR__ . '/../../config/config.php')) {
        require_once __DIR__ . '/../../config/config.php';
        $debug['config_loaded'] = true;
    } else {
        $debug['config_loaded'] = false;
        $debug['config_error'] = 'Config file not found';
    }
} catch (Exception $e) {
    $debug['config_loaded'] = false;
    $debug['config_error'] = $e->getMessage();
}

// Try database connection
try {
    if (file_exists(__DIR__ . '/../../config/database.php')) {
        require_once __DIR__ . '/../../config/database.php';
        $pdo = getDB();
        $debug['database_connected'] = true;
    } else {
        $debug['database_connected'] = false;
        $debug['database_error'] = 'Database config not found';
    }
} catch (Exception $e) {
    $debug['database_connected'] = false;
    $debug['database_error'] = $e->getMessage();
}

echo json_encode($debug, JSON_PRETTY_PRINT);

