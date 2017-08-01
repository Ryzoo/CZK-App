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


class Teams{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    // pobiera teamy od usera o podanym tokenie
    function getTeamsByToken( $token ){
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $this->auth->getUserId($token);
        $isKoord = (($this->auth)->checkPerm($token,"KOORD"));

        if( $usid ){
            if($isKoord){
                $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT teams.id as tmid, name FROM teams');
            }else{
                $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT teams.id as tmid, name FROM teams, team_members WHERE teams.id = team_members.id_team AND team_members.id_user = '.$usid);
            }
        }
        else{
            $success = false;
            $error = "bledny token";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getUserFromTeam( $id ){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, team_members.id as tmmid, firstname, lastname, nr_on_tshirt, id_position, positions.name as posname, is_master FROM teams, team_members, users, user_data, positions, roles WHERE positions.id = team_members.id_position AND teams.id = team_members.id_team AND team_members.id_user = users.id AND users.id = user_data.user_id AND users.id_role = 3 AND team_members.id_team = '.$id.' GROUP BY usid' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }


    function getAllPosition(){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM positions' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function changeCollection($post){
        $toReturn = null;
        $success = true;
        $error = "";
        $condsUsers = [];
        $dataUsers = [];

        if( isset($post['tmmid']) && isset($post['val']) && isset($post['type']) ){
            $condsUsers['id'] = $post['tmmid'];
            $dataUsers[$post['type']] = $post['val'];
            $result = ($this->db->getConnection())->update('team_members', $condsUsers, $dataUsers);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllTeams(){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM teams' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTeam($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["name"]) && isset($post["token"]))
        {
            $name = $post["name"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                $data = [
                    'name' => $name
                ];
                $toReturn = ($this->db->getConnection())->insert('teams', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllMastersFromTeam($tmid){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname FROM `team_members`, users, user_data WHERE users.id = user_data.user_id AND users.id = team_members.id_user AND users.id_role = 2 AND team_members.id_team = '.$tmid );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteTeam($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["id"]) && isset($post["token"]) )
        {
            $id = $post["id"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnień";
                $success = false;
            }else{
                $toReturn = ($this->db->getConnection())->delete('user_notifications', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('staff', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('raports', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('potential_score', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('events', ['id_team' => $id]);

                $cm = ($this->db->getConnection())->fetchRowMany('SELECT posts.id as psid FROM posts WHERE posts.id_team = '.$id);
                for ($i=0; $i <count($cm) ; $i++) { 
                    ($this->db->getConnection())->delete('comments', ['id_post' => $cm[$i]]);
                }

                $toReturn = ($this->db->getConnection())->delete('posts', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('team_members', ['id_team' => $id]);
                $toReturn = ($this->db->getConnection())->delete('teams', ['id' => $id]);
                
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteMasterFromTeam($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["mid"]) && isset($post["tmid"]) )
        {
            $mid = $post["mid"];
            $tmid = $post["tmid"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnień";
                $success = false;
            }else{
                $toReturn = ($this->db->getConnection())->delete('team_members', ['id_team' => $tmid,'id_user' =>$mid]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addMasterToTeam($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["tmid"]) && isset($post["mid"]))
        {
            $tmid = $post["tmid"];
            $mid = $post["mid"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                $data = [
                    'id_user' => $mid,
                    'id_team' => $tmid,
                ];

                $cm = ($this->db->getConnection())->fetchRowMany('SELECT id FROM team_members WHERE id_team = '.$tmid . ' AND id_user = '.$mid);
                if( $cm != null ){
                    $error = "Ten trener jest już w drużynie";
                    $success = false;
                }else{
                    $toReturn = ($this->db->getConnection())->insert('team_members', $data);
                }
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
}
