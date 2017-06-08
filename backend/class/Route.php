<?php
require __DIR__ . '/../vendor/autoload.php';

class Route{
    private $request = "";
    private $dataToReturn = "";
    private $postData = "";
    private $authorize = "";
    private $postMenager = "";

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->authorize = new Auth();
        $this->postMenager = new Post();
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
        }else if( $this->request === "updateUserData" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->authorize->updateUserData($this->postData);
        }else if( $this->request === "getPost" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->getPost($this->postData);
        }else if( $this->request === "getComments" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->getComments($this->postData);
        }
        
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}