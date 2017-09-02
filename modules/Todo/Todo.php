<?php
namespace Modules\Todo;

use Core\System\BasicModule;

class Todo extends BasicModule {

    function install(){
        $result = ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `todo` (`id` int(11) NOT NULL,`id_user` int(11) NOT NULL, `title` varchar(255) COLLATE utf8_polish_ci NOT NULL, `color` varchar(255) COLLATE utf8_polish_ci NOT NULL DEFAULT "#f44336",`date_add` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci');
        $result = ($this->db->getConnection())->executeSql('ALTER TABLE `todo` ADD PRIMARY KEY (`id`), MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
    }

    function uninstall(){
        $result = ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS todo');
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