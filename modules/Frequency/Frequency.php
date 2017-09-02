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

    function install(){
        $result = ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `freq` (`id` int(11) NOT NULL,`usid` int(11) NOT NULL,`tmid` int(11) NOT NULL,`date` date NOT NULL) DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;');
    }

    function uninstall(){
        $result = ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS freq');
    }
}