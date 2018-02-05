<?php
namespace Core\Notify;

use Core\System\BasicModule;
use Pusher;

class Notify extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function addNotify($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $title = $data["title"];
        $tmid = $data["tmid"];
        $token = $data["token"];
        $to = $data["to"];
        $toAll = $data["toAll"] == 'true' ? true : false;
        $url = $data["url"];
        $idUser = ($this->auth)->getUserId($token);
        $options = array(
            'cluster' => 'eu',
            'encrypted' => true
        );
        $pusher = new Pusher\Pusher(
            'f6e645e5d1587187d17e',
            'cc5035aab8bc39cd3813',
            '464577',
            $options
        );

        $data = [
            'title'   => $title,
            'url'   => $url
        ];
        $notId = ($this->db->getConnection())->insert('notifications', $data);
        if( $notId != null ){
            if( $toAll ){
                $userids = ($this->db->getConnection())->fetchRowMany('SELECT id_user FROM team_members WHERE id_team='.$tmid);
                if( is_null($userids) ) $userids = [];
                $to = [];
                for($i=0;$i<count($userids);$i++){
                    array_push($to,$userids[$i]['id_user']);
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
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id as id, notifications.title, notifications.url, user_notifications.is_new,notifications.date_add  FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid.' GROUP BY user_notifications.id ORDER BY notifications.date_add DESC LIMIT 5');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllNotify($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id, notifications.title, notifications.url,notifications.date_add FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid.' GROUP BY user_notifications.id ORDER BY notifications.date_add DESC LIMIT 50' );

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
        for($i=0;$i<count($ntid);$i++){
            $condsUsers = [ 
                'id_notification' => $ntid[$i],
                'id_user'=> $usid,
                'id_team'=> $tmid
            ];
            $dataUsers = [ 
                'is_new' => 2
            ];
            array_push($toReturn,($this->db->getConnection())->update('user_notifications', $condsUsers, $dataUsers)) ;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}