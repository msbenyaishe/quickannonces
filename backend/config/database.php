<?php
/**
 * Database Configuration
 * Compatible with InfinityFree MySQL
 */

// Database credentials (update these with your InfinityFree credentials)
define('DB_HOST', 'sql210.infinityfree.com');
define('DB_NAME', 'if0_40816740_quickannoncereact'); // Update this
define('DB_USER', 'if0_40816740'); // Update this
define('DB_PASS', 'At2bidNxKB'); // Update this
define('DB_CHARSET', 'utf8mb4');

/**
 * Get PDO database connection
 * @return PDO
 * @throws PDOException
 */
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    return $pdo;
}

