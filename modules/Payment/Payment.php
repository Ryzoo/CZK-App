<?php
namespace Modules\Payment;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\System\MailSystem;
use Core\Teams\Teams;

class Payment extends BasicModule {
    private $teamsMenager;

    function install(){
      ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `payment_status` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
      ($this->db->getConnection())->executeSql('INSERT INTO payment_status (`name`) VALUES ("Do zapłaty"), ("Oczekiwanie na potwierdzenie"), ("Zakończono"), ("Nie zapłacono"), ("Potrzebna kontrola")');
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `payment_list` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `amount` INT NOT NULL , `id_user` INT NOT NULL , `id_status` INT NOT NULL , `id_team` INT NOT NULL , `id_admin` INT NOT NULL , `date_change` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , `date_add` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `cyclePayments` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_team` INT NOT NULL, `date_start` DATE NOT NULL , `intervalTime` INT NOT NULL , `intervalName` VARCHAR(50) NOT NULL , `title` VARCHAR(200) NOT NULL , `amount` FLOAT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `cycleUserPayments` ( `id` INT NOT NULL AUTO_INCREMENT , `id_user` INT NOT NULL , `id_cycle_pay` INT NOT NULL , `is_added_today` BOOLEAN NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS payment_status');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS payment_list');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS cyclePayments');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS cycleUserPayments');
    }

    function addPaymentToUser($data){
      $tmid = $data['tmid'];
      $userIds = $data['userIds'];
      $amount = $data['amount'];
      $name = $data['name'];
      $token = $data['token'];
      $adminId = $this->auth->getUserId($token);

      if($adminId){
        for($i=0; $i<count($userIds); $i++){
          $data = [
            'id_user'   => $userIds[$i],
            'id_status' => 1,
            'id_team'   => $tmid,
            'name'      => $name,
            'amount'    => str_replace( ',', '.', $amount),
            "id_admin"  => $adminId
          ];
          ($this->db->getConnection())->insert('payment_list', $data);

          $userData = ($this->db->getConnection())->fetchRow('SELECT firstname, lastname, email FROM users, user_data WHERE users.id = user_data.user_id AND users.id ='.$userIds[$i]);
          $mailRespond = MailSystem::sendMail($userData['email'],"Nowa płatność w systemie",
          "<p style='color:#ffffff'><b>Witaj! ".$userData['firstname']." ".$userData['lastname']."</b></p>
          <p style='color:#ffffff'>Właśnie do Twojego konta została dodana nowa płatność:</p>
          <p style='color:#ffffff'>Nazwa: ".$name."</p>
          <p style='color:#ffffff'>Kwota: ".str_replace( ',', '.', $amount)."</p>
          <p style='color:#ffffff'>Informacje te dostępne są także na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a></p>");
        }
      }else{
        $this->returnedData["error"] = "Nie można uzyskać danych Twojego konta. Zaloguj się jeszcze raz.";
        $this->returnedData["success"] = false;
      }

      return $this->returnedData;
    }

    function getPaymentSummary($data){
      $tmid = $data['tmid'];
      $this->addPaymentCycleToUser($tmid,$data['token']);
      $completed = ($this->db->getConnection())->fetchRow('SELECT sum( amount ) as sum FROM payment_list WHERE MONTH(date_add) = MONTH(CURRENT_DATE()) AND id_status = 3');
      $waiting = ($this->db->getConnection())->fetchRow('SELECT sum( amount ) as sum FROM payment_list WHERE MONTH(date_add) = MONTH(CURRENT_DATE()) AND (id_status = 1 OR id_status = 2)');
      $this->returnedData["data"]["completed"] = isset($completed["sum"]) ? $completed["sum"] : 0;
      $this->returnedData["data"]["waiting"] = isset($waiting["sum"]) ? $waiting["sum"] : 0;
      $this->returnedData["data"]["all"] = (float) $this->returnedData["data"]["completed"] + (float) $this->returnedData["data"]["waiting"];
      return $this->returnedData;
    }

    function getUserPaymentHistory($data){
      $tmid = $data['tmid'];
      $this->addPaymentCycleToUser($tmid,$data['token']);
      $usids = $data['usids'];
      $this->returnedData["data"] = [];

      for($i=0;$i<count($usids);$i++){
        $userHistory = ($this->db->getConnection())->fetchRowMany('SELECT payment_list.id, payment_list.amount, payment_list.name, payment_status.name as statusName, payment_list.date_add, payment_list.date_change, user_data.firstname as adminFirstname, user_data.lastname as adminLastname FROM payment_list, users, payment_status, user_data WHERE users.id = user_data.user_id AND payment_list.id_admin=users.id AND payment_list.id_status = payment_status.id AND payment_list.id_user='.$usids[$i].' AND payment_list.id_team='.$tmid.' ORDER BY payment_list.date_add DESC');
        $userData = ($this->db->getConnection())->fetchRow('SELECT user_data.firstname, user_data.lastname FROM user_data WHERE user_data.user_id='.$usids[$i]);
        array_push($this->returnedData["data"],[ "usid"=>$usids[$i], "firstname"=>$userData["firstname"], "lastname"=>$userData["lastname"], "data"=>$userHistory]);
      }
      
      return $this->returnedData;
    }

    function deletePayment($data){
      $pmid = $data['pmid'];
      ($this->db->getConnection())->delete('payment_list', ['id' => $pmid]);
      return $this->returnedData;
    }

    function payWithPayu($data){
      $pmid = $data['pmid'];
      $conds['id'] = $pmid;
      $dataC['id_status'] = 2;
      $this->returnedData["data"] = ($this->db->getConnection())->update('payment_list', $conds, $dataC);
      return $this->returnedData;
    }

    function endPayment($data){
      $pmid = $data['pmid'];
      $conds['id'] = $pmid;
      $dataC['id_status'] = 3;
      $toReturn = ($this->db->getConnection())->update('payment_list', $conds, $dataC);
      return $this->returnedData;
    }

    function getPaymentOptions(){
      $json = new JSON();
      $modulesConfig = $json->decodeFile(__DIR__. '/config.json');
      
      $this->returnedData["data"] = [
        "merchantPosId"=>$modulesConfig->merchantPosId,
        "merchantKey"=>$modulesConfig->merchantKey,
        "availablePaymentPayu"=>$modulesConfig->availablePaymentPayu
      ];

      return $this->returnedData;
    }

    function editOptions($data){
      $merchantPosId = $data["posId"];
      $merchantKey = $data["merKey"];
      $json = new JSON();
      $modulesConfig = $json->decodeFile(__DIR__. '/config.json');
      $modulesConfig->merchantPosId = $merchantPosId;
      $modulesConfig->merchantKey = $merchantKey;
      unlink(__DIR__. '/config.json');
      $json->encodeFile($modulesConfig, __DIR__. '/config.json');
      return $this->returnedData;
    }

    function turnOffOnPayuPay($data){
      $payStatus = $data["payStatus"];
      $json = new JSON();
      $modulesConfig = $json->decodeFile(__DIR__. '/config.json');
      $modulesConfig->availablePaymentPayu = $payStatus;
      unlink(__DIR__. '/config.json');
      $json->encodeFile($modulesConfig, __DIR__. '/config.json');
      $this->returnedData["data"] = $payStatus;
      return $this->returnedData;
    }

    function paymentNotification($data){
      $data = json_decode(file_get_contents('php://input'));
      $order = $data->order;
      $status = $order->status;
      $pmid = $order->extOrderId;
      $conds['id'] = $pmid;
      
      if( $status == "COMPLETED" ) $dataC['id_status'] = 3;
      if( $status == "CANCELED" ) $dataC['id_status'] = 4;
      if( $status == "PENDING" ) $dataC['id_status'] = 2;
      if( $status == "WAITING_FOR_CONFIRMATION" ) $dataC['id_status'] = 5;
      if( $status == "REJECTED" ) $dataC['id_status'] = 5;

      $toReturn = ($this->db->getConnection())->update('payment_list', $conds, $dataC);
    }

    function getPaySignature($data){
      ksort($data['sigData']);
      
      $signatureKey = ''; 
      foreach ($data['sigData'] as $key => $val) {
        $signatureKey .= str_replace("products.","products[0].",$key) . "=" . urlencode($val) . "&";
      }
      $signatureKey.=$data['merchantKey'];
      $this->returnedData['data'] ="sender=" . $data['posId'];
      $this->returnedData['data'] .=";algorithm=SHA-256;";
      $this->returnedData['data'] .= "signature=" . hash('sha256', $signatureKey);
      return $this->returnedData;
    }

    function getClientIp($data) {
      $ipaddress = '';
      if (getenv('HTTP_CLIENT_IP'))
          $ipaddress = getenv('HTTP_CLIENT_IP');
      else if(getenv('HTTP_X_FORWARDED_FOR'))
          $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
      else if(getenv('HTTP_X_FORWARDED'))
          $ipaddress = getenv('HTTP_X_FORWARDED');
      else if(getenv('HTTP_FORWARDED_FOR'))
          $ipaddress = getenv('HTTP_FORWARDED_FOR');
      else if(getenv('HTTP_FORWARDED'))
         $ipaddress = getenv('HTTP_FORWARDED');
      else if(getenv('REMOTE_ADDR'))
          $ipaddress = getenv('REMOTE_ADDR');
      else
          $ipaddress = 'UNKNOWN';

      $this->returnedData['data'] = $ipaddress;
      return $this->returnedData;
    }

    function getAllCyclePayment($data){
      $tmid = $data["tmid"];
      $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany('SELECT * FROM cyclePayments WHERE id_team='.$tmid);
      return $this->returnedData;
    }

    function deleteCyclePayment($data){
      $id = $data["id"];
      $this->returnedData['data'] = ($this->db->getConnection())->delete('cyclePayments', ['id' => $id]);
      $this->returnedData['data'] = ($this->db->getConnection())->delete('cycleUserPayments', ['id_cycle_pay' => $id]);
      return $this->returnedData;
    }

    function addCyclePayment($data){
      $tmid = $data["tmid"];
      $title = $data["title"];
      $startDate = $data["startDate"];
      $interval = $data["interval"];
      $intervalName = $data["intervalName"];
      $amount = $data["amount"];
      $token = $data['token'];

      $data = [
        'id_team'   => $tmid,
        'title'   => $title,
        'date_start' => $startDate,
        'intervalTime'  => $interval,
        'intervalName'  => $intervalName,
        'amount'  => round($amount,2),
      ];
      $this->returnedData['data'] = ($this->db->getConnection())->insert('cyclePayments', $data);
      $this->addPaymentCycleToUser($tmid,$token);
      return $this->returnedData;
    }

    function addPaymentCycleToUser($tmid,$token){
      $allCyclePayments = ($this->db->getConnection())->fetchRowMany('SELECT id as id FROM cyclePayments WHERE id_team='.$tmid);
      for($i=0;$i<count($allCyclePayments);$i++){
        $this->addPaymentCycleUpdateToUser($allCyclePayments[$i]["id"],$tmid);
      }
      $allUserCycelPay = ($this->db->getConnection())->fetchRowMany('SELECT cycleUserPayments.id as id, intervalTime, intervalName, date_start, id_user,is_added_today,title,amount  FROM cycleUserPayments, cyclePayments WHERE cycleUserPayments.id_cycle_pay = cyclePayments.id GROUP BY cycleUserPayments.id_user');
      for($i=0;$i<count($allUserCycelPay);$i++){
        
        $pid = $allUserCycelPay[$i]["id"];
        $interval = $allUserCycelPay[$i]["intervalTime"];
        $intervalName = $allUserCycelPay[$i]["intervalName"];
        $dateStart = date('Y-m-d',strtotime($allUserCycelPay[$i]["date_start"]));
        $dateNow = date('Y-m-d');

        $id_user = $allUserCycelPay[$i]["id_user"];
        $is_added_today = $allUserCycelPay[$i]["is_added_today"];
        $title = $allUserCycelPay[$i]["title"];
        $amount = $allUserCycelPay[$i]["amount"];
        
        while( strtotime($dateStart) < strtotime($dateNow)){
          if( $intervalName === "dzień"){
            $dateStart = date('Y-m-d', strtotime($dateStart . ' + '.$interval.' days'));
          }else if($intervalName === "tydzień"){
            $dateStart = date('Y-m-d', strtotime($dateStart . ' + '.$interval.' weeks'));
          }else{
            $dateStart = date('Y-m-d', strtotime($dateStart . ' + '.$interval.' months'));
          }
        }

        if( $dateNow === $dateStart && !$is_added_today ){
          $this->addPaymentToUser([
            "token" => $token,
            "userIds" => [$id_user],
            "tmid" => $tmid,
            "amount" => $amount,
            "name" => $title,
          ]);
          ($this->db->getConnection())->update('cycleUserPayments', ['id'=>$pid], ["is_added_today"=>1]);
          
    
          break;
        }else if( $dateNow !== $dateStart && $is_added_today){
          ($this->db->getConnection())->update('cycleUserPayments', ['id'=>$pid], ["is_added_today"=>0]);
        }

      }
    }

    function addPaymentCycleUpdateToUser($pid,$tmid){
      $this->teamsMenager = new Teams();
      $allTeamUser = $this->teamsMenager->getUserFromTeam(["tmid"=>$tmid]);
      for($i=0;$i<count($allTeamUser["data"]);$i++){
        $usid = $allTeamUser["data"][$i]["usid"];
        $payment = ($this->db->getConnection())->fetchRowMany('SELECT id FROM cycleUserPayments WHERE id_user='.$usid.' AND id_cycle_pay='.$pid);
        
        if( !isset($payment) ){
          $data = [
            'id_user'   => $usid,
            'id_cycle_pay'   => $pid,
            'is_added_today' => 0
          ];
          ($this->db->getConnection())->insert('cycleUserPayments', $data);
        }
      }
    }

}