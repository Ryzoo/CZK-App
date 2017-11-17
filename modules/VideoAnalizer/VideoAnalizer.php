<?php
namespace Modules\VideoAnalizer;

use Core\System\BasicModule;
use \KHerGe\JSON\JSON;
use Core\Teams\Teams;
use Modules\VideoAnalizer\UploadHandler;

class VideoAnalizer extends BasicModule {
    private $teamsMenager;

    function install(){
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `videoAnalize` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `description` TINYTEXT NOT NULL , `id_user` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `videoFragments` ( `id` INT NOT NULL AUTO_INCREMENT , `id_analize` INT NOT NULL, `name` VARCHAR(255) NOT NULL , `start_time` FLOAT NOT NULL , `end_time` FLOAT NOT NULL , `url` TINYTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
    }

    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS videoFragments');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS videoAnalize');
    }

    function saveFragments($data){
      $frName = $data['frName'];
      $frDescription = $data['frDescription'];
      $frList = $data['frList'];
      $usid = $data['usid'];
      $videoName = $data['videoName'];
      $token = $data['token'];

      $fileName = $token."_".$videoName;
      $pathToFile = "../files/videoAnalize/";

      $analizeId = ($this->db->getConnection())->insert("videoAnalize", [
          "name" => $frName,
          "description" => $frDescription,
          "id_user" => $usid
      ]);

      $frName = str_replace(" ","_", $frName);
      $analizeDir = $pathToFile.$frName."/";
      if( !file_exists($analizeDir) ){
        mkdir($analizeDir);
      }
       
      foreach($frList as $fragments){
        $name = $fragments["name"];
        foreach($fragments["list"] as $oneFragment){
          $start = ((float)$oneFragment["start"])*100;
          $duration = (((float)$oneFragment["end"])*100)-$start;
          $fragmentName = str_replace(" ","_", $name)."_".str_replace(".","_", $start)."_".str_replace(".","_", $duration).".mp4";
          $fragmentUrl = $analizeDir.$fragmentName;
          exec("ffmpeg -ss ".$start." -i ".$pathToFile.$fileName." -t ".$duration." -c copy ".$fragmentUrl);
          $analizeId = ($this->db->getConnection())->insert("videoFragments", [
              "id_analize" => $analizeId,
              "name" => $name,
              "start_time" => $start,
              "end_time" => ((float)$oneFragment["end"])*100,
              "url" => str_replace("../","./", $fragmentUrl)
          ]);
        }
      }

      unlink($pathToFile.$fileName);

      return $this->returnedData;
    }

    function saveVideoClip(){
      $fileName = explode("=",str_replace("\"","",$_SERVER['HTTP_CONTENT_DISPOSITION']))[1];
      $tq = str_replace("tq=","",$_SERVER['HTTP_COOKIE']);
      if(!isset($fileName) || strlen($fileName) <= 3 ||!isset($tq) || strlen($tq) <= 3 ){
        $this->returnedData['success'] = false;
        $this->returnedData['error'] = "Brak odpowiednich danych";
      }else{
        file_put_contents("../files/videoAnalize/".$tq."_".$fileName, $this->decode_chunked(file_get_contents("php://input")), FILE_APPEND);
      }
      return $this->returnedData;
    }

    function decode_chunked($data) {
        if (!preg_match('/^([0-9a-f]+)(?:;(?:[\w-]*)(?:=(?:(?:[\w-]*)*|"(?:[^\r\n])*"))?)*\r\n/i', trim($data))) {
            return $data;
        }
    
        $decoded = '';
        $encoded = $data;
    
        while (true) {
            $is_chunked = (bool) preg_match('/^([0-9a-f]+)(?:;(?:[\w-]*)(?:=(?:(?:[\w-]*)*|"(?:[^\r\n])*"))?)*\r\n/i', $encoded, $matches);
            if (!$is_chunked) {
                // Looks like it's not chunked after all
                return $data;
            }
    
            $length = hexdec(trim($matches[1]));
            if ($length === 0) {
                // Ignore trailer headers
                return $decoded;
            }
    
            $chunk_length = strlen($matches[0]);
            $decoded .= substr($encoded, $chunk_length, $length);
            $encoded = substr($encoded, $chunk_length + $length + 2);
    
            if (trim($encoded) === '0' || empty($encoded)) {
                return $decoded;
            }
        }
    
        // We'll never actually get down here
        // @codeCoverageIgnoreStart
    }

}