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
        $error = "";
        $success = true;
        $condsUsers = [];
        $dataUsers =[];
        $file_name = "";

        
        
        
        if( isset($post["token"]) ){
            $userId = $this->getUserId($post["token"]);

            if(!$userId){
                return array( "error"=>"Blad z uwierzytelnieniem" ,"success"=>false,"data"=>null );
            }
            // update password
            $condsUsers['id'] = $userId;
            if(isset($post["password"])&&isset($post["rePassword"])){
                $pass = trim($post["password"]);
                $rePass = trim($post["rePassword"]);
                if(strlen($pass) != 0){
                    if($pass == $rePass && strlen($pass) >= 5 ){
                        $newPassword = md5($pass);
                        $dataUsers = [];
                        $dataUsers["password"] = $newPassword;
                        ($this->db->getConnection())->update('users', $condsUsers, $dataUsers);
                    }else{
                        return array( "error"=>"Podane hasła różnią się lub są krótsze niż 5 znkaów" ,"success"=>false,"data"=>null );
                    }
                }
            }
            $condsUsers = [];
            $condsUsers['user_id'] = $userId;
            $dataUsers = [];

            //img change
            if( isset($_FILES["userImgFile"]) ){
                $ext = pathinfo($_FILES["userImgFile"]["name"],PATHINFO_EXTENSION);
                $target_dir = __DIR__ . "/../../";
                $file_name = 'img/users/' . trim($post['userEmail']) . trim($post['lastname']) . "." . $ext;
                $target_file = $target_dir . $file_name;
                if($_FILES["userImgFile"]["size"] >= 25){
                    if ($_FILES["userImgFile"]["size"] <= 2500000){
                        if (($ext == "jpg" || $ext == "png" || $ext == "jpeg")){
                            if(!move_uploaded_file($_FILES["userImgFile"]["tmp_name"], $target_file)){
                                return array( "error"=>"Nie udało się skopiowac: " . $_FILES["userImgFile"]['name'] ,"success"=>false,"data"=>null );
                            }else{
                                if( isset( $file_name ) && $file_name != "" ) $dataUsers["user_img_path"] = $file_name;
                            }
                        }else{
                            return array( "error"=>"Błędne rozszerzenie zdjęcia" ,"success"=>false,"data"=>null );
                        }
                    }else{
                        return array( "error"=>"Zbyt duże zdjęcie" ,"success"=>false,"data"=>null );
                    }
                }else $file_name = '';
            }

            if( isset( $post["firstname"] ) ) $dataUsers["firstname"] = trim($post["firstname"]);
            if( isset( $post["lastname"] ) ) $dataUsers["lastname"] = trim($post["lastname"]);
            if( isset( $post["birthdate"] ) ) $dataUsers["birthdate"] = trim($post["birthdate"]);
            if( isset( $post["mainPosition"] ) ) $dataUsers["main_position"] = trim($post["mainPosition"]);
            if( isset( $post["bodyType"] ) ) $dataUsers["body_type"] = trim($post["bodyType"]);
            if( isset( $post["mainLeg"] ) ) $dataUsers["main_leg"] = trim($post["mainLeg"]);
            if( isset( $post["tel"] ) ) $dataUsers["tel"] = trim($post["tel"]);
            if( isset( $post["parentTel"] ) ) $dataUsers["parent_tel"] = trim($post["parentTel"]);
            if( isset( $post["weight"] ) ) $dataUsers["weight"] = trim($post["weight"]);
            if( isset( $post["height"] ) ) $dataUsers["height"] = trim($post["height"]);
            if( isset( $post["address"] ) ) $dataUsers["address"] = trim($post["address"]);
        }else{
            return array( "error"=>"Brak danych" ,"success"=>false,"data"=>null );
        }

        $result = ($this->db->getConnection())->update('user_data', $condsUsers, $dataUsers);

        return array( "error"=>$error ,"success"=>$success, "data"=>array("url"=>$file_name, "post"=>$post) );
    }

    function checkPerm($token, $perm){
        $result = ($this->db->getConnection())->fetchRow('SELECT roles.name as role FROM users, roles WHERE users.id_role = roles.id AND token = :tq', ['tq' => $token]);
        if( !is_null($result) && $result['role'] == $perm){
            return true;
        }else return false;
    }

    function checkIsLoged($token){
        $error = "";
        $success = true;
        $data = array();

        $result = ($this->db->getConnection())->fetchRow('SELECT id FROM users WHERE token = :tq', ['tq' => $token]);
        if( !is_null($result) ){
            $data = $result;
        }else{
            $error = "Uzytkownik o podanym tokenie nie istnieje";
            $success = false;
        }
        
        return array( "error"=>$error,"success"=>$success,"data"=>$data );
    }

}