<?php
namespace Modules;

use System\BasicModule;

class Staff extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function getTeamStaff( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT staff.id as stid, staff.name as stname, firstname, lastname, email, tel, user_img_path FROM staff, users, user_data WHERE staff.id_user = users.id AND user_data.user_id = users.id AND staff.id_team = '.$tmid );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getKoords(){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM users, user_data WHERE user_data.user_id = users.id AND users.id_role = 1 ');

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getFullPersonel( $data ){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname, roles.name as rlname FROM users, user_data, roles, team_members WHERE user_data.user_id = users.id AND users.id_role = roles.id AND team_members.id_user = users.id AND ( ( roles.id != 3 AND team_members.id_team = '.$tmid.') OR ( roles.id = 1 ) )' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addStaff($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $usid = $data['usid'];
        $name = $data['name'];
        $tmid = $data['tmid'];
        $data = [
            'id_user' => $usid,
            'id_team' => $tmid,
            'name' => $name,
        ];
        $toReturn = ($this->db->getConnection())->insert('staff', $data);
            
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteStaff( $data ){
        $toReturn = null;
        $success = true;
        $error = "";
        
        $stid = $data["stid"];
        $toReturn = ($this->db->getConnection())->delete('staff', ['id' => $stid]); 

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }


}