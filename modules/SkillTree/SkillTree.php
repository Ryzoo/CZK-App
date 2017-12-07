<?php
namespace Modules\SkillTree;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\System\MailSystem;
use Core\Teams\Teams;
use Core\Notify\Notify;

class SkillTree extends BasicModule {
    public $allSkill = [];

    function install(){
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_category` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `color` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_must_have` ( `id` INT NOT NULL AUTO_INCREMENT , `skill_id` INT NOT NULL , `must_skill_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_skills` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `description` TEXT NOT NULL , `icon_path` VARCHAR(255) NOT NULL , `category_id` INT NOT NULL , `root_skill_id` INT NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_users` ( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `skill_have_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `st_skill_req` ( `id` INT NOT NULL AUTO_INCREMENT , `skill_id` INT NOT NULL , `req_skill_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_category');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS st_must_have');
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
        $skills[$key]['isComplete'] = $this->checkSkillComplete($usid,$value['id']);
        $req = $this->checkIsSkillEnabled($usid,$value['id']);
        $skills[$key]['isEnabled'] = $req['enabled'];
        $skills[$key]['req'] = $req['reqSkills'];
        $skills[$key]['category'] = $category;
        $skills[$key]['skills'] = $this->getSkillsForCategory($category,$usid,$cid,$value['id'],$skills[$key]['isComplete']);
        array_push($this->allSkill,$skills[$key]);
      }
      return $skills;
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
        if( $isEnabled && $this->checkSkillComplete($usid,$value['req_skill_id']) == false ) {
          $isEnabled = false;
        }
      }
      

      return [
        "enabled"=>$isEnabled,
        "reqSkills"=>$allSkills
      ];
    }

    function getUserSkillsInTree($data){
      $usid = $data['usid'];
      $skillsList = $this->getUserSkillsForUserId($usid);
    }

    function getAllSkillsInTree($data){

    }

    function addSkillCategoryInTree(){

    }

    function deleteSkillCategoryInTree(){
      
    }

    function addSkillInTree(){
      
    }

    function deleteSkillInTree(){
      
    }

}