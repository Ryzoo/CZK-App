<?php
namespace Core\Teams;
use Core\System\BasicModule;
use Core\Settings\Settings;

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

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, team_members.id as tmmid, firstname, lastname, nr_on_tshirt, pos_x, pos_y FROM teams, team_members, users, user_data, positions, roles WHERE positions.id = team_members.id_position AND teams.id = team_members.id_team AND team_members.id_user = users.id AND users.id = user_data.user_id AND users.id_role = 3 AND team_members.id_team = '.$id.' GROUP BY usid ORDER BY user_data.lastname' );

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

        $settings = new Settings();
        $mainSettings = $settings->getMainPageSettings()['data'];
        $maxTeamCount = $mainSettings->maxTeams;
        if( $maxTeamCount != 'MAX' ){
            $maxTeamCount = (int) $maxTeamCount;
            $teamCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM teams "));
            if( $teamCount >=$maxTeamCount  ){
                $this->returnedData['error'] = "Niestety limit drużyn nie pozwala na dodanie kolejnej";
                $this->returnedData['success'] = false;
                return $this->returnedData;
            }
        }

        $toReturn = ($this->db->getConnection())->insert('teams', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllMastersFromTeam($data){
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname FROM `team_members`, users, user_data WHERE users.id = user_data.user_id AND users.id = team_members.id_user AND users.id_role = 2 AND team_members.id_team = '.$tmid.' GROUP BY usid ORDER BY user_data.lastname' );

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getSectionData($data){
        $tmid = $data['tmid'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow('SELECT * FROM teams WHERE id = '.$tmid);
        return $this->returnedData;
    }

    function turnOnSectionGet($data){
        $tmid = $data['tmid'];
        $min = $data['min'];
        $max = $data['max'];
        $desc = $data['desc'];
        $this->returnedData['data'] = ($this->db->getConnection())->update('teams',["id"=>$tmid],[
                "minYear"=>$min,
                "maxYear"=>$max,
                "description"=>$desc,
                "isGetEnabled"=>1
            ]);
        return $this->returnedData;
    }

    function turnOffSectionGet($data){
        $tmid = $data['tmid'];
        ($this->db->getConnection())->delete('sectionApplayers',["id_team"=>$tmid]);
        $this->returnedData['data'] = ($this->db->getConnection())->update('teams',["id"=>$tmid],[
            "isGetEnabled"=>0
        ]);

        return $this->returnedData;
    }

    function isApplayerActive($data=null){
        $actived = ($this->db->getConnection())->fetchRowMany("SELECT id FROM teams WHERE isGetEnabled=1");
        if( isset($actived) && count($actived) >= 1 ){
            $this->returnedData['data'] = true;
        }else{
            $this->returnedData['data'] = false;
        }
        return $this->returnedData;
    }

    function addPersonToTeamApplicant($data){
        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $data = [
            'id_user'   => $usid,
            'id_team'  => $tmid
        ];
        $isApplayers = ($this->db->getConnection())->fetchRowMany("SELECT id FROM sectionApplayers WHERE id_user = ".$usid." AND id_team= ".$tmid);
        if( $isApplayers && count($isApplayers) >= 1 ){
            $this->returnedData['error'] = "Już aplikowałeś do tej sekcji, poczekaj na rozpatrzenie tego zgłoszenia.";
            $this->returnedData['success'] = false;
        }else{
            $this->returnedData['data'] = ($this->db->getConnection())->insert('sectionApplayers',$data);
        }
        return $this->returnedData;
    }

    function getAvailableSection($data){
        $usid = $data["usid"];
        $availableTeams = ($this->db->getConnection())->fetchRowMany("SELECT * FROM teams WHERE isGetEnabled = 1");
        $this->returnedData['data'] = [];
        for($i=0;$i<count($availableTeams);$i++){
            $checkedId = $availableTeams[$i]['id'];
            $personInTema = ($this->db->getConnection())->fetchRowMany("SELECT id FROM team_members WHERE id_user= ".$usid." AND id_team= ".$checkedId);
            
            $userYearOld = ($this->db->getConnection())->fetchRowMany("SELECT YEAR(CURDATE()) - EXTRACT( YEAR FROM user_data.birthdate ) AS yearOld FROM users, user_data WHERE users.id = user_data.user_id AND users.id =".$usid);
            $userYearOld = (int)$userYearOld[0]["yearOld"];

            if((!isset($personInTema) || count($personInTema) == 0) && $userYearOld >= $availableTeams[$i]["minYear"] && $userYearOld <= $availableTeams[$i]["maxYear"]){
                $availableTeams[$i]["events"] = [
                    "Poniedziałek"=>[],
                    "Wtorek"=>[],
                    "Środa"=>[],
                    "Czwartek"=>[],
                    "Piątek"=>[],
                    "Sobota"=>[],
                    "Niedziela"=>[]
                ];
                $tmid = $checkedId;
                $allEvent = ($this->db->getConnection())->fetchRowMany("SELECT `id`, `id_team`, `title`, `day_name`, `time`,`timeEnd`, `color` FROM `timetable` WHERE id_team=".$tmid." ORDER BY time");

                for ($j=0; $j < count($allEvent) ; $j++) { 
                    array_push( $availableTeams[$i]["events"][ $allEvent[$j]["day_name"] ], $allEvent[$j]);
                }
                $availableTeams[$i]["allCyclePayments"] = ($this->db->getConnection())->fetchRowMany('SELECT * FROM cyclePayments WHERE id_team='.$tmid);
                array_push($this->returnedData['data'],$availableTeams[$i]);
            }
        }
        return $this->returnedData;
    }

    function deletePlayerAplay($data){
        $aplId = $data['aplId'];
        $tmid = $data['tmid'];
        ($this->db->getConnection())->delete('sectionApplayers',["id"=>$aplId]);
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT sectionApplayers.id as id, users.id as usid, firstname, lastname, YEAR(CURDATE()) - EXTRACT( YEAR FROM user_data.birthdate )  AS yearOld , tel, parent_tel, email FROM sectionApplayers, users, user_data  WHERE sectionApplayers.id_user = users.id AND users.id = user_data.user_id AND sectionApplayers.id_team =".$tmid);
        return $this->returnedData;
    }

    function applayPlayerToTeam($data){
        $aplId = $data['aplId'];
        $usid = $data['usid'];
        $tmid = $data['tmid'];
        ($this->db->getConnection())->delete('sectionApplayers',["id"=>$aplId]);
        $personInTema = ($this->db->getConnection())->fetchRowMany("SELECT id FROM team_members WHERE id_user= ".$usid." AND id_team= ".$tmid);
        if(!isset($personInTema) || count($personInTema) == 0){
            $data = [
                'id_user'   => $usid,
                'id_team'  => $tmid
            ];
            ($this->db->getConnection())->insert('team_members', $data);
        }
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT sectionApplayers.id as id, users.id as usid, firstname, lastname, YEAR(CURDATE()) - EXTRACT( YEAR FROM user_data.birthdate )  AS yearOld , tel, parent_tel, email FROM sectionApplayers, users, user_data  WHERE sectionApplayers.id_user = users.id AND users.id = user_data.user_id AND sectionApplayers.id_team =".$tmid);
        return $this->returnedData;
    }

    function getSectionApplayer($data){
        $tmid = $data['tmid'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT sectionApplayers.id as id, users.id as usid, firstname, lastname, YEAR(CURDATE()) - EXTRACT( YEAR FROM user_data.birthdate )  AS yearOld , tel, parent_tel, email FROM sectionApplayers, users, user_data  WHERE sectionApplayers.id_user = users.id AND users.id = user_data.user_id AND sectionApplayers.id_team =".$tmid);
        return $this->returnedData;
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
