<?php
namespace Modules\Raports;

use Core\System\BasicModule;

class Raports extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function addRaport( $data ){
        $usid = $data["usid"];
        $tmid = $data["tmid"];
        $name = $data["name"];
        $toReturn = null;
        $success = true;
        $error = "";
        $filePath = null;

        $ext = pathinfo($_FILES["raportFile"]["name"],PATHINFO_EXTENSION);
        $target_dir = __DIR__ . "/../../";
        $file_name = 'files/users/' . $data["usid"].$data["tmid"].str_replace(' ','_',$data["name"] ). "." . $ext;
        $target_file = $target_dir . $file_name;
        if(!move_uploaded_file($_FILES["raportFile"]["tmp_name"], $target_file)){
            $success = false;
            $error = "Nie udało się skopiowac: " . $_FILES["raportFile"]['name'];
        }else{
            $filePath = $file_name;
        }

        if( $filePath == null ) {
            $error = "Błąd podczas przesyłania pliku";
            $success = false;
        }else{
            $data = [
                'id_user'   => $usid,
                'id_team'   => $tmid,
                'name' => $name,
                'file_path' => $filePath
            ];
            $toReturn = ($this->db->getConnection())->insert('raports', $data);
        }
     
        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function getRaport( $data ){
        $toReturn = null;
        $success = true;
        $error = "";
        $tmid = $data["tmid"];
        $usid = $data["usid"];

        $toReturn = ($this->db->getConnection())->fetchRowMany('SELECT id,name,file_path FROM raports WHERE id_user='.$usid.' AND id_team='.$tmid);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

    function deleteRaport($data){
        $toReturn = null;
        $success = true;
        $error = "";
        $id = $data["id"];

        $toReturn = ($this->db->getConnection())->delete('raports', ['id' => $id]);

        return array( "error"=>$error ,"success"=>$success,"data"=>$toReturn );
    }

}