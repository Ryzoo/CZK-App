<?php
namespace Core\Auth;

use Core\Database\Database;

class Auth {
    public $db;

    function __construct(){
        $this->db = new Database();
    }

    function login( $data ){
        $error = '';
        $success = true;
        $email =$data['email'];
        $password =$data['pass'];
        $token='';

        $result = ($this->db->getConnection())->fetchColumn('SELECT password FROM users WHERE email = :email', ['email' => $email]);
        if( !is_null($result) ){
            $password = md5($password);
            if( $result === $password ){
                $token = md5(uniqid($email, true));
                $conds = [ 'email' => $email, ];
                $data = [ 
                    'token' => $token,
                    "last_login_date" => date("Y-m-d H:i:s")
                ];
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

    function getUserData( $data ){
        $token = $data['token'];
        $error = "";
        $success = true;

        $result = ($this->db->getConnection())->fetchRow('SELECT * FROM users, roles, user_data WHERE user_data.user_id = users.id AND users.id_role = roles.id AND token = :tq', ['tq' => $token]);
        if( is_null($result) ){
            $error = "Uzytkownik o podanym tokenie nie istnieje";
            $success = false;
        }        
        
        return array( "error"=>$error,"success"=>$success,"data"=>$result );
    }

    function getUserId( $token ){
        $result = ($this->db->getConnection())->fetchRow('SELECT id FROM users WHERE  token = :tq', ['tq' => $token]);
        if( !is_null($result) ){
            return $result["id"];
        }else return false;
    }

    function updateUserData( $data ){
        $error = "";
        $success = true;
        $condsUsers = [];
        $dataUsers =[];
        $file_name = "";
        $userId = $this->getUserId($data["token"]);
        
        // update password
        $condsUsers['id'] = $userId;
        if(isset($data["password"])&&isset($data["rePassword"])){
            $pass = trim($data["password"]);
            $rePass = trim($data["rePassword"]);
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
            $target_dir = __DIR__ . "/../../../";
            $file_name = 'files/img/users/' . trim($data['firstname']) . trim($data['lastname']) . "." . $ext;
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

        if( isset( $data["firstname"] ) ) $dataUsers["firstname"] = trim($data["firstname"]);
        if( isset( $data["lastname"] ) ) $dataUsers["lastname"] = trim($data["lastname"]);
        if( isset( $data["birthdate"] ) ) $dataUsers["birthdate"] = trim($data["birthdate"]);
        if( isset( $data["mainPosition"] ) ) $dataUsers["main_position"] = trim($data["mainPosition"]);
        if( isset( $data["bodyType"] ) ) $dataUsers["body_type"] = trim($data["bodyType"]);
        if( isset( $data["mainLeg"] ) ) $dataUsers["main_leg"] = trim($data["mainLeg"]);
        if( isset( $data["tel"] ) ) $dataUsers["tel"] = trim($data["tel"]);
        if( isset( $data["parentTel"] ) ) $dataUsers["parent_tel"] = trim($data["parentTel"]);
        if( isset( $data["weight"] ) ) $dataUsers["weight"] = trim($data["weight"]);
        if( isset( $data["height"] ) ) $dataUsers["height"] = trim($data["height"]);
        if( isset( $data["address"] ) ) $dataUsers["address"] = trim($data["address"]);
        if( isset( $data["license_type"] ) ) $dataUsers["license_type"] = trim($data["license_type"]);

        $result = ($this->db->getConnection())->update('user_data', $condsUsers, $dataUsers);

        return array( "error"=>$error ,"success"=>$success, "data"=>array("url"=>$file_name, "post"=>$data) );
    }

    function getUserNameImg($usid){
        $data = $result = ($this->db->getConnection())->fetchRow('SELECT user_data.firstname, user_data.lastname, user_img_path FROM users, roles, user_data WHERE user_data.user_id = users.id AND users.id_role = roles.id AND users.id = :id', ['id' => $usid]);
        return [
            "name" => $data['firstname']. " ".$data['lastname'],
            "img" => $data['user_img_path']
        ];
    }

    function checkPerm($token, $perm){
        $result = ($this->db->getConnection())->fetchRow('SELECT roles.name as role FROM users, roles WHERE users.id_role = roles.id AND token = :tq', ['tq' => $token]);
        if( !is_null($result)){
            if( is_array($perm) ){
                for ($i=0; $i < count($perm); $i++) { 
                    if( $result['role'] === $perm[$i] ) return true;
                }
            }else{
                if( $result['role'] === $perm ) return true;
            }
            return false;
        }else return false;
    }

    function checkIsLoged($data){
        $token = $data['token'];
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