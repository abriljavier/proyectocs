<?php

require("includes/CRUDCategories.php");

$action = isset($_GET['action']) ? $_GET['action'] : '';
switch ($action) {
    case 'create':
        echo createCategories();
        break;
    case 'read':
        echo readCategories();
        break;
    case 'delete':
        deleteCategories();
        break;
}

function createCategories()
{
    $newCategory = $_GET["newCategory"];
    $data = array($newCategory);
    $dataBase = new Categories();
    $result = $dataBase->create($data);
    if ($result === true) {
        echo true;
    } else {
        echo $result;
    }
}

// function updateCategories($data)
// {
//     $id_user = $_POST['id_user'];
//     $data = array($id_user, $username, $password, $email, $rol);
//     $dataBase = new Users();
//     $result = $dataBase->update($data);
//     if ($result === true) {
//         echo true;
//     } else {
//         echo $result;
//     }
// }

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
