<?php
require_once("Connection.php");

class Categories
{
    public function create($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("SELECT * FROM categories WHERE category = ?");
        $stmt->bind_param("s", $data[0]);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return "Ya existe esa categoria";
        }

        $stmt = $mySQL->prepare("INSERT INTO categories (category) VALUES (?)");
        $stmt->bind_param("s", $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido insertar la categoria.";
        }
    }

    public function read()
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $sql = "SELECT * FROM categories";
        $result = $mySQL->query($sql);
        $sqlConnection->closeConnection($mySQL);
        if ($result->num_rows > 0) {
            return json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            return "No hay categorias";
        }
    }

    public function update($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("UPDATE categories SET category=? WHERE id_category=?");
        $stmt->bind_param("si", $data[1], $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido modificar la categoria.";
        }
    }

    public function delete($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("SELECT COUNT(*) FROM articles WHERE id_category = ?");
        $stmt->bind_param("i", $data[0]);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if ($count > 0) {
            return "Existen productos asociados a esa categoria, no se puede borrar";
        }

        $stmt = $mySQL->prepare("DELETE FROM categories WHERE id_category = ?");
        $stmt->bind_param("i", $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return "Categoria eliminada correctamente";
        } catch (Exception $e) {
            return "Error al eliminar la categoria";
        }
    }

    public function getOne($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();
        $sql = "SELECT * FROM categories WHERE id_category=$data[0]";
        $result = $mySQL->query($sql);
        $sqlConnection->closeConnection($mySQL);
        return $result->fetch_all(MYSQLI_BOTH);
    }
}
