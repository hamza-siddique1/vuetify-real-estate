<?php
// router.php — place this in the same folder you run php -S from

// Allow CORS for your Vue dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Serve the requested file
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = __DIR__ . $uri;

if (file_exists($path) && is_file($path)) {
    readfile($path);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
}
