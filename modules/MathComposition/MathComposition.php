<?php
namespace Modules\MathComposition;
use Core\System\BasicModule;
use Modules\StatsManager\StatsManager;

class MathComposition extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function getUsersHelpfulness($data){
        $teamForm = (float) $data['teamForm'];
        $matchTeam = isset($data['matchTeam']) ?$data['matchTeam']:[];
        $otherTeam = $data['otherTeam'];
        $tmid = $data['tmid'];
        $this->returnedData["data"] = [];

        if(count($matchTeam) >= 11){
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
                ])['data']['teamForm'])/(1100.0);

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
