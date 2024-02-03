<?php

require("includes/CRUDUsers.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    switch ($action) {
        case 'create':
            echo createUser();
            break;
        case 'login':
            echo loginUser();
            break;
    }
} else {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    switch ($action) {
        case 'read':
            echo readUser();
            break;
        case 'delete':
            deleteUser();
            break;
    }
}

function createUser()
{
    $username = $_POST["username"];
    $password = $_POST["password"];
    $email = $_POST["email"];
    $rol = isset($_POST['rol']) ? $_POST['rol'] : 1;
    if ($_POST['id_user'] == '') {
        $data = array($username, $password, $email, $rol);
        $dataBase = new Users();
        $result = $dataBase->create($data);
        if ($result === true) {
            echo true;
        } else {
            echo $result;
        }
    } else {
        $id_user = $_POST['id_user'];
        $data = array($id_user, $username, $password, $email, $rol);
        $dataBase = new Users();
        $result = $dataBase->update($data);
        if ($result === true) {
            echo true;
        } else {
            echo $result;
        }
    }
}

function loginUser()
{
    $username = $_POST["username"];
    $password = $_POST["password"];
    $data = array($username, $password);
    $dataBase = new Users();
    $result = $dataBase->login($data);
    if ($result === "Credenciales incorrectas" || $result === "Error en el login") {
        echo $result;
    } else {
        $userData = $result->fetch_assoc();
        echo json_encode($userData);
    }
}

function readUser()
{
    $dataBase = new Users();
    $result = $dataBase->read();

    if ($result === "No hay usuarios") {
        echo $result;
    } else {
        $userData = json_decode($result, true);
        echo json_encode($userData);
    }
}

function deleteUser()
{
    $userId = $_GET['id_user'];
    $dataBase = new Users();
    $result = $dataBase->delete([$userId]);
    echo $result;
}
