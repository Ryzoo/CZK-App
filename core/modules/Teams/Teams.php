<?php
namespace Core\Teams;
use Core\System\BasicModule;

class Teams extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function changeWeightTeam($data){
        $tmid = $data['tmid'];
        $weight = $data['weight'];
        $condsUsers = ["id"=>$tmid];
        $dataUsers = ["weight"=>$weight];
        ($this->db->getConnection())->update('teams', $condsUsers, $dataUsers);
        return $this->returnedData;
    }

    function getTeams( $data ){
        $token = $data['token'];
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $this->auth->getUserId($token);
        $isKoord = (($this->auth)->checkPerm($token,"KOORD"));
        if( $usid ){
            if($isKoord){
                $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT teams.id as tmid, name, weight FROM teams ORDER BY weight');
            }else{
                $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT teams.id as tmid, name, weight FROM teams, team_members WHERE teams.id = team_members.id_team AND team_members.id_user = '.$usid.' ORDER BY weight');
            }
        }
        else{
            $success = false;
            $error = "bledny token";
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getUserFromTeam( $data ){
        $id = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, team_members.id as tmmid, firstname, lastname, nr_on_tshirt, pos_x, pos_y FROM teams, team_members, users, user_data, positions, roles WHERE positions.id = team_members.id_position AND teams.id = team_members.id_team AND team_members.id_user = users.id AND users.id = user_data.user_id AND users.id_role = 3 AND team_members.id_team = '.$id.' GROUP BY usid' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function savePositionOnField($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $pos_x = $data['pos_x'];
        $pos_y = $data['pos_y'];
        $usid = $data['usid'];

        $condsUsers['id'] = $usid;
        $dataUsers=[
            'pos_x' => $pos_x,
            'pos_y' => $pos_y
        ];

        $result = ($this->db->getConnection())->update('team_members', $condsUsers, $dataUsers);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function changeCollection($data){
        $toReturn = null;
        $success = true;
        $error = "";

        $condsUsers['id'] = $data['tmid'];
        $dataUsers['nr_on_tshirt'] = $data['val'];
        $result = ($this->db->getConnection())->update('team_members', $condsUsers, $dataUsers);    

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllTeams(){
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM teams ORDER BY weight' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTeam($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $data = [
            'name' => $data["name"],
            'weight' => $data["weight"]
        ];

        $toReturn = ($this->db->getConnection())->insert('teams', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllMastersFromTeam($data){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname FROM `team_members`, users, user_data WHERE users.id = user_data.user_id AND users.id = team_members.id_user AND users.id_role = 2 AND team_members.id_team = '.$tmid );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteTeam($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $id = $data["id"];

        $toReturn = ($this->db->getConnection())->delete('user_notifications', ['id_team' => $id]);
        $toReturn = ($this->db->getConnection())->delete('staff', ['id_team' => $id]);
        $toReturn = ($this->db->getConnection())->delete('raports', ['id_team' => $id]);
        $toReturn = ($this->db->getConnection())->delete('events', ['id_team' => $id]);

        $cm = ($this->db->getConnection())->fetchRowMany('SELECT posts.id as psid FROM posts WHERE posts.id_team = '.$id);
        for ($i=0; $i <count($cm) ; $i++) { 
            ($this->db->getConnection())->delete('comments', ['id_post' => $cm[$i]]);
        }

        $toReturn = ($this->db->getConnection())->delete('posts', ['id_team' => $id]);
        $toReturn = ($this->db->getConnection())->delete('team_members', ['id_team' => $id]);
        $toReturn = ($this->db->getConnection())->delete('teams', ['id' => $id]);

        return array( "error"=>$error, "success"=>$success, "data"=>$toReturn );
    }

    function deleteMasterFromTeam($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $mid = $data["mid"];
        $tmid = $data["tmid"];

        $toReturn = ($this->db->getConnection())->delete('team_members', ['id_team' => $tmid,'id_user' =>$mid]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addMasterToTeam($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $tmid = $data["tmid"];
        $mid = $data["mid"];
        $data = [
            'id_user' => $data["mid"],
            'id_team' => $data["tmid"],
        ];

        $cm = ($this->db->getConnection())->fetchRowMany('SELECT id FROM team_members WHERE id_team = '.$tmid . ' AND id_user = '.$mid);
        if( $cm != null ){
            $error = "Ten trener jest już w drużynie";
            $success = false;
        }else{
            $toReturn = ($this->db->getConnection())->insert('team_members', $data);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
    
}
