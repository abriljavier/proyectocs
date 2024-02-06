<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (session_destroy()) {
    echo "sesión destruida";
} else {
    echo "error en la destrucción de la sesión";
}
