<?php

class Route{
    private $request = "";
    private $dataToReturn = "";
    private $postData = "";
    private $authorize = "";

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->authorize = new Auth();
        $this->dataToReturn = array( "error"=>"Brak danych" ,"success"=>false,"token"=>"" );
        $this->checkRequest();
    }

    function checkRequest(){
        if( $this->request === "login" ){
            if( isset($this->postData['email']) && isset($this->postData['pass']) )
                $this->dataToReturn = $this->authorize->login($this->postData['email'], $this->postData['pass']);
        }else if( $this->request === "userData" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->authorize->getUserData($this->postData['token']);
        }
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}