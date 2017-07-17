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

class Stats{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getStats($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"]) && isset($post["tmid"]) ){
            $usid = $post["usid"];
            $tmid = $post["tmid"];
            $allPotential = ($this->db->getConnection())->fetchRowMany('SELECT * FROM potential');
            for($i=0;$i<count($allPotential);$i++){
                $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
                for($j=0;$j<count($allPotential[$i]['tests']);$j++){
                    $allPotential[$i]['tests'][$j]['scores'] = ($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$allPotential[$i]['tests'][$j]['id'].' AND id_team='.$tmid.' AND id_user='.$usid);
                }
            }
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }


}