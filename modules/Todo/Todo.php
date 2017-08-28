<?php
namespace Modules\Todo;

use Core\System\BasicModule;

class Todo extends BasicModule {

    function install(){
    }

    function uninstall(){
    }

    function getTodo( $data ){
        $error = '';
        $success = true;
        $token = $data["token"];
        $usid = $this->auth->getUserId($token);
        
        if( isset($usid) ){
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM todo WHERE id_user = '.$usid);
        }
        else{
            $success = false;
            $error = "Nie mozna znalezć użytkownika w bazie";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function endTodo( $data ){
        $error = '';
        $success = true;
        $tid = $data["tid"];
        
        $toReturn = ($this->db->getConnection())->delete('todo', ['id' => $tid]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTodo( $data ){
        $error = '';
        $success = true;
        $title = $data["title"];
        $usid = $data["usid"];
        $color = $data["color"];

        $data = [
            'id_user' => $usid,
            'title' => $title,
            'color' => $color
        ];
            
        $toReturn = ($this->db->getConnection())->insert('todo', $data);
        
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    

}