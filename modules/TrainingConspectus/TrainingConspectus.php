<?php
namespace Modules\TrainingConspectus;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\Teams\Teams;

class TrainingConspectus extends BasicModule {

    function install(){
     // ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `payment_status` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
    }

    function uninstall(){
     // ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS payment_status');
    }

}