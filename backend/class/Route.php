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
    private $todoMenager = "";
    private $notifyMenager = "";
    private $raportsMenager = "";
    private $statsMenager = "";

    function __construct( $allPost ){
        $this->postData = $allPost;
        $this->request = str_replace("/backend/","",$_SERVER['REQUEST_URI']);
        $this->authorize = new Auth();
        $this->postMenager = new Post();
        $this->teamMenager = new Teams();
        $this->staffMenager = new Staff();
        $this->newsMenager = new News();
        $this->playersMenager = new Players();
        $this->todoMenager = new Todo();
        $this->notifyMenager = new Notify();
        $this->raportsMenager = new Raports();
        $this->statsMenager = new Stats();
        $this->dataToReturn = array( "error"=>"Brak danych" ,"success"=>false,"token"=>"" );
        $this->checkRequest();
    }

    function checkRequest(){ 
        if( $this->request === "login" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['email']) && isset($this->postData['pass']) )
                $this->dataToReturn = $this->authorize->login($this->postData['email'], $this->postData['pass']);
        }else if( $this->request === "userData" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->authorize->getUserData($this->postData['token']);
        }else if( $this->request === "updateUserData" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->authorize->updateUserData($this->postData);
        }else if( $this->request === "checkIsLoged" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->authorize->checkIsLoged($this->postData['token']);
        }else if( $this->request === "getPost" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->getPost($this->postData);
        }else if( $this->request === "addPost" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->addPost($this->postData);
        }else if( $this->request === "addComment" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->addComment($this->postData);
        }else if( $this->request === "deleteComment" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->deleteComment($this->postData);
        }else if( $this->request === "deletePost" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->postMenager->deletePost($this->postData);
        }else if( $this->request === "getTeams" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->getTeamsByToken($this->postData['token']);
        }else if( $this->request === "getUserFromTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['tmid']) )
                $this->dataToReturn = $this->teamMenager->getUserFromTeam($this->postData['tmid']);
        }else if( $this->request === "getAllPosition" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->getAllPosition();
        }else if( $this->request === "changeCollection" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->changeCollection($this->postData);
        }else if( $this->request === "getAllTeams" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->getAllTeams();
        }else if( $this->request === "getAllMastersFromTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->teamMenager->getAllMastersFromTeam($this->postData['tmid']);
        }else if( $this->request === "deleteTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->deleteTeam($this->postData);
        }else if( $this->request === "addTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->addTeam($this->postData);
        }else if( $this->request === "deleteMasterFromTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->deleteMasterFromTeam($this->postData);
        }else if( $this->request === "addMasterToTeam" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->teamMenager->addMasterToTeam($this->postData);
        }else if( $this->request === "getTeamStaff" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->staffMenager->getTeamStaff($this->postData['tmid']);
        }else if( $this->request === "getFullPersonel" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->staffMenager->getFullPersonel($this->postData['tmid']);
        }else if( $this->request === "getKoords" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->staffMenager->getKoords();
        }else if( $this->request === "addStaff" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->staffMenager->addStaff($this->postData);
        }else if( $this->request === "deleteStaff" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->staffMenager->deleteStaff($this->postData);
        }else if( $this->request === "getNews" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->getAllNews($this->postData['tmid']);
        }else if( $this->request === "deleteNews" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->deleteNews($this->postData);
        }else if( $this->request === "addNews" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']) )
                $this->dataToReturn = $this->newsMenager->addNews($this->postData);
        }else if( $this->request === "editNews" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->newsMenager->editNews($this->postData);
        }else if( $this->request === "getNowEvents" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->newsMenager->getNowEvents($this->postData['tmid']);
        }else if( $this->request === "getNextEvents" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->newsMenager->getNextEvents($this->postData['tmid']);
        }else if( $this->request === "getLastPost" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->postMenager->getLastPost($this->postData['tmid']);
        }else if( $this->request === "getAllPlayers" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tmid']))
                $this->dataToReturn = $this->playersMenager->getAllPlayers($this->postData['tmid']);
        }else if( $this->request === "getScoreFromTestId" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->getScoreFromTestId($this->postData);
        }else if( $this->request === "addPerson" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->addPerson($this->postData);
        }else if( $this->request === "getAllMaster" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->getAllMaster();
        }else if( $this->request === "getAllUserData" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->getAllUserData($this->postData);
        }else if( $this->request === "deleteUser" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->playersMenager->deleteUser($this->postData);
        }else if( $this->request === "getTodo" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->todoMenager->getTodo($this->postData['token']);
        }else if( $this->request === "endTodo" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->todoMenager->endTodo($this->postData['tid']);
        }else if( $this->request === "addTodo" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->todoMenager->addTodo($this->postData);
        }else if( $this->request === "addNotify" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->notifyMenager->addNotify($this->postData);
        }else if( $this->request === "getNewNotify" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->notifyMenager->getNewNotify($this->postData);
        }else if( $this->request === "getAllNotify" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->notifyMenager->getAllNotify($this->postData);
        }else if( $this->request === "setNewNotifyOff" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->notifyMenager->setNewNotifyOff($this->postData);
        }else if( $this->request === "addRaport" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->raportsMenager->addRaport($this->postData);
        }else if( $this->request === "getRaport" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->raportsMenager->getRaport($this->postData);
        }else if( $this->request === "deleteRaport" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->raportsMenager->deleteRaport($this->postData);
        }else if( $this->request === "getStats" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->getStats($this->postData);
        }else if( $this->request === "getTeamStats" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->getTeamStats($this->postData);
        }else if( $this->request === "addScore" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->addScore($this->postData);
        }else if( $this->request === "deleteScore" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) && isset($this->postData['tsid']))
                $this->dataToReturn = $this->statsMenager->deleteScore($this->postData);
        }else if( $this->request === "getCategoryWitchTest" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->getCategoryWitchTest();
        }else if( $this->request === "addCategoryTest" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->addCategoryTest($this->postData);
        }else if( $this->request === "deleteCategoryTest" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->deleteCategoryTest($this->postData);
        }else if( $this->request === "addTestToCategory" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->addTestToCategory($this->postData);
        }else if( $this->request === "changeTest" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->changeTest($this->postData);
        }else if( $this->request === "deleteTestFromCat" ){
            if(DEBUG) header('Content-Type: application/json');
            if( isset($this->postData['token']) )
                $this->dataToReturn = $this->statsMenager->deleteTestFromCat($this->postData);
        }
        

    }

    function returnData(){
        return json_encode($this->dataToReturn);
    }
}