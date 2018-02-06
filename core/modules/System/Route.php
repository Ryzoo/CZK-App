<?php
namespace Core\System;

use \KHerGe\JSON\JSON;
use Core\Auth\Auth;
use Core\Database\Database;
use Core\Settings\Settings;

class Route{
    private $request;
    private $dataToReturn;
    private $postData;
    private $modules = [];
    private $controllerList = [];
    private $frontRouteList = [];
    private $services = [];
    private $modulesJs = [];
    private $modulesCss = [];
    private $auth;
    private $leftMenu = [];
    private $settings;

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->auth = new Auth();
        $this->settings = new Settings();
        // load modules
        $json = new JSON();
        $modulesList = $json->decodeFile(__DIR__. '/../../mainConf.json' );

        for ($z=0; $z < count($modulesList->installedModules) ; $z++) { 
            $moduleJson = $json->decodeFile(__DIR__. '/../../../modules/'.$modulesList->installedModules[$z].'/config.json' );
            // load user modules
            if( isset($moduleJson->frontendRoute) ){
                $frontRoute = $moduleJson->frontendRoute;
                for ($x=0; $x < count($frontRoute); $x++) { 
                    $frontRoute[$x]->templateSrc = "modules/".$moduleJson->name."/assets/templates/" . $frontRoute[$x]->templateSrc;
                    array_push($this->frontRouteList,$frontRoute[$x]);
                }
            }
            if( isset($moduleJson->jsControllers) ){
                $controllers = $moduleJson->jsControllers;
                for ($x=0; $x < count($controllers); $x++) { 
                    $controllers[$x] = "modules/".$moduleJson->name."/assets/controllers/" . $controllers[$x].".js";
                    array_push($this->controllerList,$controllers[$x]);
                }
            }
            if( isset($moduleJson->js) ){
                $js = $moduleJson->js;
                for ($x=0; $x < count($js); $x++) { 
                    $js[$x] = "modules/".$moduleJson->name."/assets/js/" . $js[$x].".js";
                    array_push($this->modulesJs,$js[$x]);
                }
            }

            if( isset($moduleJson->anchor) ){
                $anchor = $moduleJson->anchor;
                for ($x=0; $x < count($anchor); $x++) { 
                    if(isset($anchor[$x]->destination)&&isset($anchor[$x]->content)){
                        if( isset($anchor[$x]->anchorPoint)){
                            $point = $anchor[$x]->anchorPoint;
                            $key = -1;
                            for ($g=0; $g < count($this->{$anchor[$x]->destination}); $g++) { 
                                if( !is_object($this->{$anchor[$x]->destination}[$g]) && isset($this->{$anchor[$x]->destination}[$g]['dropdown']) && strcmp($this->{$anchor[$x]->destination}[$g]["dropdown"],$point) === 0 ){
                                    $key = $g;
                                    break;
                                }
                            }
                            if( $key == -1){
                                $arrayPoint = [
                                    "dropdown" => $point,
                                    "list" => [],
                                    "icon" => '',
                                    "anchorAdditional" => '',
                                    "weight" => 999
                                ];
                                if( isset($anchor[$x]->anchorPointIcon) )
                                    $arrayPoint["icon"] = $anchor[$x]->anchorPointIcon;
                                if( isset($anchor[$x]->anchorAdditional) )
                                    $arrayPoint["anchorAdditional"] = $anchor[$x]->anchorAdditional;
                                if( isset($anchor[$x]->anchorWeight) )
                                    $arrayPoint["weight"] = $anchor[$x]->anchorWeight;
                                array_push($this->{$anchor[$x]->destination},$arrayPoint);
                                $key = count($this->{$anchor[$x]->destination})-1;
                            }
                            array_push($this->{$anchor[$x]->destination}[$key]["list"],$anchor[$x]->content);
                        }else{
                            if( !isset($anchor[$x]->content->weight) ) $anchor[$x]->content->weight = 999;
                            array_push($this->{$anchor[$x]->destination},$anchor[$x]->content);
                        }
                    }   
                }
            }
            if( isset($moduleJson->appServicesFile) ){
                $jsServices = $moduleJson->appServicesFile;
                for ($x=0; $x < count($jsServices); $x++) { 
                    $jsServices[$x] = "modules/".$moduleJson->name."/assets/services/" . $jsServices[$x].".js";
                    array_push($this->services,$jsServices[$x]);
                }
            }
            $moduleJson->name = "Modules\\".$moduleJson->name."\\".$moduleJson->name;
            array_push($this->modules,$moduleJson);
        }

