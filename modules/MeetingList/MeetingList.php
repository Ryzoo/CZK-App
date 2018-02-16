<?php
namespace Modules\MeetingList;

use Core\System\BasicModule;
use Core\Teams\Teams;
use \Datetime;
use Modules\Calendar\Calendar;
use Modules\StatsManager\StatsManager;

class MeetingList extends BasicModule
{
    function install(){
        // MEETING AGENDA - terminarz spotkań
        // db prefix ma_

        // ma_settings -- ustawienia modulu dla danego teamu
        // | id  | id_team | listMinYear | listMaxYear | sezonStart | sezonEnd | eventInCalendar |
        // | int | int     | varchar     | varchar     | date       | date     | boolean         |
        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `ma_settings` ( `id` INT NOT NULL AUTO_INCREMENT , `id_team` INT NOT NULL , `listMinYear` SMALLINT(4) NOT NULL , `listMaxYear` SMALLINT(4) NOT NULL , `sezonStart` DATE NOT NULL , `sezonEnd` DATE NOT NULL , `eventInCalendar` BOOLEAN NOT NULL, `id_event` INT(11) NULL , PRIMARY KEY (`id`), UNIQUE (`id_team`)) ENGINE = InnoDB;");

        // ma_meet -- informacje na temat pojedynczego spotkania
        // | id  | id_team | date | id_playerComposition  | description | teamScore | enemyScore | enemyName | status  |
        // | int | int     | date | int                   | text        | int       | int        | varchar   | varchar |
        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `ma_meet` ( `id` INT NOT NULL AUTO_INCREMENT , `id_team` INT NOT NULL , `id_playerComposition` INT NULL , `description` TEXT NOT NULL , `enemyName` VARCHAR(255) NOT NULL , `teamScore` INT(5) NULL , `enemyScore` INT(5) NULL , `status` VARCHAR(50) NOT NULL , `date` DATETIME NOT NULL , PRIMARY KEY (`id`), INDEX (`id_team`), UNIQUE (`id_playerComposition`)) ENGINE = InnoDB;");

    }

    function uninstall(){
    }

    function getMettingListSettings($data){
        $tmid = $data['tmid'];
        $settings = ($this->db->getConnection())->fetchRow('SELECT * FROM ma_settings WHERE id_team='.$tmid);
        if(!isset($settings) || count($settings) <= 0){
            $currrentYear = date("Y");
            $settings = [
                'id_team' => $tmid,
                'listMinYear' => $currrentYear,
                'listMaxYear' => $currrentYear,
                'sezonStart' => "01-01-".$currrentYear,
                'sezonEnd' => "31-12-".$currrentYear,
                'eventInCalendar' => true,
            ];
            ($this->db->getConnection())->insert('ma_settings',$settings);
        }
        $this->returnedData['data'] = $settings;
        return $this->returnedData;
    }

    function updateMettingListSettings($data){
        $tmid = $data['tmid'];
        $settings = $data['settings'];
        $settings['eventInCalendar'] = ($settings['eventInCalendar'] === 'true' || $settings['eventInCalendar'] === true) ? '1' : '0';
        $this->returnedData['data'] = ($this->db->getConnection())->update('ma_settings',["id_team"=>$tmid],$settings);
        return $this->returnedData;
    }

    function getMettingList($data){
        $tmid = $data['tmid'];
        $settings = $data['settings'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany('SELECT * FROM ma_meet WHERE YEAR(date) >= '.$settings['listMinYear'].' AND YEAR(date) <= '.$settings['listMaxYear'].' AND id_team='.$tmid.' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) LIMIT 100');

        if(isset($this->returnedData['data']))
        foreach($this->returnedData['data'] as $value  ){
            if( $value['status'] == "Oczekiwanie" && (new DateTime()) > (new DateTime($value['date'])) ){
                $value['status'] = "Zakończone";
                ($this->db->getConnection())->update('ma_meet',["id"=>$value['id']],['status' => "Zakończone"]);
            }
        }

        return $this->returnedData;
    }

    function getMeetStats($data){
        $tmid = $data['tmid'];
        $settings = $data['settings'];

        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT status, COUNT(status) as count FROM ma_meet WHERE date >= DATE('".$settings['sezonStart']."') AND date <= DATE('".$settings['sezonEnd']."') AND id_team=".$tmid." GROUP BY status");
        return $this->returnedData;
    }

    function getMeetPlayers($data){
        $tmid = $data['tmid'];
        $users = (new Teams)->getUserIdFromTeam(["tmid"=>$tmid])['data'];
        $userIdArray = [];
        if(isset($users))
        foreach($users as $element){
            array_push($userIdArray,$element['id']);
        }

        $stManager = new StatsManager();
        $this->returnedData['data'] = $stManager->getStats([
            "usid"=>$userIdArray,
            "tmid"=>$tmid,
            "prc"=>true,
            "last"=>true,
        ])['data'];
        return $this->returnedData;
    }

    function addNewMeet($data){
        $meetModel = $data['meetModel'];
        $settings = $data['settings'];

        if( strlen($meetModel['id_playerComposition']) == 0) $meetModel['id_playerComposition'] = NULL;
        if( strlen($meetModel['teamScore']) == 0) $meetModel['teamScore'] = NULL;
        if( strlen($meetModel['enemyScore']) == 0) $meetModel['enemyScore'] = NULL;
        $meetModel['id_event'] = NULL;

        if( ($settings['eventInCalendar'] === 'true' || $settings['eventInCalendar'] === true) ){
            $calendar = new Calendar();
            $meetModel['id_event'] = $calendar->addNews([
                "title" => 'MECZ - '.$meetModel['enemyName'],
                "start" => $meetModel['date'],
                "end" => (new DateTime($meetModel['date']))->modify('+2 hours')->format('Y-m-d H:i:s'),
                "tmid" => $meetModel["id_team"],
                "color" => '#F44336'
            ])['data'];
        }

        ($this->db->getConnection())->insert("ma_meet",$meetModel);
        $this->returnedData['data'] = $this->getMettingList(["tmid"=>$meetModel["id_team"],"settings"=>$settings])['data'];
        return $this->returnedData;
    }

}