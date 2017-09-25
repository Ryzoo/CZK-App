<?php
namespace Core\Players;

use Core\System\BasicModule;

class Players extends BasicModule{
   function install(){
    }

    function uninstall(){
    }

    function addPlayerToTeam( $data ){
        $tmid = $data['tmid'];
        $usid = $data['usid'];

        $data = [
            'id_user'  => $usid,
            'id_team'  => $tmid
        ];

        $teamMembersId = ($this->db->getConnection())->insert('team_members', $data);

        return $this->returnedData;
    }

    function getAllPlayers( $data ){
        $tmid = $data['tmid'];
        $this->returnedData["data"] = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname, roles.name as roleName FROM team_members, users, user_data, roles WHERE users.id_role = roles.id AND team_members.id_user = users.id AND users.id = user_data.user_id AND ( users.id_role = 3 OR users.id_role = 4) AND id_team = '.$tmid.' GROUP BY usid ORDER BY user_data.lastname');
        return $this->returnedData;
    }

    function getAllPlayersFromApp( $data ){
        $tmid = $data['tmid'];
        $teamUser = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid FROM team_members, users, user_data, roles WHERE users.id_role = roles.id AND team_members.id_user = users.id AND users.id = user_data.user_id AND ( users.id_role = 3 OR users.id_role = 4) AND id_team = '.$tmid);
        $allUser = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname FROM users, user_data, roles WHERE users.id_role = roles.id AND users.id = user_data.user_id AND ( users.id_role = 3 OR users.id_role = 4) GROUP BY usid ORDER BY user_data.lastname');
        $this->returnedData["data"] = [];
        for($i=0;$i<count($allUser);$i++){
            $isIn = false;
            for($j=0;$j<count($teamUser);$j++){
                if( $allUser[$i]["usid"] === $teamUser[$j]["usid"] ){
                    $isIn = true;
                    break;
                }
            }
            if(!$isIn){
                array_push($this->returnedData["data"],$allUser[$i]);
            }
        }
        
        return $this->returnedData;
    }

    function getAllMaster(){
        $this->returnedData["data"] = ($this->db->getConnection())->fetchRowMany('SELECT users.id as usid, firstname, lastname, roles.name as roleName FROM users, user_data, roles WHERE users.id_role = roles.id AND  users.id = user_data.user_id AND users.id_role = 2 GROUP BY usid ORDER BY user_data.lastname');
        return $this->returnedData;
    }

    function recreatePassword( $data ){
        $usid = $data["usid"];
        $token = $data["token"];
        $newPassword = md5( $lname . random_int(1, 100) . $token );

        $user = ($this->db->getConnection())->fetchRow("SELECT users.id, users.firstname, users.lastname FROM users, user_data WHERE user_data.user_id = users.id AND users.id = ".$usid);
        $fname = $user['firstname'];
        $lname = $user['lastname'];

        ($this->db->getConnection())->update('users', ["id"=>$usid], ["password"=>$newPassword]);

        try{
            $headers = 'MIME-Version: 1.0' . "\r\n" .
            'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
            'From: ClubManagementCenter@gmail.com' . "\r\n" .
            'Reply-To: ClubManagementCenter@gmail.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();
            $message = "Witaj <strong>".$fname." ".$lname."</strong>.<br/>Twoje hasło zostało właśnie zmienione. <br/>Możesz się zalogować używając tego adresu email oraz hasła: <strong>".$newPassword."</strong>";
            $success = mail($mail, 'Utworzono Twoje konto', $message, $headers);
            if (!$success) {
                $errorMessage = error_get_last()['message'];
                $this->returnedData["error"]  = $errorMessage;
                $this->returnedData["success"]  = false;
            }
        }catch(Exception $e){
            $this->returnedData["error"]  = 'Nie udało się wysłać meila z hasłem';
            $this->returnedData["success"]  = false;
        }
        return $this->returnedData;
    }

    function addPerson( $post ){
        $toReturn = null;
        $success = true;
        $error = "";

        $isAdminAc = $post["isAdmin"] == 'true' ? true : false;
        $isPersonel = $post["isPersonel"] == 'true' ? true : false;
        $lname = $post["lname"];
        $fname = $post["fname"];
        $mail = $post["mail"];
        $tmid = $post["tmid"];
        $token = $post["token"];
        $role = ($isAdminAc ? 2 : ($isPersonel ? 4 : 3));
        $newPassword = md5( $lname . random_int(1, 100) . $token );

        $toReturn = ($this->db->getConnection())->fetchRowMany("SELECT id FROM users WHERE email = '".$mail."'");
        if( $toReturn != null ){
            $error = "Dany adres email istnieje już w bazie";
            $success = false;
            return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
        }     
 
        $data = [
            'email'   => $mail,
            'password'  => md5($newPassword),
            'id_role' => $role,
            'create_account_date'  => date("Y-m-d H:i:s")
        ];
        $newPersonId = ($this->db->getConnection())->insert('users', $data);
        if( isset($newPersonId) && $newPersonId >= 0 ){
            $data = [
                'user_id'   => $newPersonId,
                'firstname'  => $fname ,
                'lastname' => $lname,
            ];
            $user_data = ($this->db->getConnection())->insert('user_data', $data);
            if( isset($user_data) && $user_data >= 0 ){
                if( $tmid > 0 ){
                    $data = [
                        'id_user'   => $newPersonId,
                        'id_team'  => $tmid
                    ];
                    $teamMembersId = ($this->db->getConnection())->insert('team_members', $data);
                    if( !isset($user_data) || $user_data == null ){
                        $error = "Nie udało się przypisać osoby do teamu";
                        $success = false;
                    }
                    $toReturn = $isPersonel;
                }
                try{
                    $headers = 'MIME-Version: 1.0' . "\r\n" .
                    'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
                    'From: ClubManagementCenter@gmail.com' . "\r\n" .
                    'Reply-To: ClubManagementCenter@gmail.com' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();
                    $message = "Witaj <strong>".$fname." ".$lname."</strong>.<br/>Twoje konto zostało właśnie utworzone. <br/>Możesz się zalogować używając tego adresu email oraz hasła: <strong>".$newPassword."</strong>";
                    mail($mail, 'Utworzono Twoje konto', $message, $headers);
                }catch(Exception $e){
                    $toReturn = 'Nie udało się wysłać meila z hasłem';
                }
            }else{
                $error = "Nie udało się dodać danych użytkownika";
                $success = false;
            }

        }else{
            $error = "Nie udało się dodać użytkownika";
            $success = false;
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getAllUserData( $data ){
        $usid = $data["usid"];
        $toReturn = null;
        $success = true;
        $error = "";
        
        $toReturn = ($this->db->getConnection())->fetchRow('SELECT *  FROM users, user_data, roles WHERE users.id_role = roles.id  AND users.id = user_data.user_id AND users.id = '.$usid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteUser( $data ){
        $usid = $data['usid'];
        $toReturn = null;
        $success = true;
        $error = "";
        
        ($this->db->getConnection())->delete('user_data', ['user_id' => $usid]);
        ($this->db->getConnection())->delete('team_members', ['id_user' => $usid]);
        ($this->db->getConnection())->delete('comments', ['id_user' => $usid]);
        ($this->db->getConnection())->delete('posts', ['id_user' => $usid]);
        ($this->db->getConnection())->delete('staff', ['id_user' => $usid]);
        ($this->db->getConnection())->delete('users', ['id' => $usid]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}