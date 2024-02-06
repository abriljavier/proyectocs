<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['username'])) {
    echo "No hay sesión";
    exit;
} else {
    echo "Sesión ok";
}
