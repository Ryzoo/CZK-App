<?php
namespace Core\Settings;

use \KHerGe\JSON\JSON;
use Core\System\BasicModule;
use Alchemy\Zippy\Zippy;

class Settings extends BasicModule{

    public function installModule( $data ){
        system('php '.__DIR__ .'/../../vendor/composer/composer/bin/composer dumpautoload -o');
        $json = new JSON();
        $modulesConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $modulesConfig->installedModules;
        $index = array_search($data['name'],$modulesConfig->installedModules);
        if($index === FALSE){
            $name = "Modules\\".$data['name']."\\".$data['name'];
            $module = new $name();
            $moduleInfo = ($this->getModulesInfo([ $data['name'] ]))[0];
            $requireAll = true;

            for ($i=0; $i < count($moduleInfo['require']); $i++) { 
                if( !$this->isInstalledModules($moduleInfo['require'][$i]) ){
                    $requireAll = false;
                    break;
                }
            }

            if($requireAll){
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
                $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." wymaga do działania moduł: ".$moduleInfo['require'][$i];
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
            $name = "Modules\\".$data['name']."\\".$data['name'];
            $module = new $name();
            $requiredBy = $this->isRequiredByModule($data['name']);

            if( method_exists($module,"uninstall") ){
                if(strlen($requiredBy)==0){
                    $module->uninstall();
                    $installed = $modulesConfig->installedModules;
                    $modulesConfig->installedModules = [];
                    for ($i=0; $i < count($installed); $i++) {
                        if( $installed[$i] != $data['name'])
                        array_push( $modulesConfig->installedModules, $installed[$i] );
                    }
                    unlink(__DIR__. '/../../mainConf.json');
                    $json->encodeFile($modulesConfig, __DIR__. '/../../mainConf.json');
                }else{
                    $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." jest wymagany przez moduł: ".$requiredBy;
                    $this->returnedData["success"] = false;
                }
            }else{
                $this->returnedData["error"] = "Moduł o nazwie ".$data['name']." nie jest prawidłowym modułem";
                $this->returnedData["success"] = false;
            }
        }
        return $this->returnedData;
    }

    public function isRequiredByModule($name){
        $installedModules = ($this->getInstalledModules()["data"]);
        for ($i=0; $i < count($installedModules); $i++) { 
            for ($j=0; $j < count($installedModules[$i]['require']); $j++) { 
                if( $installedModules[$i]['require'][$j] == $name ) return $installedModules[$i]['name'];
            }
        }
        return '';
    }

    public function getInstalledModules(){
        $installed = $this->installedModules();
        $this->returnedData['data'] = $this->getModulesInfo($installed);
        return $this->returnedData;
    }

    public function isInstalledModules($name){
        $installedModules = $this->installedModules();
        for ($i=0; $i < count($installedModules); $i++) { 
            if( $installedModules[$i] == $name ) return true;
        }
        return false;
    }

    public function getAvailableModules(){
        $directoriesContent = scandir(__DIR__."/../../../modules/",1);
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
            $require = [];

            if( isset($modulesConfig->description) ) $description = $modulesConfig->description;
            if( isset($modulesConfig->version) ) $version = $modulesConfig->version;
            if( isset($modulesConfig->require) ) $require = $modulesConfig->require;

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
                "require" => $require,
                "icon" => $isIcon,
            ]);
        }
        return $toReturn;
    }

    public function getDatabaseConfig(){
        $json = new JSON();
        $dbConfig = $json->decodeFile(__DIR__. '/../../mainConf.json' );
        return $dbConfig->localDatabase;
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

    public function getAllModules(){
        $json = new JSON();
        $otherModules = scandir(__DIR__."/../../../modules/",1);
        $toreturn = [];
        for ($i=0; $i < count($otherModules) ; $i++) {
            if($otherModules[$i] != "." && $otherModules[$i] != ".." )
                array_push($toreturn,["name"=>$otherModules[$i],"ver"=>$this->getModuleVersion($otherModules[$i])]);
        }
        return $toreturn; 
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

    public function getMainPageSettings($data=null){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $this->returnedData['data'] = $siteConfig->mainSettings;
        return $this->returnedData;
    }

    public function updateAppPredisposition($data){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        $siteConfig->mainSettings->appPredisposition = $data['appPred'];
        $json->encodeFile($siteConfig, __DIR__. '/../../mainConf.json');
        return $this->returnedData;
    }

    public function getOwnerData(){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        return $siteConfig->ownerData;
    }

    public function changeAppMainSettings($data){
        $json = new JSON();
        $siteConfig = $json->decodeFile(__DIR__. '/../../mainConf.json');
        if( isset($data['appName']) ) $siteConfig->mainSettings->appName = $data['appName'];
        unlink(__DIR__. '/../../mainConf.json');
        $json->encodeFile($siteConfig, __DIR__. '/../../mainConf.json');
        return $this->returnedData;
    }

    public function getModuleVersion($moduleName){
        $json = new JSON();
        if(file_exists(__DIR__. '/../../../modules/'.$moduleName.'/config.json')){
            $moduleConf = $json->decodeFile(__DIR__. '/../../../modules/'.$moduleName.'/config.json');
            if(isset($moduleConf)){
                return $moduleConf->version;
            }
        }
        return -1;
    }

    public function getModuleHostVersion($moduleName){
        $json = new JSON();
        if(file_exists(__DIR__. '/../../../baseApp/modules/'.$moduleName.'/config.json')){
            $moduleConf = $json->decodeFile(__DIR__. '/../../../baseApp/modules/'.$moduleName.'/config.json');
            if(isset($moduleConf)){
                return $moduleConf->version;
            }
        }
        return -1;
    }

    public function getOwnerModules($ownerData){
        //todo
    }

    public function checkCoreUpdate(){
        //todo
    }

    public function getZippedModule(){
        
    }

    public function getModuleUpdate($data){
        $modulesList = $data['modules'];
        $ownerData = $data['ownerData'];
        $ownerModules = $this->getOwnerModules($ownerData);
        $toUpdate = [];

        for ($i=0; $i < count($modulesList); $i++) {
            $moduleVersion = ($this->getModuleHostVersion($modulesList[$i]["name"]));
            if( (float)($modulesList[$i]["ver"]) == (float)$moduleVersion ){
                array_push($toUpdate,[
                    "name"=>$modulesList[$i]["name"],
                    "ver"=>$moduleVersion
                ]);
            }
           // for ($x=0; $x < count($ownerModules); $x++) {     
                //if($modulesList[$i] === $ownerModules[$x]){
                  //  break;
               // }
         //  }
        }

        return $toUpdate;
    }

    public function installUpdateToModule($data){
        $moduleName = $data['moduleName'];
        $url = "http://".urlencode("panel-klienta.centrumklubu.pl")."/backend/getZippedModule";
        $data = array('moduleName' => $moduleName, 'ownerData' => $this->getOwnerData());
        
        $moduleZip = $this->postRequest($url,$data);
    }

    public function checkModuleUpdate(){
        $url = "http://".urlencode("panel-klienta.centrumklubu.pl")."/backend/getModuleUpdate";
        $allModules = $this->getAllModules();
        $data = array('modules' => $allModules, 'ownerData' => $this->getOwnerData());
        $this->returnedData['data'] = $this->postRequest($url,$data);
        return $this->returnedData;
    }

    public function postRequest($url,$data=array()){
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            )
        );
        $context  = stream_context_create($options);
        $result = json_decode(file_get_contents($url, false, $context));
        return $result;
    }

    function install(){}
    function uninstall(){}
}