        for ($z=0; $z < count($modulesList->coreModules) ; $z++) { 
            $moduleJson = $json->decodeFile(__DIR__. '/../'.$modulesList->coreModules[$z].'/config.json' );
            // load core modules
            if( isset($moduleJson->frontendRoute) ){
                $frontRoute = $moduleJson->frontendRoute;
                for ($x=0; $x < count($frontRoute); $x++) { 
                    $frontRoute[$x]->templateSrc = "core/modules/".$moduleJson->name."/assets/templates/" . $frontRoute[$x]->templateSrc;
                    array_push($this->frontRouteList,$frontRoute[$x]);
                }
            }
            if( isset($moduleJson->jsControllers) ){
                $controllers = $moduleJson->jsControllers;
                for ($x=0; $x < count($controllers); $x++) { 
                    $controllers[$x] = "core/modules/".$moduleJson->name."/assets/controllers/" . $controllers[$x].".js";
                    array_push($this->controllerList,$controllers[$x]);
                }
            }
            if( isset($moduleJson->js) ){
                $js = $moduleJson->js;
                for ($x=0; $x < count($js); $x++) { 
                    $js[$x] = "core/modules/".$moduleJson->name."/assets/js/" . $js[$x].".js";
                    array_push($this->modulesJs,$js[$x]);
                }
            }

            if( isset($moduleJson->anchor) ){
                $anchor = $moduleJson->anchor;
                for ($x=0; $x < count($anchor); $x++) { 
                    if(isset($anchor[$x]->destination)&&isset($anchor[$x]->content)){
                        if( isset($anchor[$x]->anchorPoint)){
                            $point = $anchor[$x]->anchorPoint;
                            $key = -1;
                            for ($g=0; $g < count($this->{$anchor[$x]->destination}); $g++) { 
                                if( !is_object($this->{$anchor[$x]->destination}[$g]) && isset($this->{$anchor[$x]->destination}[$g]['dropdown']) && strcmp($this->{$anchor[$x]->destination}[$g]["dropdown"],$point) === 0 ){
                                    $key = $g;
                                    break;
                                }
                            }
                            if( $key == -1){
                                $arrayPoint = [
                                    "dropdown" => $point,
                                    "list" => [],
                                    "icon" => '',
                                    "anchorAdditional" => '',
                                    "weight" => 999
                                ];
                                if( isset($anchor[$x]->anchorPointIcon) )
                                    $arrayPoint["icon"] = $anchor[$x]->anchorPointIcon;
                                if( isset($anchor[$x]->anchorAdditional) )
                                    $arrayPoint["anchorAdditional"] = $anchor[$x]->anchorAdditional;
                                if( isset($anchor[$x]->anchorWeight) )
                                    $arrayPoint["weight"] = $anchor[$x]->anchorWeight;
                                    
                                array_push($this->{$anchor[$x]->destination},$arrayPoint);
                                $key = count($this->{$anchor[$x]->destination})-1;
                            }
                            array_push($this->{$anchor[$x]->destination}[$key]["list"],$anchor[$x]->content);
                        }else{
                            if( !isset($anchor[$x]->content->weight) ) $anchor[$x]->content->weight = 999;
                            array_push($this->{$anchor[$x]->destination},$anchor[$x]->content);
                        }
                    }   
                }
            }
            if( isset($moduleJson->appServicesFile) ){
                $jsServices = $moduleJson->appServicesFile;
                for ($x=0; $x < count($jsServices); $x++) { 
                    $jsServices[$x] = "core/modules/".$moduleJson->name."/assets/services/" . $jsServices[$x].".js";
                    array_push($this->services,$jsServices[$x]);
                }
            }
            $moduleJson->name = "Core\\".$moduleJson->name."\\".$moduleJson->name;
            array_push($this->modules,$moduleJson);
        }

        //add actual theme files
        $actualThemes = $this->settings->currentThemes();
        if(isset($actualThemes)&&strlen($actualThemes)>2){
            $actualThemes = "core/themes/".$actualThemes."/style.css";
            array_push($this->modulesCss,$actualThemes);
        }

