<?php
namespace Modules\TrainingConspectus;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\Teams\Teams;
use Core\System\FileMenager;

class TrainingConspectus extends BasicModule {

    function install(){
        ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `conspectAnim` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_user` INT NOT NULL, `name` VARCHAR(255) NOT NULL, `tags` VARCHAR(255) NOT NULL, `mainImg` VARCHAR(255) NOT NULL ,  `mainImgShow` VARCHAR(255) NOT NULL, `fieldImage` VARCHAR(255) NOT NULL , `animFrame` MEDIUMTEXT NOT NULL ,`cwFieldType` VARCHAR(255) NOT NULL ,`cwMaxTime` VARCHAR(10) NOT NULL ,`cwMinTime` VARCHAR(10) NOT NULL ,`cwMaxPerson` VARCHAR(10) NOT NULL ,`cwMinPerson` VARCHAR(10) NOT NULL ,`cwOps` MEDIUMTEXT NOT NULL ,`cwWsk` MEDIUMTEXT NOT NULL ,`anchorHistory` MEDIUMTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `conspect` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_user` INT NOT NULL, `name` VARCHAR(255) NOT NULL , `master` VARCHAR(255) NOT NULL ,`sezon` VARCHAR(255) NOT NULL, `date` DATE NOT NULL , `team` VARCHAR(255) NOT NULL , `about` TINYTEXT NOT NULL , `tags` VARCHAR(255) NOT NULL , `data` MEDIUMTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS conspect');
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

    function saveConspect($data){
        $id = $data['id'];
        $coName = $data['coName'];
        $coMaster = $data['coMaster'];
        $coDate = $data['coDate'];
        $coSezon = $data['coSezon'];
        $coTeam = $data['coTeam'];
        $coOp = $data['coOp'];
        $coTags = trim($data['coTags']);
        $data = $data['data'];
        $usid = $data['usid'];

        if( $id >= 0 ){
            $this->returnedData['data'] = ($this->db->getConnection())->update("conspect",['id'=>$id],[
                "name"=>$coName,
                "master"=>$coMaster,
                "date"=>$coDate,
                "sezon"=>$coSezon,
                "team"=>$coTeam,
                "about"=>$coOp,
                "tags"=>$coTags,
                "data"=>$data,
                "id_user"=>$usid
            ]);
        }else{
            $this->returnedData['data'] = ($this->db->getConnection())->insert("conspect",[
                "name"=>$coName,
                "master"=>$coMaster,
                "date"=>$coDate,
                "sezon"=>$coSezon,
                "team"=>$coTeam,
                "about"=>$coOp,
                "tags"=>$coTags,
                "data"=>$data,
                "id_user"=>$usid
            ]);
        }
        return $this->returnedData;
    }

    function deleteConspect($data){
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('conspect',['id'=>$id]);
        return $this->returnedData;
    }

    function getConspectById($data){
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow("SELECT * FROM conspect WHERE id=".$id);
        return $this->returnedData;
    }

    function getFullConspectById($data){
        $id = $data['id'];
        $conspect = ($this->db->getConnection())->fetchRow("SELECT * FROM conspect WHERE id=".$id);
        $conData = json_decode($conspect['data']);

        $group = [
            'coStart'=>[],
            'coMiddle'=>[],
            'coEnd'=>[]
        ];

        for ($i=0; $i < count($conData); $i++) {
            $place = $conData[$i]->data->place;
            if($conData[$i]->type != 'simple'){
                $conData[$i]->data = $this->loadConspectAnim(['id'=>$conData[$i]->data->id])['data'];
            }
            array_push($group[$place],$conData[$i]);
        }

        $conspect['data'] = $group;
        $this->returnedData['data'] = $conspect;

        return $this->returnedData;
    }

    function getAllConspectList(){
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM conspect");
        return $this->returnedData;
    }

    function getAllTraining(){
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT id, name FROM conspectAnim ORDER BY CHAR_LENGTH(mainImg) DESC");
        return $this->returnedData;
    }

    function saveAnim($data){
        $name = $data['name'];
        $mainImg = strlen($data['mainImg']) > 2 ? FileMenager::saveFile($name.'.gif',base64_decode(str_replace(' ', '+', $data['mainImg'])),__DIR__.'/../../files/anim') : '';
        $mainImgShow = strlen($data['mainImgShow']) > 2 ? FileMenager::saveFile($name.'.jpg',base64_decode(str_replace(' ', '+', $data['mainImgShow'])),__DIR__.'/../../files/anim') : '';
        $animFrame = $data['animFrame'];
        $anchorHistory = $data['anchorHistory'];
        $tags = trim($data['tags']);
        $fieldImage = parse_url($data['fieldImage'], PHP_URL_PATH);

        $cwFieldType = $data['cwFieldType'];
        $cwMaxTime = $data['cwMaxTime'];
        $cwMinTime = $data['cwMinTime'];
        $cwMaxPerson = $data['cwMaxPerson'];
        $cwMinPerson = $data['cwMinPerson'];
        $cwOps = $data['cwOps'];
        $cwWsk = $data['cwWsk'];
        $usid = $data['usid'];

        return ($this->db->getConnection())->insert("conspectAnim",[
            "name"=>$name,
            "mainImg"=>$mainImg,
            "mainImgShow"=>$mainImgShow,
            "animFrame"=>$animFrame,
            "anchorHistory"=>$anchorHistory,
            "fieldImage"=>$fieldImage,
            "cwFieldType"=>$cwFieldType,
            "cwMaxTime"=>$cwMaxTime,
            "cwMinTime"=>$cwMinTime,
            "cwMaxPerson"=>$cwMaxPerson,
            "cwMinPerson"=>$cwMinPerson,
            "cwOps"=>$cwOps,
            "cwWsk"=>$cwWsk,
            "tags"=>$tags,
            "id_user"=>$usid
        ]);
    }

    function editAnim($data){
        $id = $data['id'];
        $name = $data['name'];
        $animFrame = $data['animFrame'];
        $tags = trim($data['tags']);
        $anchorHistory = $data['anchorHistory'];
        $fieldImage = parse_url($data['fieldImage'], PHP_URL_PATH);

        $cwFieldType = $data['cwFieldType'];
        $cwMaxTime = $data['cwMaxTime'];
        $cwMinTime = $data['cwMinTime'];
        $cwMaxPerson = $data['cwMaxPerson'];
        $cwMinPerson = $data['cwMinPerson'];
        $cwOps = $data['cwOps'];
        $cwWsk = $data['cwWsk'];
        $usid = $data['usid'];

        $animGifPath = ($this->db->getConnection())->fetchRow("SELECT mainImg, mainImgShow FROM conspectAnim WHERE id=".$id);
        FileMenager::deleteFile($animGifPath['mainImg']);
        FileMenager::deleteFile($animGifPath['mainImgShow']);
        $mainImg = strlen($data['mainImg']) > 2 ? FileMenager::saveFile($name.'.gif',base64_decode(str_replace(' ', '+', $data['mainImg'])),__DIR__.'/../../files/anim') : '';
        $mainImgShow = strlen($data['mainImgShow']) > 2 ? FileMenager::saveFile($name.'.jpg',base64_decode(str_replace(' ', '+', $data['mainImgShow'])),__DIR__.'/../../files/anim') : '';

        ($this->db->getConnection())->update("conspectAnim",['id'=>$id],[
            "name"=>$name,
            "mainImg"=>$mainImg,
            "mainImgShow"=>$mainImgShow,
            "animFrame"=>$animFrame,
            "anchorHistory"=>$anchorHistory,
            "fieldImage"=>$fieldImage,
            "cwFieldType"=>$cwFieldType,
            "cwMaxTime"=>$cwMaxTime,
            "cwMinTime"=>$cwMinTime,
            "cwMaxPerson"=>$cwMaxPerson,
            "cwMinPerson"=>$cwMinPerson,
            "cwOps"=>$cwOps,
            "cwWsk"=>$cwWsk,
            "tags"=>$tags,
            "id_user"=>$usid
        ]);

        return $data['id'];
    } 

    function getListOfAnimConspect(){
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM conspectAnim ORDER BY CHAR_LENGTH(mainImg) DESC");
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