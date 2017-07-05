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

class Players{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getAllPlayers( $tmid ){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname, roles.name as roleName FROM team_members, users, user_data, roles WHERE users.id_role = roles.id AND team_members.id_user = users.id AND users.id = user_data.user_id AND id_team = '.$tmid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addPerson( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["lname"]) && isset($post["fname"]) && isset($post["mail"]) && isset($post["tmid"]) && isset($post["isPersonel"]) )
        {
            $lname = $post["lname"];
            $fname = $post["fname"];
            $mail = $post["mail"];
            $tmid = $post["tmid"];
            $token = $post["token"];
            $isPersonel = $post["isPersonel"];
            $role = ($isPersonel == "true" ? 4 : 3);
            $idUser = ($this->auth)->getUserId($token);
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            $newPassword = md5( $lname . random_int(1, 100) . $token );

            $toReturn = ($this->db->getConnection())->fetchRowMany("SELECT id FROM users WHERE email = '".$mail."'");
            if( $toReturn != null ){
                $error = "Dany adres email istnieje już w bazie";
                $success = false;
                return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
            }     

            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                if($isAdmin){
                    $data = [
                        'email'   => $mail,
                        'password'  => md5($newPassword),
                        'id_role' => $role,
                        'create_account_date'  => date("Y-m-d H:i:s")
                    ];
                    $newPersonId = ($this->db->getConnection())->insert('users', $data);
                    if( isset($newPersonId) && $newPersonId >= 0 ){
                        $data = [
                            'user_id'   => $newPersonId,
                            'firstname'  => $fname ,
                            'lastname' => $lname,
                        ];
                        $user_data = ($this->db->getConnection())->insert('user_data', $data);
                        if( isset($user_data) && $user_data >= 0 ){
                            $data = [
                                'id_user'   => $newPersonId,
                                'id_team'  => $tmid
                            ];
                            $teamMembersId = ($this->db->getConnection())->insert('team_members', $data);
                            if( !isset($user_data) || $user_data == null ){
                                $error = "Nie udało się przypisać osoby do teamu";
                                $success = false;
                            }
                            $toReturn = $isPersonel;
                            try{
                                $message = "Witaj ".$fname." ".$lname."\r\nTwoje konto zostało właśnie utworzone \r\nMożesz się zalogować używając tego adresu email oraz hasła: <strong>".$newPassword."</strong>";
                                mail($mail, 'Utworzono Twoje konto', $message);
                            }catch(Exception $e){
                                $toReturn = 'Nie udało się wysłać meila z hasłem';
                            }
                        }else{
                            $error = "Nie udało się dodać danych użytkownika";
                            $success = false;
                        }

                    }else{
                        $error = "Nie udało się dodać użytkownika";
                        $success = false;
                    }
                    
                }else{
                    $error = "Uzytkownik o danym tokenie nie ma uprawnień";
                    $success = false;
                }
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllUserData( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"])){
            $usid = $post["usid"];
            $toReturn = ($this->db->getConnection())->fetchRow('SELECT *  FROM users, user_data, roles WHERE users.id_role = roles.id  AND users.id = user_data.user_id AND users.id = '.$usid);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteUser( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"]))
        {
            $usid = $post["usid"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( $isAdmin ){
                ($this->db->getConnection())->delete('user_data', ['user_id' => $usid]);
                ($this->db->getConnection())->delete('team_members', ['id_user' => $usid]);
                ($this->db->getConnection())->delete('comments', ['id_user' => $usid]);
                ($this->db->getConnection())->delete('posts', ['id_user' => $usid]);
                ($this->db->getConnection())->delete('staff', ['id_user' => $usid]);
                ($this->db->getConnection())->delete('users', ['id' => $usid]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}