<?php
namespace Modules\Payment;

use Core\Notify\Notify;
use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\System\MailSystem;
use Core\Teams\Teams;
use TiBeN\CrontabManager\CrontabJob;
use TiBeN\CrontabManager\CrontabRepository;
use TiBeN\CrontabManager\CrontabAdapter;

class Payment extends BasicModule {
    private $teamsMenager;

    function install(){
      ($this->db->getConnection())->executeSql('CREATE TABLE IF NOT EXISTS `payment_status` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;');
      ($this->db->getConnection())->executeSql('INSERT INTO payment_status (`name`) VALUES ("Do zapłaty"), ("Oczekiwanie na potwierdzenie"), ("Zakończono"), ("Nie zapłacono"), ("Potrzebna kontrola")');
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `payment_list` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `amount` FLOAT NOT NULL , `id_user` INT NOT NULL , `id_status` INT NOT NULL , `id_team` INT NOT NULL ,`date_to_pay` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `date_change` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , `date_add` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `cyclePayments` ( `id` INT NOT NULL AUTO_INCREMENT ,`id_team` INT NOT NULL, `howLongBefore` INT NOT NULL, `intervalTime` INT NOT NULL , `intervalName` VARCHAR(50) NOT NULL , `title` VARCHAR(200) NOT NULL , `amount` FLOAT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
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
        $date_to_pay = $data['date_to_pay'];
      $token = $data['token'];
      $adminId = $this->auth->getUserId($token);

      if($adminId){
        for($i=0; $i<count($userIds); $i++){
          $data = [
            'id_user'   => $userIds[$i],
            'id_status' => 1,
            'date_to_pay' =>$date_to_pay,
            'id_team'   => $tmid,
            'name'      => $name,
            'amount'    => str_replace( ',', '.', $amount),
          ];
          ($this->db->getConnection())->insert('payment_list', $data);

          $userData = ($this->db->getConnection())->fetchRow('SELECT firstname, lastname, email FROM users, user_data WHERE users.id = user_data.user_id AND users.id ='.$userIds[$i]);
          $mailRespond = MailSystem::sendMail($userData['email'],"Nowa płatność w systemie",
          "<p style='color:#ffffff'><b>Witaj! ".$userData['firstname']." ".$userData['lastname']."</b></p>
          <p style='color:#ffffff'>Właśnie do Twojego konta została dodana nowa płatność:</p>
          <p style='color:#ffffff'>Nazwa: ".$name."</p>
          <p style='color:#ffffff'>Kwota: ".str_replace( ',', '.', $amount)."</p>
          <p style='color:#ffffff'>Płatne do dnia: ".$date_to_pay."</p>
          <p style='color:#ffffff'>Informacje te dostępne są także na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a></p>");
        }
      }else{
        $this->returnedData["error"] = "Nie można uzyskać danych Twojego konta. Zaloguj się jeszcze raz.";
        $this->returnedData["success"] = false;
      }

      return $this->returnedData;
    }

    function getPaymentSummary($data){
      $completed = ($this->db->getConnection())->fetchRow('SELECT sum( amount ) as sum FROM payment_list WHERE MONTH(date_add) = MONTH(CURRENT_DATE()) AND id_status = 3');
      $waiting = ($this->db->getConnection())->fetchRow('SELECT sum( amount ) as sum FROM payment_list WHERE MONTH(date_add) = MONTH(CURRENT_DATE()) AND (id_status = 1 OR id_status = 2)');
      $this->returnedData["data"]["completed"] = isset($completed["sum"]) ? $completed["sum"] : 0;
      $this->returnedData["data"]["waiting"] = isset($waiting["sum"]) ? $waiting["sum"] : 0;
      $this->returnedData["data"]["all"] = (float) $this->returnedData["data"]["completed"] + (float) $this->returnedData["data"]["waiting"];
        $this->returnedData["data"]["completed"] = round($this->returnedData["data"]["completed"] ,2);
        $this->returnedData["data"]["waiting"] = round($this->returnedData["data"]["waiting"] ,2);
        $this->returnedData["data"]["all"] = round($this->returnedData["data"]["all"] ,2);
      return $this->returnedData;
    }

    function sendPaymentReminder($data){
        $payId = $data['payId'];
        $token = $data['token'];
        $payment = ($this->db->getConnection())->fetchRow('SELECT * FROM payment_list WHERE id='.$payId);

        $notify = new Notify();
        $notify->addNotify([
            "title"=> "Ponaglenie do zapłaty: ".$payment['name']." w kwocie: ".round($payment['amount'],2)." zł",
                "tmid"=> $payment['id_team'],
                "token"=> $token,
                "to"=> [$payment['id_user']],
                "toAll"=> false,
                "url"=> "#!/clientPayment"
            ]);

        $userData = ($this->db->getConnection())->fetchRow('SELECT firstname, lastname, email FROM users, user_data WHERE users.id = user_data.user_id AND users.id ='.$payment['id_user']);
        $mailRespond = MailSystem::sendMail($userData['email'],"Ponaglenie do płatności",
            "<p style='color:#ffffff'><b>Witaj! ".$userData['firstname']." ".$userData['lastname']."</b></p>
          <p style='color:#ffffff'>Otrzymałeś włąsnie ponaglenie do płatności:</p>
          <p style='color:#ffffff'>Tytuł płatności: ".$payment['name']."</p>
          <p style='color:#ffffff'>Kwota: ".str_replace( ',', '.', round($payment['amount'],2))."</p>
          <p style='color:#ffffff'>Płatne do dnia: ".$payment['date_to_pay']."</p>
          <p style='color:#ffffff'>Informacje te dostępne są także na <a style='color: #ffcb6a;' href='//".$_SERVER['HTTP_HOST']."'>Stronie Klubu</a></p>");

        return $this->returnedData;
    }

    function getUserPaymentHistory($data){
      $tmid = $data['tmid'];
      $usids = $data['usids'];

      if(is_array($usids)){
          $this->returnedData["data"]["data"] = ($this->db->getConnection())->fetchRowMany('SELECT payment_list.id, payment_list.amount, payment_list.name, payment_status.name as statusName, DATE(payment_list.date_to_pay) AS date_to_pay, user_data.firstname, user_data.lastname FROM payment_list, payment_status, users, user_data WHERE payment_list.id_user = users.id AND user_data.user_id = users.id AND payment_list.id_status = payment_status.id AND payment_list.id_team='.$tmid.' GROUP BY payment_list.id ORDER BY payment_list.id DESC LIMIT 50');
          $this->returnedData["data"]["payed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE payment_list.id_status = 3 AND payment_list.id_team='.$tmid.' GROUP BY payment_list.id')['summary'],2);
          $this->returnedData["data"]["delayed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE (payment_list.id_status = 1 OR payment_list.id_status = 2) AND payment_list.id_team='.$tmid.' AND NOW() > DATE(payment_list.date_to_pay) GROUP BY payment_list.id')['summary'],2);
          $this->returnedData["data"]["notPayed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE (payment_list.id_status = 1 OR payment_list.id_status = 2) AND payment_list.id_team='.$tmid.' GROUP BY payment_list.id')['summary'],2);
      }else{
          $this->returnedData["data"]["data"] = ($this->db->getConnection())->fetchRowMany('SELECT payment_list.id, payment_list.amount, payment_list.name, payment_status.name as statusName, DATE(payment_list.date_to_pay) AS date_to_pay, user_data.firstname, user_data.lastname FROM payment_list, payment_status, users, user_data WHERE payment_list.id_user = users.id AND user_data.user_id = users.id AND payment_list.id_status = payment_status.id AND payment_list.id_user='.$usids.' AND payment_list.id_team='.$tmid.' GROUP BY payment_list.id ORDER BY payment_list.id DESC LIMIT 50');
          $this->returnedData["data"]["payed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE payment_list.id_status = 3 AND payment_list.id_user='.$usids.' AND payment_list.id_team='.$tmid.' GROUP BY payment_list.id')['summary'],2);
          $this->returnedData["data"]["delayed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE (payment_list.id_status = 1 OR payment_list.id_status = 2) AND payment_list.id_team='.$tmid.' AND payment_list.id_user='.$usids.' AND NOW() > DATE(payment_list.date_to_pay) GROUP BY payment_list.id')['summary'],2);
          $this->returnedData["data"]["notPayed"] = round(($this->db->getConnection())->fetchRow('SELECT SUM(payment_list.amount) AS summary FROM payment_list WHERE (payment_list.id_status = 1 OR payment_list.id_status = 2) AND payment_list.id_team='.$tmid.' AND payment_list.id_user='.$usids.' GROUP BY payment_list.id')['summary'],2);
      }

        $this->returnedData["data"]["notPayed"] = $this->returnedData["data"]["notPayed"] - $this->returnedData["data"]["delayed"];

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
        $tmid = $data["tmid"];
        $this->returnedData['data'] = ($this->db->getConnection())->delete('cyclePayments', ['id' => $id]);
        $this->teamsMenager = new Teams();
        $allTeamUser = $this->teamsMenager->getUserFromTeam(["tmid"=>$tmid]);
        $crontabRepository = new CrontabRepository(new CrontabAdapter());
        for($i=0;$i<count($allTeamUser["data"]);$i++){
            $usid = $allTeamUser["data"][$i]["usid"];
            $name = $usid.'_'.$id.'_'.$tmid;
            if(file_exists(__DIR__.'/cron/'.$usid.'_'.$id.'_'.$tmid.'.php')){
                unlink(__DIR__.'/cron/'.$usid.'_'.$id.'_'.$tmid.'.php');
            }
            $results = $crontabRepository->findJobByRegex('/'.$name.'/');
            if(isset($results[0]))$crontabRepository->removeJob($results[0]);
        }
        $crontabRepository->persist();
      return $this->returnedData;
    }

    function addCyclePayment($data){
      $tmid = $data["tmid"];
      $title = $data["title"];
      $interval = $data["interval"];
      $intervalName = $data["intervalName"];
        $amount = $data["amount"];
        $howLongBefore = $data["howLongBefore"];
      $token = $data['token'];

      $data = [
        'id_team'   => $tmid,
        'title'   => $title,
        'intervalTime'  => $interval,
          'intervalName'  => $intervalName,
          'howLongBefore'  => $howLongBefore,
        'amount'  => round($amount,2),
      ];
   
      $this->returnedData['data'] = ($this->db->getConnection())->insert('cyclePayments', $data);
      shell_exec("PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/games:/usr/local/sbin:/usr/local/bin:login/bin");
      $this->addCronPaymentForUser($tmid,$data,$this->returnedData['data'],$token);
      return $this->returnedData;
    }

    function addCronPaymentForUser($tmid,$data,$id,$token){
        $this->teamsMenager = new Teams();
        $allTeamUser = $this->teamsMenager->getUserFromTeam(["tmid"=>$tmid]);
        $crontabRepository = new CrontabRepository(new CrontabAdapter());
        for($i=0;$i<count($allTeamUser["data"]);$i++){
            $usid = $allTeamUser["data"][$i]["usid"];
            $crontabJob = new CrontabJob();
            if( $data['intervalName'] === "dzień"){
                //codziennie
                $crontabJob->minutes = '0';
                $crontabJob->hours = '*/'.$data['intervalTime'];
                $crontabJob->dayOfMonth = '*';
                $crontabJob->months = '*';
                $crontabJob->dayOfWeek = '*';
            }else if($data['intervalName'] === "tydzień"){
                //tygodniowo
                $crontabJob->minutes = '0';
                $crontabJob->hours = '0';
                $crontabJob->dayOfMonth = '*';
                $crontabJob->months = '*';
                $crontabJob->dayOfWeek = '*/'.$data['intervalTime'];
            }else{
                //miesiecznie
                $crontabJob->minutes = '0';
                $crontabJob->hours = '0';
                $crontabJob->dayOfMonth = '*/'.$data['intervalTime'];
                $crontabJob->months = '*';
                $crontabJob->dayOfWeek = '*';
            }

            file_put_contents(__DIR__.'/cron/'.$usid.'_'.$id.'_'.$tmid.'.php',
                '
                <?php
                    require "'.__DIR__.'/../../core/vendor/autoload.php";
                    use Core\Notify\Notify;
                    use Modules\Payment\Payment;
                    $payment = new Payment();
                    $payment->addPaymentToUser([
                        "token" => "'.$token.'",
                        "userIds" => ['.$usid.'],
                        "tmid" => '.$tmid.',
                        "amount" => "'.$data["amount"].'",
                        "name" => "'.$data["title"].'",
                        "date_to_pay" => date("Y-m-d", strtotime(date("Y-m-d") . " + '.$data['howLongBefore'].' days"))
                    ]);
                    $notify = new Notify();
                    $notify->addNotify([
                        "title"=> "'."Nowa płatność cykliczna: ".$data["title"]." na kwotę: ".round($data["amount"],2).' zł",
                        "tmid"=> '.$tmid.',
                        "token"=> "'.$token.'",
                        "to"=> ['.$usid.'],
                        "toAll"=> false,
                        "url"=> "#!/clientPayment"
                    ]);
                '
                ,FILE_USE_INCLUDE_PATH);
            $crontabJob->taskCommandLine = 'php71 '.__DIR__.'/cron/'.$usid.'_'.$id.'_'.$tmid.'.php';
            $crontabJob->comments = $usid.'_'.$id.'_'.$tmid;
            $crontabRepository->addJob($crontabJob);
        }
        $crontabRepository->persist();
    }
}