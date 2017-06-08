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


class Post{
    private $db;

    function __construct(){
        $this->db = new Database();
    }

    function getPost($post){
        $toReturn = null;
        $success = true;
        $error = "";
        $last = 0;
        $all = '100';
        if( isset($post["last"]) ) $last = $post["last"];
        if( isset($post["all"]) ) $all = $post["all"];
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT posts.id as psid, content, date_add, users.id as usid, firstname, lastname, user_img_path FROM users, user_data, posts WHERE posts.id_user = users.id AND user_data.user_id = users.id ORDER BY posts.id DESC LIMIT '.$last.' , '.$all);

        if( is_null($toReturn) ){
            $success = false;
            $error = "blad zapytania";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getComments(){
     
    }

}