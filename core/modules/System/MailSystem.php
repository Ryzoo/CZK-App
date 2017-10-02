<?php
namespace Core\System;

class MailSystem
{
    static function sendMail($to, $title, $content){
        $toReturn = [];
        $toReturn['error'] = '';
        $toReturn['success'] = true;
        $template = MailSystem::loadTemplate();
        $template = str_replace("{{title}}",$title,$template);
        $template = str_replace("{{content}}",$content,$template);
        $template = str_replace("{{host_dir}}",'//'.$_SERVER['HTTP_HOST'],$template);
        try{
            $headers = 'MIME-Version: 1.0' . "\r\n" .
            'Content-type: text/html; charset=utf-8' . "\r\n" .
            'From: Club Management Center < cmc.app@centrumklubu.pl >' . "\r\n" .
            "CC: cmc.app@centrumklubu.pl" . "\r\n" .
            "X-Sender: Club Management Center < cmc.app@centrumklubu.pl >" . "\r\n" .
            "MIME-Version: 1.0" . "\r\n";
            'Reply-To: cmc.app@centrumklubu.pl' . "\r\n" .
            "X-Priority: 1" . "\r\n" .
            "Return-Path: cmc.app@centrumklubu.pl" . "\r\n" .
            'X-Mailer: PHP/' . phpversion();
            $success = mail($to, $title, $template, $headers);
            if (!$success) {
                $errorMessage = error_get_last()['message'];
                $toReturn['error']  = $errorMessage;
                $toReturn['success']  = false;
            }
        }catch(Exception $e){
            $toReturn['error']  = 'Nie udało się wysłać meila z hasłem';
            $toReturn['success']  = false;
        }

        return $toReturn;
    }

    static function loadTemplate(){
        return file_get_contents(__DIR__.'/../../../files/email/template.html');
    }
    
}
