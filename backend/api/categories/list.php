<?php
/**
 * Get Categories Endpoint
 * GET /api/categories/list.php
 */

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/response.php';

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

// Temporary static categories (Can later be moved to the database)
$categories = [
    [ "id" => "1", "name" => "vehicles", "label" => "🚗 Vehicles" ],
    [ "id" => "2", "name" => "real-estate", "label" => "🏠 Real Estate" ],
    [ "id" => "3", "name" => "electronics", "label" => "💻 Electronics" ],
    [ "id" => "4", "name" => "clothing", "label" => "👗 Clothing" ],
    [ "id" => "5", "name" => "jobs", "label" => "🧑‍💼 Jobs" ],
];

jsonSuccess($categories, 'Categories retrieved successfully');