        $this->checkRequest();
    }

    function checkRequest(){
        $errorMessage = "";
        $token = '';
        if( isset($this->postData['token']) ){
            $token = $this->postData['token'];
        }

        if( $this->request === "getPageJs" ){
            $this->dataToReturn = $this->getModulesJs();
        }else if( $this->request === "getModulesFrontRoutes" ){
            $this->dataToReturn = $this->getModulesFrontRoutes();
        }else if( $this->request === "getPageCss" ){
            $this->dataToReturn = $this->getModulesCss();
        }else if( $this->request === "getLeftMenu" ){
            $this->dataToReturn = $this->getLeftMenu();
        }else if( $this->request === "getServices" ){
            $this->dataToReturn = $this->getServices();
        }else{
            for ($i=0; $i < count($this->modules); $i++) {
                if( isset($this->modules[$i]->backendRoute) )
                for ($j=0; $j < count($this->modules[$i]->backendRoute); $j++) { 
                    if($this->modules[$i]->backendRoute[$j]->url === $this->request){
                        //check if these url exist in this module if yes then do:
                        $moduleName = $this->modules[$i]->name;
                        $actualModulesClass = new $moduleName();
                        if( !is_object($actualModulesClass) ) echo $actualModulesClass;
                        $function = $this->modules[$i]->backendRoute[$j]->url;
                        //check permission
                        if( isset($this->modules[$i]->backendRoute[$j]->auth) ){
                            $permission = $this->modules[$i]->backendRoute[$j]->auth;
                            if( !$this->auth->checkPerm($token,$permission)){
                                $errorMessage = "Nie masz wystarczających uprawnień";
                                break;
                            }
                        }
                        //check if is set parameters
                        if( isset($this->modules[$i]->backendRoute[$j]->parameters) ){
                            $routeParameters = $this->modules[$i]->backendRoute[$j]->parameters;
                            for ($x=0; $x < count($routeParameters); $x++) { 
                                if(!isset($this->postData[$routeParameters[$x]])){
                                    $errorMessage = "Brak danych: ".$routeParameters[$x];
                                    break;
                                }
                            }
                        }
                        // do the function from actual selected module
                        if( strlen($errorMessage) == 0 ){
                            $this->dataToReturn = $actualModulesClass->$function( $this->postData );
                        }
                    }
                }     
            }
        }
        if( !isset( $this->dataToReturn ) ){
            $this->dataToReturn = array( "error"=>$errorMessage ,"success"=>false );
        }

    }

    function getModulesFrontRoutes(){
        $error = '';    
        $success = true;
        $toReturn = $this->frontRouteList;
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getModulesJs(){
        $error = '';
        $success = true;
        $toReturn = array_merge($this->controllerList,$this->modulesJs);
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getServices(){
        $error = '';
        $success = true;
        $toReturn = $this->services;
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getModulesCss(){
        $error = '';
        $success = true;
        $toReturn = $this->modulesCss;
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }
    
    function getLeftMenu(){
        $error = '';
        $success = true;
        $toReturn = $this->array_sort($this->leftMenu);
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function array_sort($array)
    {
        $new_array = array();

        foreach ($array as $k => $v) {
            $weight = 999;
            if( is_object($v) && isset($v->weight)){
                $weight = $v->weight;
            }else{
                $weight = $v["weight"];
            }
            $keyToPast = count($new_array);
            for ($i=0; $i < count($new_array)-1; $i++) { 
                $weightIn = 999;
                $weightNext = 999;
                if( isset(($new_array[$i])->weight) ){
                    $weightIn = ($new_array[$i])->weight;
                }else{
                    $weightIn = ($new_array[$i])["weight"];
                }
                if( isset(($new_array[$i+1])->weight) ){
                    $weightNext = ($new_array[$i+1])->weight;
                }else{
                    $weightNext = ($new_array[$i+1])["weight"];
                }
                if( $weightNext <= $weight ) continue;
                if( $weightIn < $weight ) $keyToPast = $i+1;
                else $keyToPast = $i;
                break;
            }
            array_splice( $new_array, $keyToPast, 0, array($v) );
        }

        return $new_array;
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}