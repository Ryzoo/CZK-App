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
        $this->returnedData['data'] = ($this->db->getConnection())->fetchRow("SELECT * FROM ma_meet WHERE status LIKE 'Oczekiwanie' AND date >= NOW() AND id_team=".$tmid." ORDER BY date LIMIT 1");
        return $this->returnedData;
    }
}
