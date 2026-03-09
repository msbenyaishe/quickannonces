<?php
/**
 * Create Ad Endpoint
 * POST /api/ads/create.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';
require_once __DIR__ . '/../../utils/auth.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Require authentication
$user = requireAuth();

// Rate limiting
if (!checkRateLimit($_SERVER['REMOTE_ADDR'] . '_create_ad')) {
    jsonError('Too many requests. Please try again later.', 429);
}

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    jsonError('Invalid JSON input', 400);
}

// Validation
$errors = [];

$title = sanitizeInput($input['title'] ?? '', 'string');
if (empty($title)) {
    $errors['title'] = 'Title is required';
}

$typeAnnonce = sanitizeInput($input['type_annonce'] ?? '', 'string');
if (!in_array($typeAnnonce, ['vente', 'location', 'service'])) {
    $errors['type_annonce'] = 'Valid type is required';
}

$price = isset($input['price']) ? floatval($input['price']) : 0;
if ($price <= 0) {
    $errors['price'] = 'Valid price is required';
}

$city = sanitizeInput($input['city'] ?? '', 'string');
if (empty($city)) {
    $errors['city'] = 'City is required';
}

if (!empty($errors)) {
    jsonError('Validation failed', 400, $errors);
}

$description = sanitizeInput($input['description'] ?? '', 'string') ?: null;
$category = isset($input['category']) ? sanitizeInput($input['category'], 'string') : null;
$subcategory = isset($input['subcategory']) ? sanitizeInput($input['subcategory'], 'string') : null;
$images = isset($input['images']) && is_array($input['images']) ? $input['images'] : [];

try {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        INSERT INTO ads (user_id, title, description, type_annonce, category, subcategory, price, city, images, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");
    
    $imagesJson = json_encode($images);
    $stmt->execute([
        $user['id'],
        $title,
        $description,
        $typeAnnonce,
        $category,
        $subcategory,
        $price,
        $city,
        $imagesJson
    ]);
    
    $adId = $pdo->lastInsertId();
    
    // Fetch created ad
    $stmt = $pdo->prepare("SELECT * FROM ads WHERE id = ?");
    $stmt->execute([$adId]);
    $ad = $stmt->fetch();
    
    $ad['images'] = json_decode($ad['images'] ?? '[]', true) ?: [];
    
    jsonSuccess($ad, 'Ad created successfully', 201);
    
} catch (PDOException $e) {
    error_log("Error creating ad: " . $e->getMessage());
    jsonError('Failed to create ad', 500);
} catch (Exception $e) {
    error_log("Error creating ad: " . $e->getMessage());
    jsonError('An error occurred', 500);
}

