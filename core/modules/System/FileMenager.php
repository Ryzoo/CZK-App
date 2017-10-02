<?php
namespace Core\System;

class FileMenager
{
    static public function saveFile($name,$content,$directory){
        $directory = chop(str_replace('\\',"/",trim($directory)),"/");
        $name = FileMenager::noPolish(str_replace(" ","_",trim($name)));
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

    static public function noPolish($string='') { 
        $polish=chr(234).chr(243).chr(185).chr(156).chr(179).chr(191).chr(159).chr(230).chr(241).chr(202).chr(211).chr(165).chr(140).chr(163).chr(175).chr(143).chr(198).chr(209).chr(177).chr(182).chr(188).chr(161).chr(166).chr(172); 
        $nopolish='eoaslzzcnEOASLZZCNaszASZ'; 
         
        return strtr($string, $polish, $nopolish); 
    } 

}
