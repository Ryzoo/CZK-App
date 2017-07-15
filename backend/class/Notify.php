
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


class Notify{
    private $db;
    private $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    function addNotify($post){

    }

    function getNewNotify($post){
        $toReturn = null;
        $success = true;
        $error = "";

        if(isset($post['usid']) && isset($post['tmid'])){
            $usid = $post['usid'];
            $tmid = $post['tmid'];
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id, notifications.title, notifications.url FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid.' AND user_notifications.is_new = 1 GROUP BY user_notifications.id');
        }else{
            $error = 'Brak potrzebnych danych';
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllNotify($post){
        $toReturn = null;
        $success = true;
        $error = "";

        if(isset($post['usid']) && isset($post['tmid'])){
            $usid = $post['usid'];
            $tmid = $post['tmid'];
            $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT notifications.id, notifications.title, notifications.url FROM user_notifications, notifications WHERE notifications.id = user_notifications.id_notification AND user_notifications.id_team = '.$tmid.' AND user_notifications.id_user = '.$usid);
        }else{
            $error = 'Brak potrzebnych danych';
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
    
    function setNewNotifyOff($post){
        $toReturn = array();
        $success = true;
        $error = "";

        if(isset($post['usid']) && isset($post['tmid']) && isset($post['ntid'])){
            $usid = $post['usid'];
            $tmid = $post['tmid'];
            $ntid = $post['ntid'];
            $condsUsers = [];
            $dataUsers = [
                'is_new'=>0
            ];
            for($i=0;$i<count($ntid);$i++){
                $condsUsers = [ 
                    'id' => $ntid[$i],
                    'id_user'=> $usid,
                    'id_team'=> $tmid
                ];
                array_push($toReturn,($this->db->getConnection())->update('user_notifications', $condsUsers, $dataUsers)) ;
            }
            
        }else{
            $error = 'Brak potrzebnych danych';
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}