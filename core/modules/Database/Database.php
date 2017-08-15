<?php
namespace Core;

use \Simplon\Mysql\PDOConnector;
use \Simplon\Mysql\Mysql;
use Core\Settings;

class Database{

    private $dbConn;

    function __construct(){
        
    }

    function getConnection(){
        $settings = (new Settings())->getDatabaseConfig();
        $pdo = new PDOConnector(
            $settings->host,          // server
            $settings->user,          // user
            $settings->password,      // password
            $settings->dbName         // database
        );
        $pdoConn = $pdo->connect('utf8', []);
        $this->dbConn = new Mysql($pdoConn);
        return $this->dbConn;
    }



}