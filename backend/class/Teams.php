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

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT team_members.id as tmmid, firstname, lastname, nr_on_tshirt, position, is_master FROM teams, team_members, users, user_data WHERE teams.id = team_members.id_team AND team_members.id_user = users.id AND users.id = user_data.user_id GROUP BY team_members.id_user' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
}
