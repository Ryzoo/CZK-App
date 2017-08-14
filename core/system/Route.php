<?php
namespace System;

use \KHerGe\JSON\JSON;
use Core\Auth;
use Core\Database;

class Route{
    private $request;
    private $dataToReturn;
    private $postData;
    private $modules = [];
    private $controllerList = [];
    private $frontRouteList = [];
    private $modulesJs = [];
    private $modulesCss = [];
    private $auth;

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->auth = new Auth();

        // load modules
        $json = new JSON();
        $modulesList = $json->decodeFile(__DIR__. '/../mainConf.json' );

        for ($z=0; $z < count($modulesList->installedModules) ; $z++) { 
            $moduleJson = $json->decodeFile(__DIR__. '/../../modules/'.$modulesList->installedModules[$z].'/config.json' );
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
            if( isset($moduleJson->css) ){
                $css = $moduleJson->css;
                for ($x=0; $x < count($css); $x++) { 
                    $css[$x] = "modules/".$moduleJson->name."/assets/css/" . $css[$x].".css";
                    array_push($this->modulesCss,$css[$x]);
                }
            }
            $moduleJson->name = "Modules\\".$moduleJson->name;
            array_push($this->modules,$moduleJson);
        }

        for ($z=0; $z < count($modulesList->coreModules) ; $z++) { 
            $moduleJson = $json->decodeFile(__DIR__. '/../modules/'.$modulesList->coreModules[$z].'/config.json' );
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
            if( isset($moduleJson->css) ){
                $css = $moduleJson->css;
                for ($x=0; $x < count($css); $x++) { 
                    $css[$x] = "core/modules/".$moduleJson->name."/assets/css/" . $css[$x].".css";
                    array_push($this->modulesCss,$css[$x]);
                }
            }
            $moduleJson->name = "Core\\".$moduleJson->name;
            array_push($this->modules,$moduleJson);
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

    function getModulesCss(){
        $error = '';
        $success = true;
        $toReturn = $this->modulesCss;
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}