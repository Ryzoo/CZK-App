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

        if( $usid ){
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT teams.id as tmid, name FROM teams, team_members WHERE teams.id = team_members.id_team AND team_members.id_user = '.$usid);
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

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT team_members.id as tmmid, firstname, lastname, nr_on_tshirt, id_position, positions.name as posname, is_master FROM teams, team_members, users, user_data, positions WHERE positions.id = team_members.id_position AND teams.id = team_members.id_team AND team_members.id_user = users.id AND users.id = user_data.user_id AND team_members.id_team = '.$id );

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
}
