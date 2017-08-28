<?php
namespace Core\System;
use Core\Database\Database;
use Core\Auth\Auth;
use Core\System\BasicModuleInterface;

class BasicModule implements BasicModuleInterface
{
    public $db;
    public $auth;
    public $returnedData;

    function __construct(){
        $this->db = new Database();
        $this->auth = new Auth();
        $this->returnedData = [
            "error"=>"",
            "success"=>true,
            "data"=>[] 
        ];
    }

    public function install(){
        return true;
    }

    public function uninstall(){
        return true;
    }
}
