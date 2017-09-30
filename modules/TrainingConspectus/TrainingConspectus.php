<?php
namespace Modules\TrainingConspectus;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\Teams\Teams;
use Core\System\FileMenager;

class TrainingConspectus extends BasicModule {

    function install(){
     ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `conspectAnim` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL, `tags` VARCHAR(255) NOT NULL, `mainImg` VARCHAR(255) NOT NULL , `fieldImage` VARCHAR(255) NOT NULL , `animFrame` MEDIUMTEXT NOT NULL , `anchorHistory` MEDIUMTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
    }

    function uninstall(){
     ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS conspectAnim');
    }

    function saveConspectAnim($data){
        if($data['id'] == -1){
            $this->returnedData['data'] = $this->saveAnim($data);
        }else{
            $this->returnedData['data'] = $this->editAnim($data);
        }
        return $this->returnedData;
    }

    function saveAnim($data){
        $name = $data['name'];
        $mainImg = FileMenager::saveFile($name.'.png',base64_decode(str_replace(' ', '+', $data['mainImg'])),__DIR__.'/anim/pngs'); 
        $animFrame = $data['animFrame'];
        $anchorHistory = $data['anchorHistory'];
        $tags = trim($data['tags']);
        $fieldImage = parse_url($data['fieldImage'], PHP_URL_PATH);

        return ($this->db->getConnection())->insert("conspectAnim",[
            "name"=>$name,
            "mainImg"=>$mainImg,
            "animFrame"=>$animFrame,
            "anchorHistory"=>$anchorHistory,
            "fieldImage"=>$fieldImage,
            "tags"=>$tags
        ]);
    }

    function editAnim($data){
        $id = $data['id'];
        $name = $data['name'];
        $animFrame = $data['animFrame'];
        $tags = trim($data['tags']);
        $anchorHistory = $data['anchorHistory'];
        $fieldImage = parse_url($data['fieldImage'], PHP_URL_PATH);

        $animGifPath = ($this->db->getConnection())->fetchRow("SELECT mainImg FROM conspectAnim WHERE id=".$id);
        FileMenager::deleteFile($animGifPath['mainImg']);
        $mainImg = FileMenager::saveFile($name.'.png',base64_decode(str_replace(' ', '+', $data['mainImg'])),__DIR__.'/anim/pngs'); 

        ($this->db->getConnection())->update("conspectAnim",['id'=>$id],[
            "name"=>$name,
            "mainImg"=>$mainImg,
            "animFrame"=>$animFrame,
            "anchorHistory"=>$anchorHistory,
            "fieldImage"=>$fieldImage,
            "tags"=>$tags
        ]);

        return $data['id'];
    }
    

    function getListOfAnimConspect(){
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM conspectAnim ORDER BY name");
        return $this->returnedData;
    }

    function deleteAnimConspect($data){
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('conspectAnim',['id'=>$id]);
        return $this->returnedData;
    }

    function loadConspectAnim($data){
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow("SELECT * FROM conspectAnim WHERE id=".$id);
        return $this->returnedData;
    }
}