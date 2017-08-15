<?php
define('DEBUG',false);
if(!DEBUG){
    header('Content-Type: application/json');
}else{
    error_reporting(E_ERROR);
}
require "vendor/autoload.php";
use System\Route;

$routeSystem = new Route( $_POST );
echo $routeSystem->returnData();