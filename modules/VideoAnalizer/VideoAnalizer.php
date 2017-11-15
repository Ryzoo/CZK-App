<?php
namespace Modules\VideoAnalizer;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\Teams\Teams;

class VideoAnalizer extends BasicModule {
    private $teamsMenager;

    function install(){
      ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `payment_status` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS payment_status');
    }

    function checkIt(){
      var_dump(shell_exec("ffmpeg"));
    }

}