<?php

require("includes/CRUDCategories.php");

$action = isset($_GET['action']) ? $_GET['action'] : '';
switch ($action) {
    case 'create':
        echo createCategories();
        break;
    case 'update':
        echo updateCategories();
        break;
    case 'read':
        echo readCategories();
        break;
    case 'delete':
        echo deleteCategories();
        break;
}

function createCategories()
{
    $categoryName = $_GET["categoryName"][0];
    $data = array($categoryName);
    $dataBase = new Categories();
    $result = $dataBase->create($data);
    if ($result === true) {
        echo true;
    } else {
        echo $result;
    }
}

function updateCategories()
{
    $categorieData = $_GET['data'];
    // $data = array($id_user, $username, $password, $email, $rol);
    $dataBase = new Categories();
    $result = $dataBase->update($categorieData);
    if ($result === true) {
        echo true;
    } else {
        echo $result;
    }
}

function readCategories()
{
    $dataBase = new Categories();
    $result = $dataBase->read();

    if ($result === "No hay categorias") {
        echo $result;
    } else {
        $categoriesData = json_decode($result, true);
        echo json_encode($categoriesData);
    }
}

function deleteCategories()
{
    $categoriesId = $_GET['id'];
    $dataBase = new Categories();
    $result = $dataBase->delete([$categoriesId]);
    echo $result;
}
