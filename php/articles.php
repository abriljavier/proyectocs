<?php

require("includes/CRUDArticles.php");

$action = isset($_GET['action']) ? $_GET['action'] : '';
switch ($action) {
    case 'create':
        echo createArticles();
        break;
    case 'update':
        echo updateArticles();
        break;
    case 'read':
        echo readArticles();
        break;
    case 'delete':
        echo deleteArticles();
        break;
}

function createArticles()
{
    $name = $_GET['data'][0];
    $brand = $_GET['data'][1];
    $price = $_GET['data'][2];
    $stock = $_GET['data'][3];
    $description = $_GET['data'][4];
    $details = $_GET['data'][5];
    $img = $_GET['data'][6];
    $id_category = $_GET['data'][7];
    $data = array($name, $brand, $price, $stock, $description, $details, $img, $id_category);
    $dataBase = new Articles();
    $result = $dataBase->create($data);
    if ($result === true) {
        echo true;
    } else {
        echo $result;
    }
}

function updateArticles()
{
    $id_article = $_GET['data'][0];
    $name = $_GET['data'][1];
    $brand = $_GET['data'][2];
    $price = $_GET['data'][3];
    $stock = $_GET['data'][4];
    $description = $_GET['data'][5];
    $details = $_GET['data'][6];
    $img = $_GET['data'][7];
    $id_category = $_GET['data'][8];
    $data = array($id_article, $name, $brand, $price, $stock, $description, $details, $img, $id_category);
    $dataBase = new Articles();
    $result = $dataBase->update($data);
    if ($result === true) {
        echo true;
    } else {
        echo $result;
    }
}

function readArticles()
{
    $dataBase = new Articles();
    $result = $dataBase->read();

    if ($result === "No hay articulos") {
        echo $result;
    } else {
        $articlesData = json_decode($result, true);
        echo json_encode($articlesData);
    }
}

function deleteArticles()
{
    $id_article = $_GET['id'];
    $dataBase = new Articles();
    $result = $dataBase->delete([$id_article]);
    echo $result;
}
