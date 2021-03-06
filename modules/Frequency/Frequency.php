<?php
namespace Modules\Frequency;

use Core\System\BasicModule;
use Core\Teams\Teams;

class Frequency extends BasicModule {

    public function getFrequency($data){
        $tmid = $data['tmid'];
        $year = $data['year'];
        $month = $data['month'];
        $day = $data['day'];

        $team = new Teams();
        $allTeamsUser = ($team->getUserFromTeam(["tmid"=>$tmid]))['data'];

        $dayInMonth = date('t', mktime(0, 0, 0, $month, 1, $year));

         for ($x=0; $x < count($allTeamsUser); $x++) { 
            array_push($this->returnedData['data'],[
                "usid"=>$allTeamsUser[$x]['usid'],
                "firstname"=>$allTeamsUser[$x]['firstname'],
                "lastname"=>$allTeamsUser[$x]['lastname'],
                "onTraining"=>$this->wosOnTraining($tmid,$allTeamsUser[$x]['usid'],$year,$month,$day),
            ]);
        }
        return $this->returnedData;
    }

    function wosOnTraining($tmid,$usid,$year,$month,$day){
        $dateSrc = $year.'-'.$month.'-'.$day.' 0:0:0';
        $date = date("Y-m-d", strtotime($dateSrc));
        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT * FROM freq WHERE freq.tmid='.$tmid.' AND freq.usid='.$usid.' AND DATE_FORMAT(freq.date, "%Y-%m-%d")="'.$date.'"' );
        return (isset($toReturn) && $toReturn != null);
    }

    function setOnTraining($data){
        $tmid = $data['tmid'];
        $usid = $data['usid'];
        $year = $data['year'];
        $month = $data['month'];
        $day = $data['day'];

        $dateSrc = $year.'-'.$month.'-'.$day.' 0:0:0';
        $date = date("Y-m-d", strtotime($dateSrc));

        $data=[
            "usid" => $usid,
            "tmid" => $tmid,
            "date" => $date,
        ];

        ($this->db->getConnection())->insert('freq', $data);

        return $this->returnedData;
    }

    function setOffTraining($data){
        $tmid = $data['tmid'];
        $usid = $data['usid'];
        $year = $data['year'];
        $month = $data['month'];
        $day = $data['day'];

        $dateSrc = $year.'-'.$month.'-'.$day.' 0:0:0';
        $date = date("Y-m-d", strtotime($dateSrc));

        $condsUsers=[
            "usid" => $usid,
            "tmid" => $tmid,
            "date" => $date,
        ];

        ($this->db->getConnection())->delete('freq', $condsUsers);

        return $this->returnedData;
    }

    function updateDayStatusFreq($data){
        $tmid = $data['tmid'];
        $date = $data['data'];
        $status = $data['status'];
        $reason = isset($data['reason']) ? $data['reason'] : "";
        $dayStatus = ($this->db->getConnection())->fetchRow('SELECT * FROM freq_team_day_status WHERE date = DATE(\''.$date.'\') AND id_team = '. $tmid);
        if (isset($dayStatus)){
            ($this->db->getConnection())->update('freq_team_day_status', ['id'=>$dayStatus['id']], [
                "status"=>$status,
                "reason"=>$reason
            ]);
        }else{
            ($this->db->getConnection())->insert('freq_team_day_status', [
                "status"=>$status,
                "id_team"=>$tmid,
                "date"=>$date,
                "reason"=>$reason
            ]);
        }
        return $this->returnedData;
    }

