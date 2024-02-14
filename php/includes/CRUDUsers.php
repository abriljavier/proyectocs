<?php
require_once("Connection.php");

class Users
{
    public function create($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $data[0]);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return "El nombre de usuario ya está en uso, prueba con otro";
        }

        $stmt = $mySQL->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $data[3]);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return "El correo electrónico ya está registrado, ¿Quizá ha olvidado su contraseña?";
        }
        $mede5 = md5($data[1]);
        $stmt = $mySQL->prepare("INSERT INTO users (username, password, email, rol) VALUES (?,?,?,?)");
        $stmt->bind_param("sssi", $data[0], $mede5, $data[2], $data[3]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido insertar el usuario.";
        }
    }

    public function read()
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $sql = "SELECT * FROM users";
        $result = $mySQL->query($sql);
        $sqlConnection->closeConnection($mySQL);
        if ($result->num_rows > 0) {
            return json_encode($result->fetch_all(MYSQLI_ASSOC));
        } else {
            return "No hay usuarios";
        }
    }

    public function update($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();
        $mede5 = md5($data[2]);
        $stmt = $mySQL->prepare("UPDATE users SET username=?, password=?, email=?, rol=? WHERE id_user=?");
        $stmt->bind_param("ssssi", $data[1], $mede5, $data[3], $data[4], $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido modificar el usuario.";
        }
    }

    public function updateNoPass($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("UPDATE users SET username=?, email=?, rol=? WHERE id_user=?");
        $stmt->bind_param("sssi", $data[1], $data[2], $data[3], $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido modificar el usuario.";
        }
    }

    public function onlyPasswordUptadate($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();
        $mede5 = md5($data[1]);
        $stmt = $mySQL->prepare("UPDATE users SET password=? WHERE id_user=?");
        $stmt->bind_param("si", $mede5, $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return true;
        } catch (Exception $e) {
            return "No se ha podido modificar el usuario.";
        }
    }

    public function delete($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $stmt = $mySQL->prepare("SELECT rol FROM users WHERE id_user = ?");
        $stmt->bind_param("i", $data[0]);
        $stmt->execute();
        $stmt->bind_result($rol);
        $stmt->fetch();
        $stmt->close();
        if ($rol == 0) {
            return "No puedes eliminar a un administrador";
        }

        $stmt = $mySQL->prepare("DELETE FROM users WHERE id_user = ?");
        $stmt->bind_param("i", $data[0]);
        try {
            $stmt->execute();
            $stmt->close();
            $sqlConnection->closeConnection($mySQL);
            return "Usuario eliminado correctamente";
        } catch (Exception $e) {
            return "Error al eliminar el usuario";
        }
    }

    public function getOne($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();
        $sql = "SELECT * FROM users WHERE id_user=$data[0]";
        $result = $mySQL->query($sql);
        $sqlConnection->closeConnection($mySQL);
        return $result->fetch_all(MYSQLI_BOTH);
    }

    public function login($data)
    {
        $sqlConnection = new Connection();
        $mySQL = $sqlConnection->getConnection();

        $mede5 = md5($data[1]);
        $stmt = $mySQL->prepare("SELECT * FROM users WHERE username=? AND password=?");
        $stmt->bind_param("ss", $data[0], $mede5);
        try {
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            if ($result->num_rows === 0) {
                return "Credenciales incorrectas";
            }
            return $result;
        } catch (Exception $e) {
            return "Error en el login";
        }
    }
}
