<?php
error_reporting(E_ALL | E_STRICT);

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


$fileName = explode("=",str_replace("\"","",$_SERVER['HTTP_CONTENT_DISPOSITION']))[1];
$o2 = explode("/",explode("-",$_SERVER['HTTP_CONTENT_RANGE'])[1]);
$tq = str_replace("tq=","",$_SERVER['HTTP_COOKIE']);

file_put_contents($tq."_".$fileName, decode_chunked(file_get_contents("php://input")), FILE_APPEND);