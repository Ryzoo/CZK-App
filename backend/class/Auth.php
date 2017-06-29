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

        $result = ($this->db->getConnection())->fetchRow('SELECT * FROM users, roles, user_data WHERE user_data.user_id = users.id AND users.id_role = roles.id AND token = :tq', ['tq' => $token]);
        if( !is_null($result) ){
            $data = $result;
        }else{
            $error = "Uzytkownik o podanym tokenie nie istnieje";
            $success = false;
        }
        
        return array( "error"=>$error,"success"=>$success,"data"=>$data );
    }

    function getUserId( $token ){
        $result = ($this->db->getConnection())->fetchRow('SELECT id FROM users WHERE  token = :tq', ['tq' => $token]);
        if( !is_null($result) ){
            return $result["id"];
        }else return false;
    }

    function updateUserData( $post ){
        $file_name = "";
        if( isset($_FILES["userImgFile"]) ){
            $ext = pathinfo($_FILES["userImgFile"]["name"],PATHINFO_EXTENSION);
            $target_dir = __DIR__ . "/../../";
            $file_name = 'img/users/' . $post['token'] . "." . $ext;
            $target_file = $target_dir . $file_name;
            if ($_FILES["userImgFile"]["size"] > 500000) $file_name = "";
            if ($ext != "jpg") $file_name = "";
            if ($file_name != "" ) move_uploaded_file($_FILES["userImgFile"]["tmp_name"], $target_file);
        }

        $condsUsers = [];
        $dataUsers =[];
        
        if( isset($post["token"]) ){
            $userId = $this->getUserId($post["token"]);
            if(!$userId){
                return array( "error"=>"Blad z uwierzytelnieniem" ,"success"=>false,"data"=>null );
            }else $condsUsers['user_id'] = $userId;
            if( isset( $post["firstname"] ) ) $dataUsers["firstname"] = trim($post["firstname"]);
            if( isset( $post["lastname"] ) ) $dataUsers["lastname"] = trim($post["lastname"]);
            if( isset( $post["birthdate"] ) ) $dataUsers["birthdate"] = trim($post["birthdate"]);
            if( isset( $post["mainPosition"] ) ) $dataUsers["main_position"] = trim($post["mainPosition"]);
            if( isset( $post["mainLeg"] ) ) $dataUsers["main_leg"] = trim($post["mainLeg"]);
            if( isset( $post["tel"] ) ) $dataUsers["tel"] = trim($post["tel"]);
            if( isset( $post["parentTel"] ) ) $dataUsers["parent_tel"] = trim($post["parentTel"]);
            if( isset( $post["weight"] ) ) $dataUsers["weight"] = trim($post["weight"]);
            if( isset( $post["height"] ) ) $dataUsers["height"] = trim($post["height"]);
            if( isset( $post["address"] ) ) $dataUsers["address"] = trim($post["address"]);
            
            if( isset( $file_name ) && $file_name != "" ) $dataUsers["user_img_path"] = $file_name;
        }

        $result = ($this->db->getConnection())->update('user_data', $condsUsers, $dataUsers);

        return array( "error"=>"" ,"success"=>true, "data"=>array("url"=>$file_name, "post"=>$post) );
    }

    function checkPerm($token, $perm){
        $result = ($this->db->getConnection())->fetchRow('SELECT roles.name as role FROM users, roles WHERE users.id_role = roles.id AND token = :tq', ['tq' => $token]);
        if( !is_null($result) && $result['role'] == $perm){
            return true;
        }else return false;
    }

}