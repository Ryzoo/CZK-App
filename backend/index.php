<?php
header('Content-Type: application/json');

require __DIR__ . '/vendor/autoload.php';

$routeSystem = new Route( $_POST );
echo $routeSystem->returnData();