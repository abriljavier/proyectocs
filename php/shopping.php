<?php

require("includes/CRUDShopping.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    switch ($action) {
        case 'create':
            echo createShopping();
            break;
        case 'read':
            echo getShopping();
            break;
    }
} else {
}


function createShopping()
{
    $userID = $_POST['userid'];
    $compra = $_POST['compra'];
    $data = array($userID, $compra);
    $dataBase = new Shopping();
    $result = $dataBase->create($data);
    if ($result == true) {
        echo true;
    } else {
        echo $result;
    }
}

function getShopping()
{
    $userID = $_POST['userId'];
    $dataBase = new Shopping();
    $result = $dataBase->getShopping([$userID]);
    if ($result === "No hay articles") {
        echo $result;
    } else {
        $articlesData = json_decode($result, true);
        echo json_encode($articlesData);
    }
}
