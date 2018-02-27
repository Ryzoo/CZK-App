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
        // | id  | id_team | listMinYear | listMaxYear | sezonStart | sezonEnd | eventInCalendar | maxPlayers | color  |
        // | int | int     | varchar     | varchar     | date       | date     | boolean         | int        | varchar |
        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `ma_settings` ( `id` INT NOT NULL AUTO_INCREMENT , `maxPlayers` INT NOT NULL , `id_team` INT NOT NULL , `listMinYear` SMALLINT(4) NOT NULL , `listMaxYear` SMALLINT(4) NOT NULL ,`color` VARCHAR(10) NOT NULL, `sezonStart` DATE NOT NULL , `sezonEnd` DATE NOT NULL , `eventInCalendar` BOOLEAN NOT NULL, `id_event` INT(11) NULL , PRIMARY KEY (`id`), UNIQUE (`id_team`)) ENGINE = InnoDB;");

        // ma_meet -- informacje na temat pojedynczego spotkania
        // | id  | id_team | date | description | teamScore | enemyScore | enemyName | status  | id_event | compositionData |
        // | int | int     | date | text        | int       | int        | varchar   | varchar | int      | JSON            |

        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `ma_meet` ( `id` INT NOT NULL AUTO_INCREMENT , `compositionData` LONGTEXT NULL, `id_event` INT NULL, `id_team` INT NOT NULL ,  `description` TEXT NOT NULL , `enemyName` VARCHAR(255) NOT NULL , `teamScore` INT(5) NULL , `enemyScore` INT(5) NULL , `status` VARCHAR(50) NOT NULL , `date` DATETIME NOT NULL , PRIMARY KEY (`id`), INDEX (`id_team`), UNIQUE (`id_playerComposition`)) ENGINE = InnoDB;");
    }

    function uninstall(){
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS ma_settings');
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS ma_meet');
    }

    function deleteMettingList($data){
        $id = $data['id'];
        ($this->db->getConnection())->delete('ma_meet',["id"=>$id]);
        $this->returnedData['data'] = ($this->db->getConnection())->delete('ma_meet',["id"=>$id]);
        return $this->returnedData;
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
                'maxPlayers' => 11,
                'color'=>"#ffffff"
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
        $mtid = isset($data['id']) ? $data['id'] : null;
        $compositionData = isset($data['compositionData']) ? $data['compositionData'] : null;

        if( strlen($meetModel['teamScore']) == 0) $meetModel['teamScore'] = NULL;
        if( strlen($meetModel['enemyScore']) == 0) $meetModel['enemyScore'] = NULL;
        $meetModel['id_event'] = NULL;
        $meetModel['compositionData'] = (isset($compositionData) && $compositionData != null )? json_encode($compositionData) : null;

        if(isset($mtid) && $mtid!=null && $mtid != ""){
            $meet = ($this->db->getConnection())->fetchRow('SELECT * FROM ma_meet WHERE id='.$mtid);
            $calendar = new Calendar();
            if( ($settings['eventInCalendar'] === 'true' || $settings['eventInCalendar'] === true) ){
                if(isset($meet["id_event"]) && $meet["id_event"] != null){
                    $calendar->editNews([
                        "id" => $meet["id_event"],
                        "title" => 'MECZ - '.$meetModel['enemyName'],
                        "start" => $meetModel['date'],
                        "end" => (new DateTime($meetModel['date']))->modify('+2 hours')->format('Y-m-d H:i:s'),
                    ]);
                }else{
                    $meetModel['id_event'] = $calendar->addNews([
                        "title" => 'MECZ - '.$meetModel['enemyName'],
                        "start" => $meetModel['date'],
                        "end" => (new DateTime($meetModel['date']))->modify('+2 hours')->format('Y-m-d H:i:s'),
                        "tmid" => $meetModel["id_team"],
                        "color" => '#F44336',
                    ])['data'];
                }
            }else{
                if(isset($meet["id_event"]) && $meet["id_event"] != null){
                    $calendar->deleteNews(["id"=>$meet["id_event"]]);
                    $meetModel['id_event'] = NULL;
                }
            }
            ($this->db->getConnection())->update("ma_meet",["id"=>$mtid],$meetModel);
        }else{
            if( ($settings['eventInCalendar'] === 'true' || $settings['eventInCalendar'] === true) ){
                $calendar = new Calendar();
                $meetModel['id_event'] = $calendar->addNews([
                    "title" => 'MECZ - '.$meetModel['enemyName'],
                    "start" => $meetModel['date'],
                    "end" => (new DateTime($meetModel['date']))->modify('+2 hours')->format('Y-m-d H:i:s'),
                    "tmid" => $meetModel["id_team"],
                    "color" => '#F44336',
                ])['data'];
            }
            ($this->db->getConnection())->insert("ma_meet",$meetModel);
        }


        $this->returnedData['data'] = $this->getMettingList(["tmid"=>$meetModel["id_team"],"settings"=>$settings])['data'];
        return $this->returnedData;
    }

}