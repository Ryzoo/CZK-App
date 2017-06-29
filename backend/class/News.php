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


class News{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getAllNews( $tmid ){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM events WHERE id_team = '.$tmid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteNews( $post ){
        $toReturn = null;
        $success = true;
        $error = "";

        if( isset($post["id"]))
        {
            $id = $post["id"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$idUser || !$isAdmin ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                ($this->db->getConnection())->delete('events', ['id' => $id]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addNews($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["title"]) && isset($post["start"])  && isset($post["end"]) )
        {
            $title = $post["title"];
            $start = $post["start"];
            $end = $post["end"];
            $tmid = $post["tmid"];
            $token = $post["token"];
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            $idUser = ($this->auth)->getUserId($token);
            if( !$idUser || !$isAdmin){
                $error = "Uzytkownik o danym tokenie nieodnalleziony lub nie posiada odpowiednich uprawnien";
                $success = false;
            }else{
                $data = [
                    'id_team'   => $tmid,
                    'title' => $title,
                    'start' => $start,
                    'end' => $end,
                ];
                $toReturn = ($this->db->getConnection())->insert('events', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        if( is_null($toReturn) ){
            $success = false;
            $error = "blad zapytania";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function editNews($post){
        $toReturn = null;
        $success = true;
        $error = "";
        $condsUsers = [];
        $dataUsers = [];

        if( isset($post['id'])){
            $condsUsers['id'] = $post['id'];
            if(isset($post['title'])) $dataUsers['title'] = $post['title'];
            if(isset($post['start'])) $dataUsers['start'] = $post['start'];
            if(isset($post['end'])) $dataUsers['end'] = $post['end'];
            $toReturn = ($this->db->getConnection())->update('events', $condsUsers, $dataUsers);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}