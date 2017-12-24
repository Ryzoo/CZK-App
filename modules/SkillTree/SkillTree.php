<?php
namespace Modules\SkillTree;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\System\MailSystem;
use Core\Teams\Teams;
use Core\Notify\Notify;
use Core\System\FileMenager;

class SkillTree extends BasicModule {
    public $allSkill = [];
    public $completeArray = [];

    function __construct(){
      parent::__construct();
      $this->completeArray = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_users');
    }

    function install(){
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_category` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `color` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_skills` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `description` TEXT NOT NULL , `icon_path` VARCHAR(255) NOT NULL , `category_id` INT NOT NULL , `root_skill_id` INT NOT NULL,`st_skills` INT(2) NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_users` ( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `skill_have_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_skill_req` ( `id` INT NOT NULL AUTO_INCREMENT , `skill_id` INT NOT NULL , `req_skill_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_category');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_skills');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_users');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_skill_req');
    }

    function getMySkillsInTree($data){
      $token = $data['token'];
      $usid = $this->auth->getUserId($token);
      $this->returnedData['data'] = $this->getUserSkillsForUserId($usid);
      return $this->returnedData;
    }

    function getSkillTreeData($data){
      $this->returnedData['data']['categories'] = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_category');
      $this->returnedData['data']['skills'] = $this->getAllSkill();
      return $this->returnedData;
    }

    function getUserSkillsForUserId($usid){
      $category = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_category');
      if(isset($category) && count($category) > 0)
      $this->allSkill = [];
      foreach ($category as $key => $value) {
        $category[$key]['skills'] = $this->getSkillsForCategory($value,$usid,$value['id']);
      }
      $skillAll = $this->allSkill;
      $this->allSkill = [];
      return [
        "struct"=>$category,
        "all"=>$skillAll
      ];
    }

    function getSkillsForCategory($category,$usid, $cid, $sid=0, $completeStatus = true){ //user_id category_id skill_id
      $skills = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_skills WHERE category_id='.$cid.' AND root_skill_id='.$sid);
      if(isset($skills) && count($skills) > 0)
      foreach ($skills as $key => $value) {
        $skills[$key]['isComplete'] = $this->checkSkillCompleteArray($usid,$value['id']);
        $req = $this->checkIsSkillEnabled($usid,$value['id']);
        $skills[$key]['isEnabled'] = $req['enabled'];
        $skills[$key]['req'] = $req['reqSkills'];
        $skills[$key]['category'] = $category;
        $skills[$key]['skills'] = $this->getSkillsForCategory($category,$usid,$cid,$value['id'],$skills[$key]['isComplete']);
        array_push($this->allSkill,$skills[$key]);
      }
      return $skills;
    }

    function checkSkillCompleteArray($usid,$sid){
      if(!isset($this->completeArray) || count($this->completeArray) <=0 ) $this->completeArray = [];
      foreach ($this->completeArray as $key => $value) {
        if($value['user_id'] == $usid && $value['skill_have_id'] == $sid){
          return true;
        }
      }
      return false;
    }

    function checkSkillComplete($usid, $sid){
      $completed = ($this->db->getConnection())->fetchRow('SELECT id FROM st_users WHERE user_id='.$usid.' AND skill_have_id='.$sid);
      return (isset($completed) && isset($completed['id']));
    }

    function checkIsSkillEnabled($usid, $sid){
      $allReq = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_skill_req WHERE skill_id='.$sid);
      $isEnabled = true;
      $allSkills = [];
      if(isset($allReq) && count($allReq) > 0)
      foreach ($allReq as $key => $value) {
        array_push($allSkills,$value['req_skill_id']);
        if( $isEnabled && $this->checkSkillCompleteArray($usid,$value['req_skill_id']) == false ) {
          $isEnabled = false;
        }
      }
      return [
        "enabled"=>$isEnabled,
        "reqSkills"=>$allSkills
      ];
    }

    function completeUserSkillTreeSkill($data){
      $usid = $data['usid'];
      $sid = $data['sid'];
      ($this->db->getConnection())->insert("st_users",[
        "user_id" => $usid,
        "skill_have_id" => $sid
      ]);
      $this->completeArray = ($this->db->getConnection())->fetchRowMany('SELECT * FROM st_users');
      return $this->getUserAvailableSkill(["usid"=>$usid]);
    }

    function getUserSkillsInTree($data){
      $usid = $data['usid'];
      $skillsList = $this->getUserSkillsForUserId($usid);
    }

    function saveCategorySkillTree($data){
      $id = $data['id'];
      $name = $data['name'];
      $color = $data['color'];
      $this->returnedData['data'] = ($this->db->getConnection())->update('st_category',["id" => $id],[
        "name" => $name,
        "color" => $color
      ]);
      return $this->returnedData;
    }

    function deleteCategorySkillTree($data){
      $id = $data['id'];
      $this->returnedData['data'] = ($this->db->getConnection())->delete('st_category',["id" => $id]);
      $this->returnedData['data'] = ($this->db->getConnection())->delete('st_skills',["category_id" => $id]);
      return $this->returnedData;
    }

    function addCategorySkillTree($data){
      $name = $data['name'];
      $color = $data['color'];
      $this->returnedData['data'] = ($this->db->getConnection())->insert('st_category',[
        "name" => $name,
        "color" => $color
      ]);
      return $this->returnedData;
    }

    function saveSkillInTree($data){
      $fileDir = '';
      $id = $data['id'];

      $name = $data['name'];
      $level = $data['level'];
      $about = $data['about'];
      $category = $data['category'];
      $isRootSkill = isset($data['isRootSkill']) ? true : false;
      $rootSkill = $isRootSkill ? 0 : $data['rootSkill'];
      $reqSkill = $isRootSkill ? [] : (isset($data['reqSkill'])?$data['reqSkill']:[]);

      if(!$isRootSkill){
        $thisId = -1;
        foreach ($reqSkill as $key => $value){
          if($value == $rootSkill){
            $thisId = $key;
            break;
          }
        }
        if($thisId != -1){
          array_splice($reqSkill, $thisId, 1);
        }
      }
      array_push($reqSkill,$rootSkill);    

      $existReq = ($this->db->getConnection())->fetchRowMany("SELECT * FROM st_skill_req WHERE skill_id=".$id);
      
      if(!$existReq) $existReq = [];
      foreach($existReq as $value){
        if(!$this->isInArrayId($value['req_skill_id'],$reqSkill)){
          ($this->db->getConnection())->delete("st_skill_req",[
            "id" => $value['id']
          ]);
        }
      }

      $skillElement=[
        "name" => $name,
        "level" => $level,
        "description" => $about,
        "category_id" => $category,
        "root_skill_id" => $rootSkill
      ];

      if(isset($_FILES["svg"])&&isset($_FILES["svg"]["tmp_name"])&& $_FILES["svg"]["tmp_name"] != ""){
        $thisSkillIcon = ($this->db->getConnection())->fetchRow("SELECT icon_path FROM st_skills WHERE id=".$id)['icon_path'];
        FileMenager::deleteFile(str_replace("./",$_SERVER["DOCUMENT_ROOT"]."/",$thisSkillIcon));
        $fileDir = FileMenager::saveFileFromTmp($_FILES["svg"]["name"],"skillTreeIcon",$_FILES["svg"]["tmp_name"]);
        $skillElement['icon_path'] = $fileDir;
      }

      $newId = ($this->db->getConnection())->update('st_skills',["id"=>$id],$skillElement);

      foreach ($reqSkill as $key => $value){
        if( (int)$value <= 0 ) continue;
        $exist =  ($this->db->getConnection())->fetchRow('SELECT id FROM st_skill_req WHERE skill_id='.$id.' AND req_skill_id='.$value);
        if(!(isset($exist) && isset($exist['id']))){
          ($this->db->getConnection())->insert('st_skill_req',[
            "skill_id" => $id,
            "req_skill_id" => $value,
          ]);
        }
      }

      $this->returnedData['data'] = $this->getAllSkill();
      return $this->returnedData;
    }

    function isInArrayId($id,$array){
      foreach ($array as $key => $value){
       if($id === $value) return true;
      }
      return false;
    }

    function getAllSkill(){
      $all = ($this->db->getConnection())->fetchRowMany("SELECT st_skills.*, st_category.color FROM st_skills,st_category WHERE st_skills.category_id = st_category.id ORDER BY category_id, st_skills.name");
      if(!isset($all)) $all = [];
      return $all; 
    }

    function addSkillTreeSkill($data){
      $fileDir = FileMenager::saveFileFromTmp($_FILES["svg"]["name"],"skillTreeIcon",$_FILES["svg"]["tmp_name"]);

      $name = $data['name'];
      $level = $data['level'];
      $about = $data['about'];
      $category = $data['category'];
      $isRootSkill = isset($data['isRootSkill']) ? true : false;
      $rootSkill = $isRootSkill ? 0 : $data['rootSkill'];
      $reqSkill = $isRootSkill ? [] : (isset($data['reqSkill'])?$data['reqSkill']:[]);

      if(!$isRootSkill){
        $thisId = -1;
        foreach ($reqSkill as $key => $value){
          if($value == $rootSkill){
            $thisId = $key;
            break;
          }
        }
        if($thisId != -1){
          array_splice($reqSkill, $thisId, 1);
        }
      }
      $reqSkill = [$rootSkill];

      $newId = ($this->db->getConnection())->insert('st_skills',[
        "name" => $name,
        "level" => $level,
        "description" => $about,
        "category_id" => $category,
        "root_skill_id" => $rootSkill,
        "icon_path" => $fileDir,
      ]);

      foreach ($reqSkill as $key => $value){
        if( (int)$value <= 0 ) continue;
        ($this->db->getConnection())->insert('st_skill_req',[
          "skill_id" => $newId,
          "req_skill_id" => $value,
        ]);
      }

      $this->returnedData['data'] = $this->getAllSkill();
      return $this->returnedData;
    }

    function getUserAvailableSkill($data){
      $usid = $data['usid'];
      $skills = ($this->db->getConnection())->fetchRowMany('SELECT st_skills.* FROM st_skills ');
      $this->returnedData['data'] = [];
      foreach ($skills as $key => $value) {
        $sid = $value['id'];
        $isCompleted = $this->checkSkillCompleteArray($usid,$sid);
        if(!$isCompleted){
          $isEnabled = $this->checkIsSkillEnabled($usid,$sid)["enabled"];
          if($isEnabled){
            array_push($this->returnedData['data'],$value);
          }
        }
      }
      return $this->returnedData;
    }

    function getSkillToEdit($data){
      $id = $data['id'];
      $skill = ($this->db->getConnection())->fetchRow("SELECT * FROM st_skills WHERE id=".$id);
      $dataSkillReq = ($this->db->getConnection())->fetchRowMany("SELECT * FROM st_skill_req WHERE skill_id=".$id);
      $arr = [];
      if(!isset($dataSkillReq) || $dataSkillReq==null) $dataSkillReq = [];
      foreach($dataSkillReq as $value){
        array_push($arr,$value['req_skill_id']);
      }
      $skill['req'] = $arr;
      $this->returnedData['data'] = $skill;
      return $this->returnedData; 
    }

    function deleteSkillInTree($data){
      $id = $data['id'];
      ($this->db->getConnection())->delete('st_skill_req',["skill_id"=>$id]);
      ($this->db->getConnection())->delete('st_skills',["id"=>$id]);
      ($this->db->getConnection())->delete('st_users',["skill_have_id"=>$id]);
      return $this->returnedData;
    }

}