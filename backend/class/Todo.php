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

class Todo{

    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getTodo( $token ){
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $this->auth->getUserId($token);

        if( isset($usid) ){
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM todo WHERE id_user = '.$usid);
        }
        else{
            $success = false;
            $error = "bledny token";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function endTodo( $tid ){
        $toReturn = null;
        $success = true;
        $error = "";
        
        $toReturn = ($this->db->getConnection())->delete('todo', ['id' => $tid]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTodo( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"]) && isset($post["title"]))
        {
            $title = $post["title"];
            $usid = $post["usid"];
            $data = [
                'id_user' => $usid,
                'title' => $title,
            ];
            if( isset( $post["color"] ) ) $data['color'] = $post["color"];
            
            $toReturn = ($this->db->getConnection())->insert('todo', $data);
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}