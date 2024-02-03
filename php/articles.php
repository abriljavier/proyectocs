<?php
include("./includes/conexion.php");
$conexion->set_charset('utf8');

// MANEJAR LAS PETICIONES DE USUARIOS
$action = isset($_GET['action']) ? $_GET['action'] : '';
switch ($action) {
    case 'create':
        $data = $_GET['data'];
        if ($sql = $conexion->query("INSERT INTO articles (id_article, name, brand, price, stock, description, details, img, id_category) VALUES (NULL, '$data[0]', '$data[1]', '$data[2]', '$data[3]', '$data[4]', '$data[5]', '$data[6]', '$data[7]')")) {
            echo "success";
        } else {
            echo "error";
        }
        break;
    case 'read':
        $sql = $conexion->query("SELECT * FROM articles JOIN categories ON categories.id_category=articles.id_category ORDER BY id_article");
        $jsonData = array();
        while ($row = mysqli_fetch_assoc($sql)) {
            $jsonData[] = $row;
        }
        echo json_encode($jsonData);
        include("./includes/conexion.php");
        $conexion->set_charset('utf8');
        break;
    case 'delete':
        $id = $_GET['id'];
        if ($sql = $conexion->query("DELETE FROM articles WHERE id_article = '$id'")) {
            echo "borrado ok";
        } else {
            echo "error";
        }
    case 'update':
        $data = $_GET['data'];
        if ($sql = $conexion->query("UPDATE articles SET name='$data[1]', brand='$data[2]', price='$data[3]', stock='$data[4]', description='$data[5]', details='$data[6]', img='$data[7]', id_category='$data[8]' WHERE id_article=$data[0];")) {
            echo "success";
        } else {
            echo "error";
        }
        break;

    default:
        break;
}

$conexion->close();
