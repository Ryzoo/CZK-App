<?php

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
    private $auth;

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->auth = new Auth();

        // load modules
        $json = new JSON();
        $modulesList = $json->decodeFile(__DIR__. '/mainConf.json' );

        // load core modules
        for ($i=0; $i < count($modulesList->coreModules); $i++) {
            if( isset($modulesList->coreModules[$i]->frontendRoute) ){
                $frontRoute = $modulesList->coreModules[$i]->frontendRoute;
                for ($x=0; $x < count($frontRoute); $x++) { 
                    $frontRoute[$x]->templateSrc = "core/modules/".$modulesList->coreModules[$i]->name."/templates/" . $frontRoute[$x]->templateSrc;
                    array_push($this->frontRouteList,$frontRoute[$x]);
                }
            }
            if( isset($modulesList->coreModules[$i]->jsControllers) ){
                $controllers = $modulesList->coreModules[$i]->jsControllers;
                for ($x=0; $x < count($controllers); $x++) {
                    $controllers[$x] = "core/modules/".$modulesList->coreModules[$i]->name."/" . $controllers[$x].".js";
                    array_push($this->controllerList,$controllers[$x]);
                }
            }
            $modulesList->coreModules[$i]->name = "Core\\".$modulesList->coreModules[$i]->name;
            array_push($this->modules,$modulesList->coreModules[$i]);
        }

        // load user modules
        for ($i=0; $i < count($modulesList->modules); $i++) {
            if( isset($modulesList->modules[$i]->frontendRoute) ){
                $frontRoute = $modulesList->modules[$i]->frontendRoute;
                for ($x=0; $x < count($frontRoute); $x++) { 
                    $frontRoute[$x]->templateSrc = "modules/".$modulesList->modules[$i]->name."/templates/" . $frontRoute[$x]->templateSrc;
                    array_push($this->frontRouteList,$frontRoute[$x]);
                }
            }
            if( isset($modulesList->modules[$i]->jsControllers) ){
                $controllers = $modulesList->modules[$i]->jsControllers;
                for ($x=0; $x < count($controllers); $x++) { 
                    $controllers[$x] = "modules/".$modulesList->modules[$i]->name."/" . $controllers[$x].".js";
                    array_push($this->controllerList,$controllers[$x]);
                }
            }
            $modulesList->modules[$i]->name = "Modules\\".$modulesList->modules[$i]->name;
            array_push($this->modules,$modulesList->modules[$i]);
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
        }else{
            for ($i=0; $i < count($this->modules); $i++) { 
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
        $toReturn = $this->controllerList;
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}