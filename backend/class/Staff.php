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


class Staff{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getTeamStaff( $tmid ){
        $toReturn = null;
        $success = true;
        $error = "";

        if(!is_null($tmid)){
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT staff.id as stid, staff.name as stname, firstname, lastname, email, tel, user_img_path FROM staff, users, user_data WHERE staff.id_user = users.id AND user_data.user_id = users.id AND staff.id_team = '.$tmid );
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
    function getFullPersonel( $tmid ){
        $toReturn = null;
        $success = true;
        $error = "";

        if(!is_null($tmid)){
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname, roles.name as rlname FROM users, user_data, roles, team_members WHERE user_data.user_id = users.id AND users.id_role = roles.id AND team_members.id_user = users.id AND roles.id != 3 AND team_members.id_team = '.$tmid );
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addStaff($post){
        $toReturn = null;
        $success = true;
        $error = "";

        $token = $post["token"];
        $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));

        if($isAdmin){
            if( isset($post['usid']) && isset($post['name']) && isset($post['tmid'])){
                $usid = $post['usid'];
                $name = $post['name'];
                $tmid = $post['tmid'];
                $data = [
                    'id_user' => $usid,
                    'id_team' => $tmid,
                    'name' => $name,
                ];
                $toReturn = ($this->db->getConnection())->insert('staff', $data);
            }else{
                 $success = false;
                $error  = "Brak potrzebnych danych";
            }
        }else{
            $success = false;
            $error  = "Nie jestes adminem";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteStaff( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["stid"])  )
        {
            $stid = $post["stid"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Brak uprawnień";
                $success = false;
            }else{
                $toReturn = ($this->db->getConnection())->delete('staff', ['id' => $stid]); 
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }


}
