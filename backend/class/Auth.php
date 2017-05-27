<?php
require __DIR__ . '\..\vendor\autoload.php';

use \Simplon\Mysql\PDOConnector;
use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\MysqlException;
use \Simplon\Mysql\QueryBuilder\CreateQueryBuilder;
use \Simplon\Mysql\QueryBuilder\DeleteQueryBuilder;
use \Simplon\Mysql\QueryBuilder\ReadQueryBuilder;
use \Simplon\Mysql\QueryBuilder\UpdateQueryBuilder;
use \KHerGe\JSON\JSON;

class Auth{
    private $dbConn;
    function __construct(){
        $json = new JSON();
        $settings = $json->decodeFile(__DIR__. '\..\mainConf.json' );
        $pdo = new PDOConnector(
            $settings->database->host,          // server
            $settings->database->user,          // user
            $settings->database->password,      // password
            $settings->database->dbName         // database
        );
        $pdoConn = $pdo->connect('utf8', []);
        $this->dbConn = new Mysql($pdoConn);
    }

    function login( $email, $password ){
        $error = "";
        $success = true;
        $token = "";
        $result = $this->dbConn->fetchColumn('SELECT password FROM users WHERE email = :email', ['email' => $email]);
        if( !is_null($result) ){
            $password = md5($password);
            if( $result === $password ){
                $token = md5(uniqid($email, true));
                $conds = [ 'email' => $email, ];
                $data = [ 'token' => $token, ];
                if(!$this->dbConn->update('users', $conds, $data)){
                    $error = "Problem z tokenem";
                    $success = false;
                }
            }else{
                $error = "Błędne hasło";
                $success = false;
            }
        }else{
            $error = "Błędny adres email";
            $success = false;
        }
        return array( "error"=>$error,"success"=>$success,"token"=>$token );
    }

}