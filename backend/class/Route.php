<?php

class Route{
    private $request = "";
    private $dataToReturn = "";
    private $postData = "";

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->checkRequest();
    }

    function checkRequest(){
        if( $this->request === "login" ){
            $this->dataToReturn = array( "error"=>"Brak danych" ,"success"=>false,"token"=>"" );
            $authorize = new Auth();
            if( isset($this->postData['email']) && isset($this->postData['pass']) )
                $this->dataToReturn = $authorize->login($this->postData['email'], $this->postData['pass']);
        }
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}