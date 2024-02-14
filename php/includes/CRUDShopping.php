<?php
require_once("Connection.php");

class Shopping
{
    public function create($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("INSERT INTO shopping (id_user, compra) VALUES (?,?)");
        $stmt->bind_param("is", $data[0], $data[1]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido insertar el usuario.";
        }
    }

    public function getShopping($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $sql = "SELECT * FROM shopping WHERE id_user=$data[0]";
        $result = $mySQL->query($sql);
        if ($result->num_rows > 0) {
            return json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            return "No hay articles";
        }
    }
}
