<?php
define('DEBUG',true);
if(!DEBUG){
    header('Content-Type: application/json');
}else{
    error_reporting(E_ERROR);
}
require __DIR__ . '/vendor/autoload.php';

$routeSystem = new Route( $_POST );
echo $routeSystem->returnData();