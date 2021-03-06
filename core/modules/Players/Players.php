<?php
namespace Core\Players;

use Core\System\BasicModule;
use Core\System\MailSystem;
use Core\Settings\Settings;

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

        $settings = new Settings();
        $mainSettings = $settings->getMainPageSettings()['data'];
        $maxPlayersCount = $mainSettings->maxPlayers;
        if( $maxPlayersCount != 'MAX' ){
            $maxPlayersCount = (int) $maxPlayersCount;
            $playerCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM team_members WHERE id_team = ".$tmid));
            if( $playerCount >=$maxPlayersCount  ){
                $this->returnedData['error'] = "Niestety limit zawodników nie pozwala na dodanie kolejnego";
                $this->returnedData['success'] = false;
                return $this->returnedData;
            }
        }

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

        $user = ($this->db->getConnection())->fetchRow("SELECT users.id, users.email, user_data.firstname, user_data.lastname FROM users, user_data WHERE user_data.user_id = users.id AND users.id = ".$usid);
        $fname = $user['firstname'];
        $lname = $user['lastname'];
        $mail = $user['email'];
        $newPassword = explode("@",$mail)[0];

        ($this->db->getConnection())->update('users', ["id"=>$usid], ["password"=>md5($newPassword)] );

        $mailRespond = MailSystem::sendMail($mail,"Zmiana hasła",
        "<p style='color:#ffffff'>Witaj!<b> ".$fname." ".$lname."</b></p>
        <p style='color:#ffffff'>Twoje hasło zostało właśnie zmienione
        Aktualnie możesz się zalogować za pomocą tych danych:</p>
        <p style='color:#ffffff'><b>Login:</b> ".$mail."</p>
        <p style='color:#ffffff'><b>Hasło:</b> ".$newPassword."</p>
        <p style='color:#ffffff'>Prosimy o niezwłoczne zalogowanie się na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a> w celu zmiany hasła. </p>");
        if( !$mailRespond["success"] ){
            $this->returnedData["error"]  = $mailRespond["error"];
            $this->returnedData["success"]  = false;
        }
           
        $this->returnedData["data"] = "Adres email: " . $mail;
        return $this->returnedData;
    }

    function registerNewApplayer($data){
        $mail = $data['email'];
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];

        $toReturn = null;
        $success = true;
        $error = "";

        $toReturn = ($this->db->getConnection())->fetchRowMany("SELECT id FROM users WHERE email = '".$mail."'");
        if( $toReturn != null ){
            $error = "Dany adres email istnieje już w bazie";
            $success = false;
            return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
        }

        $newPassword = $data['firstname'] . $data['lastname'];

        $data = [
            'email'   => $mail,
            'password'  => md5($newPassword),
            'id_role' => 3,
            'create_account_date'  => date("Y-m-d H:i:s")
        ];
        $newPersonId = ($this->db->getConnection())->insert('users', $data);
        if( isset($newPersonId) && $newPersonId >= 0 ){
            $data = [
                'user_id'   => $newPersonId,
                'firstname'  => $firstname ,
                'lastname' => $lastname,
            ];
            $user_data = ($this->db->getConnection())->insert('user_data', $data);
            if( isset($user_data) && $user_data >= 0 ){
                $mailRespond = MailSystem::sendMail($mail,"Nowe konto",
                "<p style='color:#ffffff'><b>Witaj! ".$firstname." ".$lastname."</b></p>
                <p style='color:#ffffff'>Twoje konto zostało właśnie utworzone
                Aktualnie możesz się zalogować za pomocą tych danych:</p>
                <p style='color:#ffffff'>Login: ".$mail."</p>
                <p style='color:#ffffff'>Hasło: ".$newPassword."</p>
                <p style='color:#ffffff'>Prosimy o niezwłoczne zalogowanie się na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a> w celu zmiany hasła i uzupełnienia profilu. </p>");
                if( !$mailRespond["success"] ){
                    $error  = $mailRespond["error"];
                    $success  = false;
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

        $settings = new Settings();
        $mainSettings = $settings->getMainPageSettings()['data'];
        if( !$isAdminAc ){
            $maxPlayersCount = $mainSettings->maxPlayers;
            if( $maxPlayersCount != 'MAX' ){
                $maxPlayersCount = (int) $maxPlayersCount;
                $playerCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM team_members WHERE id_team = ".$tmid));
                if( $playerCount >=$maxPlayersCount  ){
                    $error = "Niestety limit zawodników nie pozwala na dodanie kolejnego";
                    $success = false;
                    return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
                }
            }
        }else{
            $maxMasterCount = $mainSettings->maxMasters;
            if( $maxMasterCount != 'MAX' ){
                $maxMasterCount = (int) $maxMasterCount;
                $mastersCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM users WHERE id_role=2"));
                if( $mastersCount >=$maxMasterCount  ){
                    $error = "Niestety limit zawodników nie pozwala na dodanie kolejnego";
                    $success = false;
                    return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
                }
            }
        }

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
                $mailRespond = MailSystem::sendMail($mail,"Nowe konto",
                "<p style='color:#ffffff'><b>Witaj! ".$fname." ".$lname."</b></p>
                <p style='color:#ffffff'>Twoje konto zostao właśnie utworzone
                Aktualnie możesz się zalogować za pomocą tych danych:</p>
                <p style='color:#ffffff'>Login: ".$mail."</p>
                <p style='color:#ffffff'>Hasło: ".$newPassword."</p>
                <p style='color:#ffffff'>Prosimy o niezwłoczne zalogowanie się na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a> w celu zmiany hasła. </p>");
                if( !$mailRespond["success"] ){
                    $error  = $mailRespond["error"];
                    $success  = false;
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

    function getCountOfLicenseData($data){
        $settings = new Settings();
        $mainSettings = $settings->getMainPageSettings()['data'];
        $tmid = $data['tmid'];
        $teamCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM teams"));
        $mastersCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM users WHERE id_role=2"));
        $playerCount = count(($this->db->getConnection())->fetchRowMany("SELECT id FROM team_members WHERE id_team = ".$tmid));
        $this->returnedData['data'] = [
            "teamCount" => $teamCount,
            "mastersCount" => $mastersCount,
            "playerCount" => $playerCount,
            "maxTeams" => $mainSettings->maxTeams,
            "maxMasters" => $mainSettings->maxMasters,
            "maxPlayers" => $mainSettings->maxPlayers
        ];
        return $this->returnedData;
    }

    function deleteUser( $data ){
        $usid = $data['usid'];
        $tmid = $data['tmid'];
        $toReturn = null;
        $success = true;
        $error = "";
        
        ($this->db->getConnection())->delete('team_members', ['id_user' => $usid, "id_team"=>$tmid]);

        $role = ($this->db->getConnection())->fetchRow("SELECT id_role FROM users WHERE id=".$usid);

        if( isset($role) && $role['id_role'] == 2){
            ($this->db->getConnection())->delete('user_data', ['user_id' => $usid]);
            ($this->db->getConnection())->delete('users', ['id' => $usid]);
        }

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}