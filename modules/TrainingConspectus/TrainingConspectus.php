<?php

namespace Modules\TrainingConspectus;

use Core\Players\Players;
use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\System\FileMenager;
use FFMpeg\FFMpeg;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Format\Video\X264;
use FFMpeg\Coordinate\TimeCode;


class TrainingConspectus extends BasicModule
{

    function install()
    {
        ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `conspectAnim` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_user` INT NOT NULL , `shared_ids` TINYTEXT NOT NULL, `name` VARCHAR(255) NOT NULL, `sezon` VARCHAR(255) NOT NULL, `tags` VARCHAR(255) NOT NULL, `mainImg` VARCHAR(255) NOT NULL , `frameBeetween` INT NOT NULL, `qualityAnim` INT NOT NULL, `fps` INT NOT NULL , `mainImgShow` VARCHAR(255) NOT NULL, `fieldImage` VARCHAR(255) NOT NULL , `animFrame` MEDIUMTEXT NOT NULL ,`cwFieldType` VARCHAR(255) NOT NULL ,`cwMaxTime` VARCHAR(10) NOT NULL ,`cwMinTime` VARCHAR(10) NOT NULL ,`cwMaxPerson` VARCHAR(10) NOT NULL ,`cwMinPerson` VARCHAR(10) NOT NULL ,`cwOps` MEDIUMTEXT NOT NULL ,`cwWsk` MEDIUMTEXT NOT NULL ,`anchorHistory` MEDIUMTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
        ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `conspect` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_user` INT NOT NULL, `shared_ids` TINYTEXT NOT NULL, `name` VARCHAR(255) NOT NULL , `powerCount` VARCHAR(255) NOT NULL, `userCount` VARCHAR(255) NOT NULL ,`place` VARCHAR(255) NOT NULL, `date` DATETIME NOT NULL, `playTime` DATETIME NOT NULL , `team` VARCHAR(255) NOT NULL , `about` TINYTEXT NOT NULL , `tags` VARCHAR(255) NOT NULL , `data` MEDIUMTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall()
    {
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS conspect');
        ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS conspectAnim');
    }

    function saveConspectAnim($data)
    {
        if ($data['id'] == -1) {
            $this->returnedData['data'] = $this->saveAnim($data);
        } else {
            $this->returnedData['data'] = $this->editAnim($data);
        }
        return $this->returnedData;
    }

    function saveConspect($data)
    {
        $id = $data['id'];
        $coName = $data['coName'];
        $usid = $data['id_user'];
        $coDate = $data['coDate'];
        $coPlace = $data['coPlace'];
        $coTeam = $data['coTeam'];
        $coOp = $data['coOp'];
        $sezon = $data['sezon'];
        $coTags = trim($data['coTags']);
        $powerCount = $data['powerCount'];
        $userCount = $data['userCount'];
        $data = $data['data'];

        if ($id >= 0) {
            $this->returnedData['data'] = ($this->db->getConnection())->update("conspect", ['id' => $id], [
                "name" => $coName,
                "id_user" => $usid,
                "date" => $coDate,
                "place" => $coPlace,
                "team" => $coTeam,
                "sezon" => $sezon,
                "powerCount" => $powerCount,
                "userCount" => $userCount,
                "about" => $coOp,
                "tags" => $coTags,
                "data" => $data
            ]);
        } else {
            $this->returnedData['data'] = ($this->db->getConnection())->insert("conspect", [
                "name" => $coName,
                "id_user" => $usid,
                "date" => $coDate,
                "place" => $coPlace,
                "team" => $coTeam,
                "sezon" => $sezon,
                "powerCount" => $powerCount,
                "userCount" => $userCount,
                "about" => $coOp,
                "tags" => $coTags,
                "data" => $data
            ]);
        }
        return $this->returnedData;
    }

    function deleteConspect($data)
    {
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('conspect', ['id' => $id]);
        return $this->returnedData;
    }

    function getConspectById($data)
    {
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow("SELECT * FROM conspect WHERE id=" . $id);
        if( isset($this->returnedData['data']["date"]) ){
            $this->returnedData['data']["time"] = date("H:i:s",strtotime($this->returnedData['data']["date"]));
            $this->returnedData['data']["date"] = date("d/m/Y",strtotime($this->returnedData['data']["date"]));
        }
        return $this->returnedData;
    }

    function getFullConspectById($data)
    {
        $id = $data['id'];
        $conspect = ($this->db->getConnection())->fetchRow("SELECT conspect.*, user_data.firstname, user_data.lastname FROM conspect, user_data WHERE user_data.user_id = conspect.id_user && conspect.id=" . $id);
        if( isset($conspect["date"]) ){
            $conspect["time"] = date("H:i",strtotime($conspect["date"]));
            $conspect["date"] = date("d/m/Y",strtotime($conspect["date"]));
        }
        $conData = json_decode($conspect['data']);

        $group = [
            'coStart' => [],
            'coMiddle' => [],
            'coEnd' => []
        ];

        $minTime = 0;
        $maxTime = 0;
     
        for ($i = 0; $i < count($conData); $i++) {
            $place = $conData[$i]->data->place;
            if ($conData[$i]->type != 'simple') {
                $conData[$i]->data = $this->loadConspectAnim(['id' => $conData[$i]->data->id])['data'];
                $minTime += (int)$conData[$i]->data["cwMinTime"];
                $maxTime += (int)$conData[$i]->data["cwMaxTime"];
            }else{
                $minTime += (int)$conData[$i]->data->timeMin;
                $maxTime += (int)$conData[$i]->data->timeMax;
            }
           
            array_push($group[$place], $conData[$i]);
        }

        $conspect['data'] = $group;
        $conspect['playTime'] = $minTime."min.-".$maxTime."min.";
        $this->returnedData['data'] = $conspect;

        return $this->returnedData;
    }

    function getAllConspectList($data)
    {
        $usid = $data['usid'];
        $token = $data['token'];
        $isKoord = $this->auth->checkPerm($token, "KOORD");

        if ($isKoord) {
            $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT conspect.*, user_data.firstname, user_data.lastname FROM conspect, user_data WHERE user_data.user_id = conspect.id_user ");
        } else {
            $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT conspect.*, user_data.firstname, user_data.lastname FROM conspect, user_data WHERE user_data.user_id = conspect.id_user AND (id_user = " . $usid . " OR conspect.shared_ids LIKE '%" . $usid . "%' ) ");
        }

        if(isset($this->returnedData['data']))
        foreach ($this->returnedData['data']  as $key => $value) {
            if( isset($this->returnedData['data'][$key]["date"]) ){
                $this->returnedData['data'][$key]["time"] = date("H:i",strtotime($this->returnedData['data'][$key]["date"]));
                $this->returnedData['data'][$key]["date"] = date("d/m/Y",strtotime($this->returnedData['data'][$key]["date"]));
            }
        }

        return $this->returnedData;
    }

    function ccc(){
        $ffmpeg = FFMpeg::create(array(
            'ffmpeg.binaries'  => '/usr/local/share/ffmpeg/ffmpeg',
            'ffprobe.binaries' => '/usr/local/share/ffmpeg/ffprobe'
        ));
        $video = $ffmpeg->open('video.mpg');
        $video
            ->filters()
            ->resize(new Dimension(320, 240))
            ->synchronize();
        $video
            ->frame( TimeCode::fromSeconds(2))
            ->save('frame.jpg');
        $video
            ->save(new X264(), 'export-x264.mp4');
    }

    function getConspectAnimObj(){
        $json = new JSON();
        $objList = $json->decodeFile(__DIR__. '/conspectObj.json' );
        $objReturned = [];
        foreach ($objList->objectList as $obj){
            $categoryItem = "<div class='categories tooltipped' ".(isset($obj->config)?"data-config='".$obj->config."'":"")." data-position='bottom' data-delay='50' data-tooltip='".(isset($obj->tooltip)?$obj->tooltip:"" )."' ".(isset($obj->style) ? "style='".$obj->style."'" : "")." ".(isset($obj->ngClick)?"ng-click='".$obj->ngClick."'":"")." >";
            $categoryItem .= "<i class='fa ".(isset($obj->icon)?$obj->icon:"" )." fa-2x' aria-hidden='true'></i>";
            $categoryItem .= "</div>";
            $objToAdd = null;
            if( isset($obj->objectsIn) && isset($obj->objectsIn->list))
            {
                $objToAdd = "<div class='itemsList' ".(isset($obj->objectsIn->ngShow) ? "ng-show='".$obj->objectsIn->ngShow."'" : "").">";
                foreach ($obj->objectsIn->list as $objIn) {
                    $addedClass = "";
                    if( isset($objIn->addClass) )
                    foreach ($objIn->addClass as $classAdd){
                        $addedClass .= " ".$classAdd;
                    }
                    $objToAdd .= "<div class='categoryItems ".$addedClass."' ".(isset($objIn->ngClick)?"ng-click='".$objIn->ngClick."'":"")." >";
                    $objToAdd .= "<img ".(isset($objIn->config)?"data-config='".$objIn->config."'":"")." src='/modules/TrainingConspectus/assets/media/".$objIn->img."' class='tooltipped' data-position='bottom' data-delay='50' data-tooltip='".$objIn->tooltip."'>";
                    $objToAdd .= "</div>";
                }
                $objToAdd .= "</div>";
            }

            array_push($objReturned,[
                "category" => $categoryItem,
                "obj" => $objToAdd
            ]);
        }

        $this->returnedData['data'] = $objReturned;
        return $this->returnedData;
    }

    function getSharedListForConsp($data)
    {
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspect WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        if( strlen($sharedList) >0 )
            $sharedList = explode(",", $sharedList);
        else
            $sharedList = [];
        $sharedArray = [];
        foreach ($sharedList as $keyIn => $sharedPerson) {
            $userData = explode(" ", $this->auth->getUserName($sharedPerson));
            array_push($sharedArray, [
                "id" => $sharedPerson,
                "firstname" => $userData[0],
                "lastname" => $userData[1]
            ]);
        }

        $this->returnedData['data'] = $sharedArray;
        return $this->returnedData;
    }

    function getAvailableSharedMasterForConsp($data)
    {
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspect WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        $sharedList = explode(",", $sharedList);

        $playersManager = new Players();
        $allMasters = $playersManager->getAllMaster()["data"];

        $this->returnedData['data'] = [];
        if(isset($allMasters)&&isset($allMasters))
        foreach ($allMasters as $master) {
            $canAdd = true;
            foreach ($sharedList as $shared) {
                if ($master["usid"] == $shared) {
                    $canAdd = false;
                    break;
                }
            }
            if ($canAdd) $this->returnedData['data'][$master["firstname"] . " " . $master["lastname"] . "-" . $master["usid"]] = null;
        }
        return $this->returnedData;
    }

    function addSharedForConsp($data)
    {
        $usid = $data['usid'];
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspect WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        if (strlen($sharedList) == 0) {
            $sharedList = "" . $usid;
        } else {
            $sharedList = $sharedList . "," . $usid;
        }
        $this->returnedData['data'] = ($this->db->getConnection())->update("conspect", ["id" => $aid], ["shared_ids" => $sharedList]);
        return $this->returnedData;
    }

    function deleteSharedForConsp($data)
    {
        $usid = $data['usid'];
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspect WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        $sharedList = str_replace($usid . ",", "", $sharedList);
        $sharedList = str_replace("," . $usid, "", $sharedList);
        $sharedList = str_replace($usid, "", $sharedList);
        $this->returnedData['data'] = ($this->db->getConnection())->update("conspect", ["id" => $aid], ["shared_ids" => $sharedList]);
        return $this->returnedData;
    }

    function getAllTraining()
    {
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT id, name FROM conspectAnim ORDER BY CHAR_LENGTH(mainImg) DESC");
        return $this->returnedData;
    }


    function saveAnim($data)
    {
        $name = $data['name'];
        $fileName = substr(str_replace(".","_",$data['name']), 0 , strlen($name) > 10 ? 10 : strlen($name) );
        $mainImg = strlen($data['mainImg']) > 2 ? FileMenager::saveFile($fileName . '.gif', base64_decode(str_replace(' ', '+', $data['mainImg'])), __DIR__ . '/../../files/anim') : '';
        $mainImgShow = strlen($data['mainImgShow']) > 2 ? FileMenager::saveFile($fileName . '.jpg', base64_decode(str_replace(' ', '+', $data['mainImgShow'])), __DIR__ . '/../../files/anim') : '';
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
        $frameBeetween = $data['frameBeetween'];
        $qualityAnim = $data['qualityAnim'];
        $fps = $data['fps'];
        $usid = $data['usid'];

        return ($this->db->getConnection())->insert("conspectAnim", [
            "name" => $name,
            "mainImg" => $mainImg,
            "mainImgShow" => $mainImgShow,
            "animFrame" => $animFrame,
            "anchorHistory" => $anchorHistory,
            "fieldImage" => $fieldImage,
            "cwFieldType" => $cwFieldType,
            "cwMaxTime" => $cwMaxTime,
            "cwMinTime" => $cwMinTime,
            "cwMaxPerson" => $cwMaxPerson,
            "cwMinPerson" => $cwMinPerson,
            "cwOps" => $cwOps,
            "cwWsk" => $cwWsk,
            "tags" => $tags,
            "frameBeetween" => $frameBeetween,
            "qualityAnim" => $qualityAnim,
            "fps" => $fps,
            "id_user" => $usid,
        ]);
    }

    function editAnim($data)
    {
        $id = $data['id'];
        $name = $data['name'];
        $fileName = substr(str_replace(".","_",$data['name']), 0 , strlen($name) > 10 ? 10 : strlen($name) );
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
        $frameBeetween = $data['frameBeetween'];
        $qualityAnim = $data['qualityAnim'];
        $fps = $data['fps'];
        $usid = $data['usid'];

        $animGifPath = ($this->db->getConnection())->fetchRow("SELECT mainImg, mainImgShow FROM conspectAnim WHERE id=" . $id);
        FileMenager::deleteFile($animGifPath['mainImg']);
        FileMenager::deleteFile($animGifPath['mainImgShow']);
        $mainImg = strlen($data['mainImg']) > 2 ? FileMenager::saveFile($fileName . '.gif', base64_decode(str_replace(' ', '+', $data['mainImg'])), __DIR__ . '/../../files/anim') : '';
        $mainImgShow = strlen($data['mainImgShow']) > 2 ? FileMenager::saveFile($fileName . '.jpg', base64_decode(str_replace(' ', '+', $data['mainImgShow'])), __DIR__ . '/../../files/anim') : '';

        ($this->db->getConnection())->update("conspectAnim", ['id' => $id], [
            "name" => $name,
            "mainImg" => $mainImg,
            "mainImgShow" => $mainImgShow,
            "animFrame" => $animFrame,
            "anchorHistory" => $anchorHistory,
            "fieldImage" => $fieldImage,
            "cwFieldType" => $cwFieldType,
            "cwMaxTime" => $cwMaxTime,
            "cwMinTime" => $cwMinTime,
            "cwMaxPerson" => $cwMaxPerson,
            "cwMinPerson" => $cwMinPerson,
            "cwOps" => $cwOps,
            "cwWsk" => $cwWsk,
            "tags" => $tags,
            "frameBeetween" => $frameBeetween,
            "qualityAnim" => $qualityAnim,
            "fps" => $fps,
            "id_user" => $usid,
        ]);

        return $data['id'];
    }

    function getListOfAnimConspect($data)
    {
        $usid = $data['usid'];
        $token = $data['token'];
        $isKoord = $this->auth->checkPerm($token, "KOORD");

        if ($isKoord) {
            $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT conspectAnim.*, user_data.firstname, user_data.lastname FROM conspectAnim, user_data WHERE user_data.user_id = conspectAnim.id_user ORDER BY CHAR_LENGTH(mainImg) DESC");
        } else {
            $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT conspectAnim.*, user_data.firstname, user_data.lastname FROM conspectAnim, user_data WHERE user_data.user_id = conspectAnim.id_user AND (id_user = " . $usid . " OR conspectAnim.shared_ids LIKE '%" . $usid . "%' ) ORDER BY CHAR_LENGTH(mainImg) DESC");
        }

        return $this->returnedData;
    }

    function getSharedListForAnim($data)
    {
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspectAnim WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        if( strlen($sharedList) >0 )
            $sharedList = explode(",", $sharedList);
        else
            $sharedList = [];
        $sharedArray = [];
        foreach ($sharedList as $keyIn => $sharedPerson) {
            $userData = explode(" ", $this->auth->getUserName($sharedPerson));
            array_push($sharedArray, [
                "id" => $sharedPerson,
                "firstname" => $userData[0],
                "lastname" => $userData[1]
            ]);
        }

        $this->returnedData['data'] = $sharedArray;
        return $this->returnedData;
    }

    function getAvailableSharedMasterForAnim($data)
    {
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspectAnim WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        $sharedList = explode(",", $sharedList);

        $playersManager = new Players();
        $allMasters = $playersManager->getAllMaster()["data"];

        $this->returnedData['data'] = [];
        if(isset($allMasters)&&isset($allMasters))
        foreach ($allMasters as $master) {
            $canAdd = true;
            foreach ($sharedList as $shared) {
                if ($master["usid"] == $shared) {
                    $canAdd = false;
                    break;
                }
            }
            if ($canAdd) $this->returnedData['data'][$master["firstname"] . " " . $master["lastname"] . "-" . $master["usid"]] = null;
        }
        return $this->returnedData;
    }

    function addSharedForAnim($data)
    {
        $usid = $data['usid'];
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspectAnim WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        if (strlen($sharedList) == 0) {
            $sharedList = "" . $usid;
        } else {
            $sharedList = $sharedList . "," . $usid;
        }
        $this->returnedData['data'] = ($this->db->getConnection())->update("conspectAnim", ["id" => $aid], ["shared_ids" => $sharedList]);
        return $this->returnedData;
    }

    function deleteSharedForAnim($data)
    {
        $usid = $data['usid'];
        $aid = $data["aid"];
        $sharedList = ($this->db->getConnection())->fetchRowMany("SELECT shared_ids FROM conspectAnim WHERE id=" . $aid);
        $sharedList = $sharedList[0]["shared_ids"];
        $sharedList = str_replace(" ", "", $sharedList);
        $sharedList = str_replace($usid . ",", "", $sharedList);
        $sharedList = str_replace("," . $usid, "", $sharedList);
        $sharedList = str_replace($usid, "", $sharedList);
        $this->returnedData['data'] = ($this->db->getConnection())->update("conspectAnim", ["id" => $aid], ["shared_ids" => $sharedList]);
        return $this->returnedData;
    }


    function deleteAnimConspect($data)
    {
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('conspectAnim', ['id' => $id]);
        return $this->returnedData;
    }

    function loadConspectAnim($data)
    {
        $id = $data['id'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow("SELECT * FROM conspectAnim WHERE id=" . $id);
        return $this->returnedData;
    }
}