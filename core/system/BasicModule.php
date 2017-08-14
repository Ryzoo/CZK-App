<?php
namespace System;
use Core\Database;
use Core\Auth;
use System\BasicModuleInterface;

class BasicModule implements BasicModuleInterface
{
    public $db;
    public $auth;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
    }

    public function install(){
        die();
    }

    public function uninstall(){
        
    }
}
