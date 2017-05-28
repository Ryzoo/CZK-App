<?php

require __DIR__ . '/../vendor/autoload.php';

use \Simplon\Mysql\PDOConnector;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\MysqlException;
use \Simplon\Mysql\QueryBuilder\CreateQueryBuilder;
use \Simplon\Mysql\QueryBuilder\DeleteQueryBuilder;
use \Simplon\Mysql\QueryBuilder\ReadQueryBuilder;
use \Simplon\Mysql\QueryBuilder\UpdateQueryBuilder;
use \KHerGe\JSON\JSON;

class Database{

    private $dbConn;

    function __construct(){
        $json = new JSON();
        $settings = $json->decodeFile(__DIR__. '/../mainConf.json' );
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