<?php
class Connection
{
	private $server = "localhost";
	private $user = "root";
	private $password = "";
	private $db = "ja_proyectocs";
	public function getConnection()
	{
		return $conexion = new mysqli(
			$this->server,
			$this->user,
			$this->password,
			$this->db
		);
	}
	public function closeConnection($conexion)
	{
		$conexion->close();
	}
}
$con = new Connection();
if ($con->getConnection()->connect_error) {
	die($con->getConnection()->connect_error);
}
