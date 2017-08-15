<?php
namespace Modules;

use System\BasicModule;

class Stats extends BasicModule {
     function install(){
    }

    function uninstall(){
    }

    function getStats($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $data["usid"];
        $tmid = $data["tmid"];
        $allPotential = ($this->db->getConnection())->fetchRowMany('SELECT * FROM potential');
        for($i=0;$i<count($allPotential);$i++){
            $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best, worst FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
            for($j=0;$j<count($allPotential[$i]['tests']);$j++){
                $allPotential[$i]['tests'][$j]['scores'] = ($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$allPotential[$i]['tests'][$j]['id'].' AND id_team='.$tmid.' AND id_user='.$usid);
            }
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }

    function getTeamStats($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $data["usid"];
        $tmid = $data["tmid"];
        $allPotential = ($this->db->getConnection())->fetchRowMany('SELECT * FROM potential');
        for($i=0;$i<count($allPotential);$i++){
            $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best, worst FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
            for($j=0;$j<count($allPotential[$i]['tests']);$j++){
                $allPotential[$i]['tests'][$j]['user'] = array();
                for($x=0;$x<count($usid);$x++){
                    array_push( $allPotential[$i]['tests'][$j]['user'], ['id'=>$usid[$x], 'score'=>($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$allPotential[$i]['tests'][$j]['id'].' AND id_team='.$tmid.' AND id_user='.$usid[$x])] );
                }
            }
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }

    function getScoreFromTestId($data){
        $usid = $data["usid"];
        $tmid = $data["tmid"];
        $tsid = $data["tsid"];
        $toReturn = null;
        $success = true;
        $error = "";
       
        $allScores =  ($this->db->getConnection())->fetchRowMany('SELECT id, data, wynik FROM potential_score WHERE id_test='.$tsid.' AND id_team='.$tmid.' AND id_user='.$usid);
        
        return array( "error"=>$error ,"success"=>$success,"data"=>$allScores );
    }

    function deleteScore($data){
        $toReturn = null;
        $success = true;
        $error = "";
      
        $id = $data["tsid"];
        $toReturn = ($this->db->getConnection())->delete('potential_score', ['id' => $id]);
       
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addScore($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $usid = $data["usid"];
        $tmid = $data["tmid"];
        $tsid = $data["tsid"];
        $score = $data["score"];

         $data = [
            'id_test' => $tsid,
            'id_user' => $usid,
            'id_team' => $tmid,
            'wynik' => $score
        ];
        $toReturn = ($this->db->getConnection())->insert('potential_score', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getCategoryWitchTest(){
        $toReturn = null;
        $success = true;
        $error = "";
        $allPotential = ($this->db->getConnection())->fetchRowMany('SELECT * FROM potential');
        for($i=0;$i<count($allPotential);$i++){
            $allPotential[$i]['tests'] = ($this->db->getConnection())->fetchRowMany('SELECT id, name, best, worst FROM potential_test WHERE id_potential='.$allPotential[$i]['id']);
        }
        return array( "error"=>$error ,"success"=>$success,"data"=>$allPotential );
    }

    function addCategoryTest($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $name = $data["name"];
        
        $data = [
            'name' => $name
        ];
        $toReturn = ($this->db->getConnection())->insert('potential', $data);
            
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteCategoryTest($data){
        $toReturn = null;
        $success = true;
        $error = "";
        
        $id = $data["id"];
        $toReturn = ($this->db->getConnection())->delete('potential_test', ['id_potential' => $id]);
        $toReturn = ($this->db->getConnection())->delete('potential', ['id' => $id]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function addTestToCategory($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $name = $data["name"];
        $caid = $data["caid"];
        $best = $data["best"];
        $worst = $data["worst"];

        $data = [
            'id_potential' => $caid,
            'name' => $name,
            'best' => $best,
            'worst' => $worst
        ];
        $toReturn = ($this->db->getConnection())->insert('potential_test', $data);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function changeTest($data){
        $error = "";
        $success = true;
        $id = $data["id"];
        $value = $data["value"];
        $changeType = $data["changeType"];

        $condsUsers['id'] = $id;
        $dataUsers[($changeType=='best')?'best':'worst'] = trim($value);
        $result = ($this->db->getConnection())->update('potential_test', $condsUsers, $dataUsers);
            
        return array( "error"=>$error ,"success"=>$success, "data"=>array("url"=>$file_name, "post"=>$post) );
    }

    function deleteTestFromCat($data){
        $id = $data['id'];
        $toReturn = null;
        $success = true;
        $error = "";
        
        $toReturn = ($this->db->getConnection())->delete('potential_test', ['id' => $id]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}