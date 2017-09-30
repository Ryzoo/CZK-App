<?php
namespace Modules\Timetable;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;

class Timetable extends BasicModule {

    function install(){
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `timetable` ( `id` INT NOT NULL AUTO_INCREMENT , `id_team` INT NOT NULL , `title` VARCHAR(255) NOT NULL , `day_name` VARCHAR(30) NOT NULL , `time` VARCHAR(5) NOT NULL, `timeEnd` VARCHAR(5) NOT NULL,`color` VARCHAR(20) NOT NULL DEFAULT '#0087ff' , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS timetable');
    }

    function getTimetableEvent($data){
      $tmid = $data["tmid"];
      $allEvent = ($this->db->getConnection())->fetchRowMany("SELECT `id`, `id_team`, `title`, `day_name`, `time`,`timeEnd`, `color` FROM `timetable` WHERE id_team=".$tmid." ORDER BY time");
      $this->returnedData["data"] = [
        "Poniedziałek"=>[],
        "Wtorek"=>[],
        "Środa"=>[],
        "Czwartek"=>[],
        "Piątek"=>[],
        "Sobota"=>[],
        "Niedziela"=>[]
      ];
      for ($i=0; $i < count($allEvent) ; $i++) { 
          array_push( $this->returnedData["data"][ $allEvent[$i]["day_name"] ], $allEvent[$i]);
      }
      return $this->returnedData;
    }

    function getTimetableEventFull($data){
      $tmid = $data["tmid"];
      $this->returnedData["data"]= ($this->db->getConnection())->fetchRowMany("SELECT `id`, `id_team`, `title`,`timeEnd`, `day_name`, `time`, `color` FROM `timetable` WHERE id_team=".$tmid." ORDER BY time");
      return $this->returnedData;
    }

    function addTimetableEvent($data){
      $title = $data['title'];
      $tmid = $data['tmid'];
      $day = $data['day'];
      $time = $data['time'];
      $timeEnd = $data['timeEnd'];
      $color = $data['color'];
      $this->returnedData["data"] = ($this->db->getConnection())->insert("timetable",[
        "title"=>$title,
        "id_team"=>$tmid,
        "day_name"=>$day,
        "time"=>$time,
        "timeEnd"=>$timeEnd,
        "color"=>$color,
      ]);
      return $this->returnedData;
    }

    function deleteTimetableEvent($data){
      $id = $data['id'];
      $this->returnedData["data"] = ($this->db->getConnection())->delete("timetable",["id"=>$id]);
      return $this->returnedData;
    }
}