<?php
namespace Modules\MathComposition;
use Core\System\BasicModule;
use Modules\StatsManager\StatsManager;
use \KHerGe\JSON\JSON;

class MathComposition extends BasicModule {
    private $maxPlayers;
    private $colorId;

    function __construct()
    {
        parent::__construct();
        $this->getModuleOptions();
    }

    function install(){
    }

    function uninstall(){
    }

    function getModuleOptions(){
        $json = new JSON();
        $moduleConfig = $json->decodeFile(__DIR__. '/config.json' );
        $this->maxPlayers = $moduleConfig->maxPlayers;
        $this->colorId = $moduleConfig->colorId;
    }

    function getUsersHelpfulness($data){
        $teamForm = (float) $data['teamForm'];
        $matchTeam = isset($data['matchTeam']) ?$data['matchTeam']:[];
        $otherTeam = $data['otherTeam'];
        $tmid = $data['tmid'];
        $this->returnedData["data"] = [];

        if(count($matchTeam) >= $this->maxPlayers){
            for ($i=0; $i < count($otherTeam); $i++) { 
                array_push($this->returnedData["data"],[
                    "help" => 'osiągnięto limit zawodników'
                ]);
            }
        }else{
            $statManager = new StatsManager();
            for ($i=0; $i < count($otherTeam); $i++) { 
                $userArray = array_merge($matchTeam,[$otherTeam[$i]]);
                $formWithThisUser = 100 * ($statManager->getStats([
                    "tmid"=>$tmid,
                    "usid"=>$userArray,
                    "last"=>true
                ])['data']['teamForm'])/($this->maxPlayers*100.0);

                $varToShow = round($formWithThisUser - $teamForm,2);
                $wordToShow =  $varToShow == 0 ? "" : $varToShow > 0 ? "+" : "-";
                $varToShow  = abs($varToShow);
                
                array_push($this->returnedData["data"],[
                    "help" => $wordToShow . ' ' . $varToShow
                ]);
            }
        }
        return $this->returnedData;
    }
}
