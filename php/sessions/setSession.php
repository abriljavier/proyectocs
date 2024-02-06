<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!$_GET['username'] || $_GET['username'] == '') {
    return false;
}
$username = $_GET['username'];
$_SESSION['username'] = $username;
