<?php
require __DIR__ . '/../vendor/autoload.php';

class Route{
    private $request = "";
    private $dataToReturn = "";
    private $postData = "";
    private $authorize = "";
    private $postMenager = "";
    private $teamMenager = "";
    private $staffMenager = "";
    private $newsMenager = "";
    private $playersMenager = "";

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->authorize = new Auth();
        $this->postMenager = new Post();
        $this->teamMenager = new Teams();
        $this->staffMenager = new Staff();
        $this->newsMenager = new News();
        $this->playersMenager = new Players();
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
        }else if( $this->request === "addPost" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->addPost($this->postData);
        }else if( $this->request === "addComment" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->addComment($this->postData);
        }else if( $this->request === "deleteComment" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->deleteComment($this->postData);
        }else if( $this->request === "deletePost" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->deletePost($this->postData);
        }else if( $this->request === "getTeams" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->getTeamsByToken($this->postData['token']);
        }else if( $this->request === "getUserFromTeam" ){
            if( isset($this->postData['tmid']) )
                $this->dataToReturn = $this->teamMenager->getUserFromTeam($this->postData['tmid']);
        }else if( $this->request === "getAllPosition" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->getAllPosition();
        }else if( $this->request === "changeCollection" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->changeCollection($this->postData);
        }else if( $this->request === "getTeamStaff" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->staffMenager->getTeamStaff($this->postData['tmid']);
        }else if( $this->request === "getFullPersonel" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->staffMenager->getFullPersonel($this->postData['tmid']);
        }else if( $this->request === "addStaff" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->staffMenager->addStaff($this->postData);
        }else if( $this->request === "deleteStaff" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->staffMenager->deleteStaff($this->postData);
        }else if( $this->request === "getNews" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->getAllNews($this->postData['tmid']);
        }else if( $this->request === "deleteNews" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->deleteNews($this->postData);
        }else if( $this->request === "addNews" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->addNews($this->postData);
        }else if( $this->request === "editNews" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->newsMenager->editNews($this->postData);
        }else if( $this->request === "getNowEvents" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->newsMenager->getNowEvents($this->postData['tmid']);
        }else if( $this->request === "getNextEvents" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->newsMenager->getNextEvents($this->postData['tmid']);
        }else if( $this->request === "getLastPost" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->postMenager->getLastPost($this->postData['tmid']);
        }else if( $this->request === "getAllPlayers" ){
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->playersMenager->getAllPlayers($this->postData['tmid']);
        }else if( $this->request === "addPerson" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->addPerson($this->postData);
        }else if( $this->request === "getAllUserData" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->getAllUserData($this->postData);
        }else if( $this->request === "deleteUser" ){
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->deleteUser($this->postData);
        }
        
    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}