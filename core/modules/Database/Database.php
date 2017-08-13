<?php
namespace Core;

use \Simplon\Mysql\PDOConnector;
use \Simplon\Mysql\Mysql;
use \KHerGe\JSON\JSON;

class Database{

    private $dbConn;

    function __construct(){
        $json = new JSON();
        $settings = $json->decodeFile(__DIR__. '\..\..\mainConf.json' );
        $pdo = new PDOConnector(
            $settings->database->host,          // server
            $settings->database->user,          // user
            $settings->database->password,      // password
            $settings->database->dbName         // database
        );
        $pdoConn = $pdo->connect('utf8', []);
        $this->dbConn = new Mysql($pdoConn);
    }

    function getConnection(){
        return $this->dbConn;
    }



}