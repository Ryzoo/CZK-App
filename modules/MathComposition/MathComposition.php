<?php
namespace Modules\MathComposition;
use Core\System\BasicModule;
use DateTime;
use Modules\StatsManager\StatsManager;
use \KHerGe\JSON\JSON;

class MathComposition extends BasicModule {

    function install(){
    }

    function uninstall(){
    }

    function getNextMatchComposition($data){
        $tmid = $data['tmid'];
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow('SELECT * FROM ma_meet WHERE DATE(date) >= DATE(NOW()) AND id_team='.$tmid.' ORDER BY date LIMIT 1');

        if(isset($this->returnedData['data']))
            if( $this->returnedData['data']['status'] == "Oczekiwanie" && (new DateTime()) > (new DateTime($this->returnedData['data']['date'])) ){
                $this->returnedData['data']['status'] = "Zakończone";
                ($this->db->getConnection())->update('ma_meet',["id"=>$this->returnedData['data']['id']],['status' => "Zakończone"]);
            }

        return $this->returnedData;
    }
}
