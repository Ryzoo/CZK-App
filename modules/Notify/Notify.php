<?php
namespace Modules;

use Core\Database;
use Core\Auth;

class Notify{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function addNotify($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $title = $data["title"];
        $tmid = $data["tmid"];
        $token = $data["token"];
        $to = $data["to"];
        $toAll = $data["toAll"];
        $url = $data["url"];
        $idUser = ($this->auth)->getUserId($token);

        $data = [
            'title'   => $title,
            'url'   => $url
        ];
        $notId = ($this->db->getConnection())->insert('notifications', $data);
        if( $notId != null ){
            if( $toAll === true || $toAll === 'true'){
                $userids = ($this->db->getConnection())->fetchRowMany('SELECT id FROM team_members WHERE id_team='.$tmid.' GROUP BY id_user');
                $to = [];
                for($i=0;$i<count($userids);$i++){
                    //if( $userids[$i] != $usid)
                        array_push($to,$userids[$i]['id']);
                }
            }
            $data = [];
            for($i=0;$i<count($to);$i++){
                array_push($data,[
                    'id_user' => intval($to[$i]),
                    'id_team' => $tmid,
                    'id_notification' => $notId,
                ]);
            }
            $toReturn = ($this->db->getConnection())->insertMany('user_notifications', $data);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getNewNotify($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id, notifications.title, notifications.url FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid.' AND user_notifications.is_new = 1 GROUP BY user_notifications.id');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllNotify($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id, notifications.title, notifications.url FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
    
    function setNewNotifyOff($data){
        $toReturn = array();
        $success = true;
        $error = "";

        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $ntid = $data['ntid'];
        $condsUsers = [];
        $dataUsers = [
            'is_new'=>0
        ];
        for($i=0;$i<count($ntid);$i++){
            $condsUsers = [ 
                'id_notification' => $ntid[$i],
                'id_user'=> $usid,
                'id_team'=> $tmid
            ];
            array_push($toReturn,($this->db->getConnection())->update('user_notifications', $condsUsers, $dataUsers)) ;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}