    function deleteDayStatusFreq($data){
        $tmid = $data['tmid'];
        $date = $data['data'];
        $id_freq = ($this->db->getConnection())->fetchRow('SELECT * FROM freq_team_day_status WHERE date = DATE(\''.$date.'\') AND id_team = '. $tmid)['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('freq_team_day_status', ['id'=>$id_freq]);
        return $this->returnedData;
    }

    function getDayStatusFreq($data){
        $tmid = $data['tmid'];
        $date = $data['data'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow('SELECT * FROM freq_team_day_status WHERE date = DATE(\''.$date.'\') AND id_team = '. $tmid);
        return $this->returnedData;
    }

    function getMonthFrequency($data) {
        $tmid = $data['tmid'];
        $month = $data['month'];
        $year = $data['year'];
        $monthTrainingCount = ($this->db->getConnection())->fetchRow('SELECT COUNT(*) as ilosc FROM `freq_team_day_status` WHERE MONTH(date) = '.$month.' AND YEAR(date) = '.$year.' AND id_team = '. $tmid)['ilosc'];
        $teamPlayers = ($this->db->getConnection())->fetchRowMany('SELECT id_user as usid FROM `team_members` JOIN users on users.id = team_members.id_user WHERE users.id_role = 3 AND id_team = '. $tmid);
        $userFreq = ($this->db->getConnection())->fetchRowMany("SELECT COUNT(*) as ilosc, usid FROM `freq` WHERE MONTH(date) = ".$month." AND YEAR(date) = ".$year." AND tmid = ".$tmid." GROUP BY usid");
        $allCount = 0;
        foreach ($teamPlayers as $tmpl) {
            $count = 0;
            foreach ($userFreq as $usfr) {
                if ($tmpl['usid'] == $usfr['usid']){
                    $count = $usfr['ilosc'];
                    break;
                }
            }
            $allCount += $count;
        }

        $dziel = (count($teamPlayers)*$monthTrainingCount);
        if((!isset($dziel)) || ($dziel == 0)){
            $this->returnedData['data'] = 0;
        }else{
            $this->returnedData['data'] = round(($allCount / $dziel) * 100,2);
        }

        return $this->returnedData;
    }

    function getCurrentUserDayFrequency($data){
        $tmid = $data['tmid'];
        $day = $data['day'];
        $month = $data['month'];
        $year = $data['year'];
        $usid = $data['usid'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow('SELECT DAY(date) as dzien FROM `freq` WHERE MONTH(date) = '.$month.' and YEAR(date) = '.$year.' AND DAY(date) = '.$day.' AND tmid = '.$tmid.' AND usid = '. $usid);

        return $this->returnedData;
    }

    function getMonthPlayerFrequency($data) {
        $tmid = $data['tmid'];
        $month = $data['month'];
        $year = $data['year'];
        $usid = $data['usid'];
        $monthTrainingCount = ($this->db->getConnection())->fetchRow('SELECT COUNT(*) as ilosc FROM `freq_team_day_status` WHERE MONTH(date) = '.$month.' AND YEAR(date) = '.$year.' AND id_team = '. $tmid)['ilosc'];
        $userFreq = ($this->db->getConnection())->fetchRow("SELECT COUNT(*) as ilosc, usid FROM `freq` WHERE MONTH(date) = ".$month." AND YEAR(date) = ".$year." AND tmid = ".$tmid." AND usid = ".$usid." GROUP BY usid")['ilosc'];

        $dziel = $monthTrainingCount;
        if((!isset($dziel)) || ($dziel == 0)){
            $this->returnedData['data'] = 0;
        }else{
            $this->returnedData['data'] = round(($userFreq / $dziel) * 100,2);
        }

        return $this->returnedData;
    }


    function install(){
        ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `freq` (`id` int(11) NOT NULL,`usid` int(11) NOT NULL,`tmid` int(11) NOT NULL,`date` date NOT NULL) DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;');
        ($this->db->getConnection())->executeSql('ALTER TABLE `freq` ADD PRIMARY KEY (`id`), MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
        ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `freq_team_day_status` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_team` INT NOT NULL,`reason` VARCHAR(255) NULL, `date` DATE NOT NULL , `status` INT(1) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');

    }

    function uninstall(){
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS freq');
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS freq_team_day_status');
    }
}