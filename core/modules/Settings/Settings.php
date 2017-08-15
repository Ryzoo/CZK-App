<?php
namespace Core;

use \KHerGe\JSON\JSON;
use System\BasicModule;

class Settings extends BasicModule{

    public function installModule( $data ){
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $modulesConfig->installedModules;
        $index = array_search($data['name'],$modulesConfig->installedModules);
        if($index === FALSE){
            $name = "Modules\\".$data['name'];
            $module = new $name();
            if( method_exists($module,"install") ){
                if(!$module->install()){
                    array_push($modulesConfig->installedModules,$data['name']);
                    unlink(__DIR__. '/../../mainConf.json');
                    $json->encodeFile($modulesConfig, __DIR__. '/../../mainConf.json');
                }else{
                    $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie może zostać prawidłowo odinstalowany";
                    $this->returnedData["success"] = false;
                }
            }else{
                $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie jest prawidłowym modułem";
                $this->returnedData["success"] = false;
            }
        }else{
            $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." jest już zainstalowany";
            $this->returnedData["success"] = false;
        }
        return $this->returnedData;
    }

    public function uninstallModule( $data ){
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $modulesConfig->installedModules;
        $index = array_search($data['name'],$modulesConfig->installedModules);
        if($index === FALSE){
            $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie jest zainstalowany";
            $this->returnedData["success"] = false;
        }else{
            $name = "Modules\\".$data['name'];
            $module = new $name();
            if( method_exists($module,"uninstall") ){
                if(!$module->uninstall()){
                    unset($modulesConfig->installedModules[$index]);
                    unlink(__DIR__. '/../../mainConf.json');
                    $json->encodeFile($modulesConfig, __DIR__. '/../../mainConf.json');
                }else{
                    $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie może zostać prawidłowo odinstalowany";
                    $this->returnedData["success"] = false;
                }
            }else{
                $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie jest prawidłowym modułem";
                $this->returnedData["success"] = false;
            }
        }
        return $this->returnedData;
    }

    public function getInstalledModules(){
        $installed = $this->installedModules();
        $this->returnedData['data'] = $this->getModulesInfo($installed);
        return $this->returnedData;
    }

    public function getAvailableModules(){
        $directoriesContent = scandir("../modules/",1);
        $installed = $this->installedModules();
        $this->returnedData["data"] = [];
        for ($i=0; $i < count($directoriesContent)-2; $i++) { 
            $isInstalled = false;
            for ($x=0; $x < count($installed); $x++) { 
                if( $installed[$x] == $directoriesContent[$i] ){
                    $isInstalled = true;
                    break;
                }
            }
            if( !$isInstalled ) array_push($this->returnedData["data"],$directoriesContent[$i]);
        }
        $this->returnedData["data"] = $this->getModulesInfo($this->returnedData["data"]);
        return $this->returnedData;
    }

    public function getModulesInfo($modules){
        $toReturn = [];
        for ($i=0; $i < count($modules); $i++) { 
            $json = new JSON();
            $modulesConfig = $json->decodeFile(__DIR__. '/../../../modules/'.$modules[$i].'/config.json' );
            $description = 'Brak opisu';
            $version = '0.0';

            if( isset($modulesConfig->description) ) $description = $modulesConfig->description;
            if( isset($modulesConfig->version) ) $version = $modulesConfig->version;
            $isIcon = file_exists(__DIR__. '/../../../modules/'.$modules[$i].'/icon.jpg');

            array_push($toReturn,[
                "name" => $modules[$i],
                "description" => $description,
                "version" => $version,
                "icon" => $isIcon,
            ]);
        }
        return $toReturn;
    }

    public function getDatabaseConfig(){
        $json = new JSON();
        $dbConfig = $json->decodeFile(__DIR__. '/../../mainConf.json' );
        return $dbConfig->database;
    }

    function installedModules(){
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json' );
        return $modulesConfig->installedModules; 
    }

    function install(){}
    function uninstall(){}
}