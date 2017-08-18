<?php
namespace Core;

use \KHerGe\JSON\JSON;
use System\BasicModule;
use Alchemy\Zippy\Zippy;

class Settings extends BasicModule{

    public function installModule( $data ){
        system('php '.__DIR__ .'/../../vendor/composer/composer/bin/composer dumpautoload -o');
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $modulesConfig->installedModules;
        $index = array_search($data['name'],$modulesConfig->installedModules);
        if($index === FALSE){
            $name = "Modules\\".$data['name'];
            $module = new $name();
            if( method_exists($module,"install") ){
                $module->install();
                array_push($modulesConfig->installedModules,$data['name']);
                unlink(__DIR__. '/../../mainConf.json');
                $json->encodeFile($modulesConfig, __DIR__. '/../../mainConf.json');
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
                $module->uninstall();
                unset($modulesConfig->installedModules[$index]);
                unlink(__DIR__. '/../../mainConf.json');
                $json->encodeFile($modulesConfig, __DIR__. '/../../mainConf.json');
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
            if(file_exists(__DIR__. '/../../../modules/'.$modules[$i].'/icon.jpg')){
                $isIcon = "./modules/".$modules[$i].'/icon.jpg';
            }else if(file_exists(__DIR__. '/../../../modules/'.$modules[$i].'/icon.png')){
                $isIcon = "./modules/".$modules[$i].'/icon.png';
            }else{
                $isIcon = './files/img/defaultModule.png';
            }

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

    public function getAvailableThemes(){
        $this->returnedData['data'] = $this->availableThemes();
        return $this->returnedData;
    }

    public function getCurrentThemes(){
        $this->returnedData['data'] = $this->currentThemes();
        return $this->returnedData;
    }

    public function installedModules(){
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json' );
        return $modulesConfig->installedModules; 
    }

    public function setCurrentTheme($data){
        $name = $data['name'];
        $allThemes = $this->availableThemes();
        $isAvailable = false;
        for ($i=0; $i < count($allThemes) ; $i++) { 
            if( $allThemes[$i] === $name){
                $isAvailable = true;
                break;
            }
        }

        if($isAvailable && file_exists(__DIR__. '/../../themes/'.$name.'/style.css')){
            $json = new JSON();
            $themesConf = $json->decodeFile(__DIR__. '/../../themes/config.json' );
            $themesConf->current = $name;
            $json->encodeFile($themesConf, __DIR__. '/../../themes/config.json');
        }else{
            $this->returnedData['error'] = "Niestety nieodnaleziono odpowiedniego szablonu wyglądu";
            $this->returnedData['success'] = false;
        }

        return $this->returnedData;
    }

    public function addModule($data){
        if( isset($_FILES["moduleFile"]) ){
            $ext = pathinfo($_FILES["moduleFile"]["name"],PATHINFO_EXTENSION);
            if($ext !== "zip"){
                $this->returnedData['error'] = "Błędne rozszerzenie pliku. Dodaj plik zip";
                $this->returnedData['success'] = false;
            }
            $target_file = __DIR__ . "/../../../files/zippedModule.zip";
            if(file_exists($target_file))unlink($target_file);
            if(move_uploaded_file($_FILES["moduleFile"]["tmp_name"], $target_file)){
                $zippy = Zippy::load();
                $archive = $zippy->open($target_file);
                if (isset($archive)) {
                    $archive->extract(__DIR__ . "/../../../modules/");
                    system('php '.__DIR__ .'/../../vendor/composer/composer/bin/composer dumpautoload -o');
                } else {
                    $this->returnedData['error'] = "Niewłaściwy plik zip. Nie można otworzyć danego pliku";
                    $this->returnedData['success'] = false;
                }
            }else{
                $this->returnedData['error'] = "Niestety nie udało się przenieść pliku w miejsce docelowe";
                $this->returnedData['success'] = false;
            }
        }else{
            $this->returnedData['error'] = "Brak pliku zip";
            $this->returnedData['success'] = false;
        }
        return $this->returnedData;
    }

    public function availableThemes(){
        $json = new JSON();
        $themesConf = $json->decodeFile(__DIR__. '/../../themes/config.json' );
        if(!isset($themesConf->availableThemes)) $themesConf->availableThemes = [];
        return $themesConf->availableThemes; 
    }

    public function currentThemes(){
        $json = new JSON();
        $themesConf = $json->decodeFile(__DIR__. '/../../themes/config.json' );
        if(!isset($themesConf->current)) $themesConf->current = "";
        return $themesConf->current; 
    }

    public function changePageLogo($data){
        if( isset($_FILES["logoFile"]) ){
            $target_file = __DIR__ . "/../../../files/img/club_logo.png";
            if(file_exists($target_file))unlink($target_file);
            if(!move_uploaded_file($_FILES["logoFile"]["tmp_name"], $target_file)){
                $this->returnedData['error'] = "Niestety nie udało się przenieść pliku w miejsce docelowe";
                $this->returnedData['success'] = false;
            }
        }else{
            $this->returnedData['error'] = "Brak pliku";
            $this->returnedData['success'] = false;
        }
        return $this->returnedData;
    }

    public function changePageBackground($data){
        if( isset($_FILES["backFile"]) ){
            $target_file = __DIR__ . "/../../../files/img/background.jpg";
            if(file_exists($target_file))unlink($target_file);
            if(!move_uploaded_file($_FILES["backFile"]["tmp_name"], $target_file)){
                $this->returnedData['error'] = "Niestety nie udało się przenieść pliku w miejsce docelowe";
                $this->returnedData['success'] = false;
            }
        }else{
            $this->returnedData['error'] = "Brak pliku";
            $this->returnedData['success'] = false;
        }
        return $this->returnedData;
    }

    public function changePageIcon($data){
        if( isset($_FILES["icoFile"]) ){
            $target_file = __DIR__ . "/../../../files/img/favicon.ico";
            if(file_exists($target_file))unlink($target_file);
            if(!move_uploaded_file($_FILES["icoFile"]["tmp_name"], $target_file)){
                $this->returnedData['error'] = "Niestety nie udało się przenieść pliku w miejsce docelowe";
                $this->returnedData['success'] = false;
            }
        }else{
            $this->returnedData['error'] = "Brak pliku";
            $this->returnedData['success'] = false;
        }
        return $this->returnedData;
    }

    public function getMainPageSettings($data){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $this->returnedData['data'] = $siteConfig->mainSettings;
        return $this->returnedData;
    }

    public function changeAppMainSettings($data){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        if( isset($data['appName']) ) $siteConfig->mainSettings->appName = $data['appName'];
        unlink(__DIR__. '/../../mainConf.json');
        $json->encodeFile($siteConfig, __DIR__. '/../../mainConf.json');
        return $this->returnedData;
    }

    function install(){}
    function uninstall(){}
}