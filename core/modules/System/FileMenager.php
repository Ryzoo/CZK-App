<?php
namespace Core\System;

class FileMenager
{
    static public function saveFile($name,$content,$directory){
        $directory = chop(str_replace('\\',"/",trim($directory)),"/");
        $name = str_replace(" ","_",trim($name));
        $path = $directory . "/" . $name;
        $relPath = $path;
        $count = 1;
        while(file_exists($relPath)){
            $relPath = $_SERVER["DOCUMENT_ROOT"] . str_replace($_SERVER["DOCUMENT_ROOT"],"",$directory) ."/". $count . "_" . $name;
            $count++;
        }
        if(!file_put_contents($relPath, $content)) return false;
        return str_replace($_SERVER["DOCUMENT_ROOT"],"",$relPath);
    }

    static public function deleteFile($directory){
        if(isset($directory)) return false;
        $directory = chop(str_replace('\\',"/",trim($directory)),"/");
        if(file_exists($directory)){
           return unlink($directory);
        }
        return false;
    }

}
