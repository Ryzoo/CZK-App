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


class Auth{
    private $db;

    function __construct(){
        $this->db = new Database();
    }

    function login( $email, $password ){
        $error = "";
        $success = true;
        $token = "";
        $result = ($this->db->getConnection())->fetchColumn('SELECT password FROM users WHERE email = :email', ['email' => $email]);
        if( !is_null($result) ){
            $password = md5($password);
            if( $result === $password ){
                $token = md5(uniqid($email, true));
                $conds = [ 'email' => $email, ];
                $data = [ 'token' => $token, ];
                if(!(($this->db->getConnection())->update('users', $conds, $data))){
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

    function getUserData( $token ){
        $error = "";
        $success = true;
        $data = array();

        $result = ($this->db->getConnection())->fetchRow('SELECT email, roles.name as name FROM users JOIN roles ON roles.id = users.id_role WHERE token = :tq', ['tq' => $token]);
        if( !is_null($result) ){
            $data = $result;
        }else{
            $error = "Uzytkownik o podanym tokenie nie istnieje";
            $success = false;
        }
        
        return array( "error"=>$error,"success"=>$success,"data"=>$data );
    }

    function checkStillLogged( $email, $token ){

    }

    function checkPermission( $email, $token, $perm){

    }

}