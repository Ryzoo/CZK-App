<?php
namespace Modules\Post;

use Core\System\BasicModule;

class Post extends BasicModule {
     function install(){
    }

    function uninstall(){
    }

    function getPost($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $last = 0;
        $all = '100';
        $tmid = $data["tmid"];

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT posts.id as psid, content, date_add, users.id as usid, firstname, lastname, user_img_path, token FROM users, user_data, posts WHERE posts.id_user = users.id AND user_data.user_id = users.id AND posts.id_team = '.$tmid.' AND posts.id > '.$last.' ORDER BY posts.id DESC ');

        for($i=0;$i<count($toReturn);$i++){
            $id_post = $toReturn[$i]['psid'];
            $toReturn[$i]['comments'] = ($this->db->getConnection())->fetchRowMany('SELECT comments.id as cmid, users.id as usid, content, date_add, firstname, lastname, user_img_path FROM comments, users, user_data WHERE user_data.user_id =users.id AND comments.id_user = users.id AND id_post = '.$id_post.' ORDER BY comments.id DESC ');
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getLastPost( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM posts, users, user_data WHERE posts.id_user = users.id AND users.id = user_data.user_id AND id_team = '.$tmid.' ORDER BY date_add DESC LIMIT 1');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addPost($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $message = $data["msg"];
        $tmid = $data["tmid"];
        $token = $data["token"];
        $idUser = ($this->auth)->getUserId($token);
        $data = [
            'id_user'   => $idUser,
            'id_team'   => $tmid,
            'content' => $message,
            'date_add'  => date("Y-m-d H:i:s"),
        ];
        $toReturn = ($this->db->getConnection())->insert('posts', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addComment($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $message = $data["msg"];
        $token = $data["token"];
        $post_id = $data["post_id"];
        $idUser = ($this->auth)->getUserId($token);
        $data = [
            'id_user' => $idUser,
            'id_post' => $post_id,
            'content' => $message,
            'date_add'  => date("Y-m-d H:i:s"),
        ];
        $toReturn = ($this->db->getConnection())->insert('comments', $data);
            

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteComment($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $cmid = $data["cmid"];
        $token = $data["token"];
        $idUser = ($this->auth)->getUserId($token);
        $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));

        $cm = ($this->db->getConnection())->fetchRow('SELECT comments.id_user as usid FROM comments, users, user_data WHERE user_data.user_id =users.id AND comments.id_user = users.id AND comments.id = '.$cmid);
        if( $cm['usid'] == $idUser || $isAdmin)
            $toReturn = ($this->db->getConnection())->delete('comments', ['id' => $cmid]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deletePost($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $psid = $data["psid"];
        $token = $data["token"];
        $idUser = ($this->auth)->getUserId($token);
        $isAdmin = !(($this->auth)->checkPerm($token,"ZAWODNIK"));
           
        $cm = ($this->db->getConnection())->fetchRow('SELECT posts.id_user as psid FROM posts, users, user_data WHERE user_data.user_id =users.id AND posts.id_user = users.id AND posts.id = '.$psid);
        if( $cm['psid'] == $idUser || $isAdmin){
            $toReturn = ($this->db->getConnection())->delete('comments', ['id_post' => $psid]);
            $toReturn = ($this->db->getConnection())->delete('posts', ['id' => $psid]);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
}
