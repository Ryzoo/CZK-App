<?php
namespace Modules\Timetable;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;

class Timetable extends BasicModule {

    function install(){
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `timetable` ( `id` INT NOT NULL AUTO_INCREMENT , `id_team` INT NOT NULL , `title` VARCHAR(255) NOT NULL , `day_name` VARCHAR(30) NOT NULL , `time` VARCHAR(5) NOT NULL,`color` VARCHAR(20) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS timetable');
    }
}