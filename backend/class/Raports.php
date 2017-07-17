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

class Raports{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function addRaport( $post ){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["usid"]) && isset($post["tmid"]) && isset($post["name"]) && isset($_FILES["raportFile"]) )
        {
            $usid = $post["usid"];
            $tmid = $post["tmid"];
            $name = $post["name"];
            $filePath = null;

            $ext = pathinfo($_FILES["raportFile"]["name"],PATHINFO_EXTENSION);
            $target_dir = __DIR__ . "/../../";
            $file_name = 'files/users/' . $post["usid"].$post["tmid"].str_replace(' ','_',$post["name"] ). "." . $ext;
            $target_file = $target_dir . $file_name;
            if(!move_uploaded_file($_FILES["raportFile"]["tmp_name"], $target_file)){
                $success = false;
                $error = "Nie udało się skopiowac: " . $_FILES["raportFile"]['name'];
            }else{
                $filePath = $file_name;
            }

            if( $filePath == null ) {
                $error = "Błąd podczas przesyłania pliku";
                $success = false;
            }else{
                $data = [
                    'id_user'   => $usid,
                    'id_team'   => $tmid,
                    'name' => $name,
                    'file_path' => $filePath
                ];
                $toReturn = ($this->db->getConnection())->insert('raports', $data);
            }
            
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getRaport( $post ){
        $toReturn = null;
        $success = true;
        $error = "";

        if( isset($post["tmid"]) && isset($post["usid"]) ){
            $tmid = $post["tmid"];
            $usid = $post["usid"];
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT id,name,file_path FROM raports WHERE id_user='.$usid.' AND id_team='.$tmid);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteRaport($post){
        $toReturn = null;
        $success = true;
        $error = "";
        if( isset($post["id"]) && isset($post["token"]) )
        {
            $id = $post["id"];
            $token = $post["token"];
            $idUser = ($this->auth)->getUserId($token);
            $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
            if( $isAdmin ){
                $path = ($this->db->getConnection())->fetchRow('SELECT file_path FROM raports WHERE id='.$id);
                if( file_exists($path) ) unlink($path);
                $toReturn = ($this->db->getConnection())->delete('raports', ['id' => $id]);
            }else{
                $error = "Brak uprawnien";
                $success = false;
            }
        }else{
            $error = "Brak potrzebnych danych";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}