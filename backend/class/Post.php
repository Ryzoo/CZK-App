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
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function getPost($post){
        $toReturn = null;
        $success = true;
        $error = "";
        $last = 0;
        $all = '100';
        if( isset($post["last"]) ) $last = $post["last"];
        if( isset($post["all"]) ) $all = $post["all"];
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT posts.id as psid, content, date_add, users.id as usid, firstname, lastname, user_img_path, token FROM users, user_data, posts WHERE posts.id_user = users.id AND user_data.user_id = users.id AND posts.id > '.$last.' ORDER BY posts.id DESC ');

        for($i=0;$i<count($toReturn);$i++){
            $id_post = $toReturn[$i]['psid'];
            $toReturn[$i]['comments'] = ($this->db->getConnection())->fetchRowMany('SELECT comments.id as cmid, users.id as usid, content, date_add, firstname, lastname, user_img_path FROM comments, users, user_data WHERE user_data.user_id =users.id AND comments.id_user = users.id AND id_post = '.$id_post.' ORDER BY comments.id DESC ');
        }

        if( is_null($toReturn) ){
            $success = false;
            $error = "blad zapytania";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addPost($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["msg"]) && isset($post["token"]))
        {
            $message = $post["msg"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnalleziony";
                $success = false;
            }else{
                $data = [
                    'id_user'   => $idUser,
                    'content' => $message,
                    'date_add'  => date("Y-m-d H:i:s"),
                ];
                $toReturn = ($this->db->getConnection())->insert('posts', $data);
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

    function addComment($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["msg"]) && isset($post["token"]) && isset($post["post_id"]))
        {
            $message = $post["msg"];
            $token = $post["token"];
            $post_id = $post["post_id"];
            $idUser = ($this->auth)->getUserId($token);
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                $data = [
                    'id_user' => $idUser,
                    'id_post' => $post_id,
                    'content' => $message,
                    'date_add'  => date("Y-m-d H:i:s"),
                ];
                $toReturn = ($this->db->getConnection())->insert('comments', $data);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteComment($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["cmid"]) && isset($post["token"]) )
        {
            $cmid = $post["cmid"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                $cm = ($this->db->getConnection())->fetchRow('SELECT comments.id_user as usid FROM comments, users, user_data WHERE user_data.user_id =users.id AND comments.id_user = users.id AND comments.id = '.$cmid);
                if( $cm['usid'] == $idUser || $isAdmin)
                    $toReturn = ($this->db->getConnection())->delete('comments', ['id' => $cmid]);
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deletePost($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["psid"]) && isset($post["token"]) )
        {
            $psid = $post["psid"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( !$idUser ){
                $error = "Uzytkownik o danym tokenie nieodnaleziony";
                $success = false;
            }else{
                $cm = ($this->db->getConnection())->fetchRow('SELECT posts.id_user as psid FROM posts, users, user_data WHERE user_data.user_id =users.id AND posts.id_user = users.id AND posts.id = '.$psid);
                if( $cm['psid'] == $idUser || $isAdmin){
                    $toReturn = ($this->db->getConnection())->delete('posts', ['id' => $psid]);
                    $toReturn = ($this->db->getConnection())->delete('comments', ['id_post' => $psid]);
                }
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
}
