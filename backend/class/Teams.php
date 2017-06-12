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
}
