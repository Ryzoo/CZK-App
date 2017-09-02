<?php
namespace Modules\News;

use Core\System\BasicModule;

class News extends BasicModule {
    
    function install(){
        $result = ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `events` ( `id_team` int(11) NOT NULL,`title` text NOT NULL, `start` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`end` datetime NOT NULL,`url` varchar(255) NOT NULL DEFAULT "",`id` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8');
    }

    function uninstall(){
        $result = ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS events');
    }

    function getNews( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM events WHERE id_team = '.$tmid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getNowEvents( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM events WHERE id_team = '.$tmid. ' AND CURDATE() >= DATE(`start`) AND CURDATE() <= DATE(`end`)');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getNextEvents( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM events WHERE id_team = '.$tmid. ' AND CURDATE() < DATE(`start`) AND (CURDATE()+INTERVAL 14 DAY) >= DATE(`start`) ');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteNews( $data ){
        $toReturn = null;
        $success = true;
        $error = "";

        $id = $data["id"];
        ($this->db->getConnection())->delete('events', ['id' => $id]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addNews($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $title = $data["title"];
        $start = $data["start"];
        $end = $data["end"];
        $tmid = $data["tmid"];

        $data = [
            'id_team'   => $tmid,
            'title' => $title,
            'start' => $start,
            'end' => $end,
        ];
        $toReturn = ($this->db->getConnection())->insert('events', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function editNews($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $condsUsers['id'] = $data['id'];
        if(isset($data['title'])) $dataUsers['title'] = $data['title'];
        if(isset($data['start'])) $dataUsers['start'] = $data['start'];
        if(isset($data['end'])) $dataUsers['end'] = $data['end'];
        $toReturn = ($this->db->getConnection())->update('events', $condsUsers, $dataUsers);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}