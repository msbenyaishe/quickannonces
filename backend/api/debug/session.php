<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

echo json_encode([
    'session_id' => session_id(),
    'session' => $_SESSION
]);
