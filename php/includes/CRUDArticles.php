<?php

require_once("Connection.php");

class Articles
{
    public function create($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("INSERT INTO articles (name, brand, price, stock, description, details, img, id_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssddisss", $data[0], $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido insertar el artículo.";
        }
    }

    public function read()
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $sql = "SELECT * FROM articles JOIN categories ON categories.id_category=articles.id_category ORDER BY id_article DESC";
        $result = $mySQL->query($sql);
        $sqlConnection->closeConnection($mySQL);
        if ($result->num_rows > 0) {
            return json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            return "No hay articles";
        }
    }

    public function update($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("UPDATE articles SET name = ?, brand = ?, price = ?, stock = ?, description = ?, details = ?, img = ?, id_category = ? WHERE id_article=?");
        $stmt->bind_param("ssdisssii", $data[1], $data[2], $data[3], $data[4], $data[5], $data[6], $data[7], $data[8], $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido modificar el artículo";
        }
    }

    public function delete($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("DELETE FROM articles WHERE id_article = ?");
        $stmt->bind_param("i", $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return "Articulo eliminado correctamente";
        } catch (Exception $e) {
            return "Error al eliminar el artículo";
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

    public function updateStock($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("SELECT id_article, name, stock FROM articles WHERE id_article = ?");
        $stmt->bind_param("i", $data[0]);

        try {
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $article = $result->fetch_assoc();

                if ($article['stock'] >= $data[1]) {
                    $stmt = $mySQL->prepare("UPDATE articles SET stock = stock - ? WHERE id_article = ?");
                    $stmt->bind_param("ii", $data[1], $data[0]);
                    $stmt->execute();
                    $stmt->close();
                    $sqlConnection->closeConnection($mySQL);
                    return true;
                } else {
                    return false;
                }
            } else {
                $stmt->close();
                $sqlConnection->closeConnection($mySQL);
                return false;
            }
        } catch (Exception $e) {
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return false;
        }
    }
}
