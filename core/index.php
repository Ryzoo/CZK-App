<?php
define('DEBUG',false);
header('Content-Type: application/json');
error_reporting(E_ERROR);

require "vendor/autoload.php";
use Core\System\Route;

$routeSystem = new Route( $_POST );
echo $routeSystem->returnData();