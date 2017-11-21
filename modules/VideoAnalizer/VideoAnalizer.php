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
      ($this->db->getConnection())->executeSql("CREATE TABLE IF NOT EXISTS `videoHelpIcon` ( `id` INT NOT NULL AUTO_INCREMENT, `url` TINYTEXT NOT NULL , `description` TINYTEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;");
      $basicUrl = "./modules/VideoAnalizer/assets/media/icons/";
      ($this->db->getConnection())->insertMany("videoHelpIcon",[
          [
            "url"=> $basicUrl."1.png",
            "description"=>"Dośrodkowanie",
          ],
          [
            "url"=> $basicUrl."2.png",
            "description"=>"Nieczyste zagranie",
          ],
          [
            "url"=> $basicUrl."3.png",
            "description"=>"Podanie niskie",
          ],
          [
            "url"=> $basicUrl."4.png",
            "description"=>"Przyjęcie wysokie",
          ],
          [
            "url"=> $basicUrl."5.png",
            "description"=>"Przyjęcie",
          ],
          [
            "url"=> $basicUrl."6.png",
            "description"=>"Strzał niski",
          ],
          [
            "url"=> $basicUrl."7.png",
            "description"=>"Strzał głową",
          ],
          [
            "url"=> $basicUrl."8.png",
            "description"=>"Wślizg",
          ],
          [
            "url"=> $basicUrl."9.png",
            "description"=>"Wyrzut z autu",
          ],
        ]);
    }

    
    function uninstall(){
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS videoFragments');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS videoAnalize');
      ($this->db->getConnection())->executeSql('DROP TABLE IF EXISTS videoHelpIcon');
    }

    function deleteVideoIcon($data){
      $id = $data['id'];
      $this->returnedData['data'] = ($this->db->getConnection())->delete("videoHelpIcon",["id"=>$id]);
      return $this->returnedData;
    }

    function saveVideoIcon($data){
      $id = $data['id'];
      $value = $data['value'];
      $this->returnedData['data'] = ($this->db->getConnection())->update("videoHelpIcon",["id"=>$id],["description"=>$value]);
      return $this->returnedData;
    }

    function addVideoIcon($data){
      if( isset($_FILES["iconFile"]) ){
          $ext = pathinfo($_FILES["iconFile"]["name"],PATHINFO_EXTENSION);
          $fileName = "icon_".(bin2hex(random_bytes(10))).".".$ext;
          move_uploaded_file($_FILES["iconFile"]["tmp_name"], "../modules/VideoAnalizer/assets/media/icons/".$fileName);
          $url = "./modules/VideoAnalizer/assets/media/icons/".$fileName;
          $this->returnedData['data'] = ($this->db->getConnection())->insert("videoHelpIcon",[
            "url"=>$url,
            "description"=>"",
            ]);
      }else{
        $this->returnedData["success"] = false;
        $this->returnedData["error"] = "Brak pliku, problem z przesłaniem";
      }
      return $this->returnedData;
    }

    function getVideoIcon(){
      $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM videoHelpIcon ORDER BY CHAR_LENGTH(description)");
      return $this->returnedData;
    }

    function getVideoIconFull(){
      $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM videoHelpIcon WHERE CHAR_LENGTH(description) > 0");
      return $this->returnedData;
    }

    function saveFragments($data){
      $frName = $data['frName'];
      $frDescription = $data['frDescription'];
      $frList = $data['frList'];
      $usid = $data['usid'];
      $videoName = str_replace("%20","_",str_replace(" ","_",$data['videoName']));
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

      $fragmentsList = [];
       
      foreach($frList as $fragments){
        $name = $fragments["name"];
        foreach($fragments["list"] as $oneFragment){
          
          $start = (int)round(((float)$oneFragment["start"])*100);
          $sh =  (int)( (int)($start / 60)/ 60);
          $sm =  (int)($start / 60) - $sh*60;
          $ss = (int)((($start - $sh*60*60)) - $sm*60);
          $sh = $sh < 10 ? "0".$sh : $sh;
          $sm = $sm < 10 ? "0".$sm : $sm;
          $ss = $ss < 10 ? "0".$ss : $ss;
          $start = $sh.":".$sm.":".$ss;

          $duration = ((int)round(((float)$oneFragment["end"])*100)) - ((int)round(((float)$oneFragment["start"])*100));
          $dh = (int)( (int)($duration / 60)/ 60);
          $dm = (int)($duration / 60) - $dh*60;
          $ds = (int)((($duration - $dh*60*60)) - $dm*60);
          $dh = $dh < 10 ? "0".$dh : $dh;
          $dm = $dm < 10 ? "0".$dm : $dm;
          $ds = $ds < 10 ? "0".$ds : $ds;
          $duration = $dh.":".$dm.":".$ds;

          $fragmentName = str_replace(" ","_", $name)."_".str_replace(".","_", $start)."_".str_replace(".","_", $duration).".mp4";
          $fragmentUrl = $analizeDir.$fragmentName;
          $execReturn = exec("ffmpeg -ss ".$start." -i ".$pathToFile.$fileName." -t ".$duration." -c copy ".$fragmentUrl);

          array_push($fragmentsList,[
            "fragmentMain"=>$pathToFile.$fileName,
            "fragmentUrl"=>$fragmentUrl,
            "execReturn"=>$execReturn,
            "start"=>$start,
            "duration"=>$duration,
          ]);
          
          ($this->db->getConnection())->insert("videoFragments", [
              "id_analize" => $analizeId,
              "name" => $name,
              "start_time" => round(((float)$oneFragment["start"])*100,1),
              "end_time" => round(((float)$oneFragment["end"])*100,1),
              "url" => str_replace("../","./", $fragmentUrl)
          ]);
        }
      }

      $this->returnedData['data'] = [
        "fragments" => $fragmentsList,
        "filePath" => $pathToFile.$fileName
      ];

      // unlink($pathToFile.$fileName);

      return $this->returnedData;
    }

    function getAnalizeList(){
      $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT videoAnalize.*, user_data.firstname, user_data.lastname FROM videoAnalize, user_data WHERE user_data.user_id = videoAnalize.id_user ORDER BY videoAnalize.name DESC");
      return $this->returnedData;
    }

    function saveVideoClip($data){
      $fileName = str_replace("%20","_",str_replace(" ","_",explode("=",str_replace("\"","",$_SERVER['HTTP_CONTENT_DISPOSITION']))[1]));
      $tq = str_replace("tq=","",$_SERVER['HTTP_COOKIE']);
      if(!isset($fileName) || strlen($fileName) <= 3 ||!isset($tq) || strlen($tq) <= 3 ){
        $this->returnedData['success'] = false;
        $this->returnedData['error'] = "Brak odpowiednich danych";
      }else{
        $putContent = file_put_contents("../files/videoAnalize/".$tq."_".$fileName, $this->decode_chunked(file_get_contents("php://input")), FILE_APPEND);
        $this->returnedData['data'] = [
          filePath => "File put in: " . "../files/videoAnalize/".$tq."_".$fileName,
          putContentReturn => $putContent
        ];
      }
      return $this->returnedData;
    }

    function deleteAnalize($data){
      $id = $data["id"];
      $name = ($this->db->getConnection())->fetchRowMany("SELECT name FROM videoAnalize WHERE id=".$id)[0]["name"];
      $name = str_replace(" ","_", $name);
      $pathToFile = "../files/videoAnalize/";
      $analizeDirectory = $pathToFile . $name ;
      $this->returnedData['data'] = ($this->db->getConnection())->delete("videoAnalize",["id"=>$id]);
      $this->returnedData['data'] = ($this->db->getConnection())->delete("videoFragments",["id_analize"=>$id]);
      array_map('unlink', glob("$analizeDirectory/*.*"));
      if( file_exists($analizeDirectory) )rmdir($analizeDirectory);
      return $this->returnedData;
    }

    function getAnalizeFragment($data){
      $id = $data["id"];
      $this->returnedData['data'] = ($this->db->getConnection())->fetchRowMany("SELECT * FROM videoFragments WHERE id_analize=".$id);
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