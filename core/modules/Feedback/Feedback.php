<?php
namespace Core\Feedback;

use Core\System\BasicModule;
use Core\System\MailSystem;

class Feedback extends BasicModule {
    function install(){
    }

    function uninstall(){
    }

    function sendFeedback($data){
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];
        $tmid = $data['tmid'];
        $content = $data['content'];
        $type = $data['type'];

        $author = $firstname . ' ' . $lastname;

        $data = [
            'author' => $author,
            'content' => $content,
            'type' => $type
        ];

        $this->returnedData['data'] = ($this->db->getConnection())->insert('feedback', $data);

        $title = $type == 'opinia' ? 'Nowa opinia o platformie' : 'Nowe zgloszenie błędu';
        $sendType = $type == 'opinia' ? 'opinię.' : 'zgłoszenie o błędzie.';

        MailSystem::sendMail("cmc.app@centrumklubu.pl",$title,
        "<p style='color:#ffffff'>Użytkownik!<b> ".$firstname." ".$lastname."</b></p>
        <p style='color:#ffffff'>Właśnie wysłał ".$sendType."</p>
        <p style='color:#ffffff'><b>Strona:</b> ".$_SERVER['HTTP_HOST']."</p>
        <p style='color:#ffffff'><b>Id sekcji:</b> ".$tmid."</p>
        <p style='color:#ffffff'><b>Zawartość wiadomości:</b> ".$content."</p>");

        return $this->returnedData;
    }

}
