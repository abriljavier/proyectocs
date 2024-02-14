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
        case 'update':
            echo update();
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
    // $password = $_POST["password"];
    $password = isset($_POST["password"]) ? $_POST['password'] : '';
    $email = $_POST["email"];
    $rol = isset($_POST['rol']) ? $_POST['rol'] : 1;
    if (!isset($_POST['id_user']) || $_POST['id_user'] == '') {
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
        if (!isset($_POST['password']) || $_POST['password'] == '') {
            $data = array($id_user, $username, $email, $rol);
            $dataBase = new Users();
            $result = $dataBase->updateNoPass($data);
            if ($result === true) {
                echo true;
            } else {
                echo $result;
            }
        } else {
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

        session_start();
        $_SESSION['username'] = $userData['username'];

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

function update()
{
    $password = $_POST['password'];
    $id = $_POST['id'];
    $dataBase = new Users();
    $result = $dataBase->onlyPasswordUptadate([$id, $password]);
    echo $result;
}
