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
                $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best, worst FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
                for($j=0;$j<count($allPotential[$i]['tests']);$j++){
                    $allPotential[$i]['tests'][$j]['scores'] = ($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$allPotential[$i]['tests'][$j]['id'].' AND id_team='.$tmid.' AND id_user='.$usid);
                }
            }
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }

    function getScoreFromTestId($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"]) && isset($post["tmid"]) && isset($post["tsid"]) ){
            $usid = $post["usid"];
            $tmid = $post["tmid"];
            $allScores =  ($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$post["tsid"].' AND id_team='.$tmid.' AND id_user='.$usid);
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allScores );
    }

    function deleteScore($post){
        $toReturn = null;
        $success = true;
        $error = "";
      
        $id = $post["tsid"];
        $token = $post["token"];
        $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
        if( !$isAdmin ){
            $error = "Uzytkownik o danym tokenie nieodnaleziony lub brak uprawnien";
            $success = false;
        }else{
            $toReturn = ($this->db->getConnection())->delete('potential_score', ['id' => $id]);
        }
       
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addScore($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["score"]) && isset($post["usid"]) && isset($post["tmid"]) && isset($post["tsid"]))
        {
            $usid = $post["usid"];
            $tmid = $post["tmid"];
            $tsid = $post["tsid"];
            $score = $post["score"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnien";
                $success = false;
            }else{
                $data = [
                    'id_test' => $tsid,
                    'id_user' => $usid,
                    'id_team' => $tmid,
                    'wynik' => $score
                ];
                $toReturn = ($this->db->getConnection())->insert('potential_score', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }


    function getCategoryWitchTest(){
        $toReturn = null;
        $success = true;
        $error = "";
        $allPotential = ($this->db->getConnection())->fetchRowMany('SELECT * FROM potential');
        for($i=0;$i<count($allPotential);$i++){
            $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best, worst FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }

    function addCategoryTest($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["name"]))
        {
            $name = $post["name"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnien";
                $success = false;
            }else{
                $data = [
                    'name' => $name
                ];
                $toReturn = ($this->db->getConnection())->insert('potential', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteCategoryTest($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["id"]) )
        {
            $id = $post["id"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub brak uprawnien";
                $success = false;
            }else{
                $toReturn = ($this->db->getConnection())->delete('potential_test', ['id_potential' => $id]);
                $toReturn = ($this->db->getConnection())->delete('potential', ['id' => $id]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTestToCategory($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["name"]) && isset($post["caid"]) && isset($post["best"]) && isset($post["worst"]) )
        {
            $name = $post["name"];
            $caid = $post["caid"];
            $best = $post["best"];
            $worst = $post["worst"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnien";
                $success = false;
            }else{
                $data = [
                    'id_potential' => $caid,
                    'name' => $name,
                    'best' => $best,
                    'worst' => $worst
                ];
                $toReturn = ($this->db->getConnection())->insert('potential_test', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }


    function changeTest($post){
        $error = "";
        $success = true;
        $condsUsers = [];
        $dataUsers =[];

        if( isset($post["id"]) && isset($post["value"]) && isset($post["changeType"]) ){
            $id = $post["id"];
            $value = $post["value"];
            $changeType = $post["changeType"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub nie ma uprawnien";
                $success = false;
            }else {
                $condsUsers['id'] = $id;
                $dataUsers[($changeType=='best')?'best':'worst'] = trim($value);
                $result = ($this->db->getConnection())->update('potential_test', $condsUsers, $dataUsers);
            }
        }else{
            $success = false;
            $error = "Brak danych";
        }

        return array( "error"=>$error ,"success"=>$success, "data"=>array("url"=>$file_name, "post"=>$post) );
    }

    function deleteTestFromCat($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["id"]) )
        {
            $id = $post["id"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony lub brak uprawnien";
                $success = false;
            }else{
                $toReturn = ($this->db->getConnection())->delete('potential_test', ['id' => $id]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}