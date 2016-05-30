<?php

function getProblemIds()
{
    $token = $_REQUEST['token'];
    if ($token == null) {
        return null;
    }
    
    return $_SESSION[$token]['practice_problem_ids'];
}

function ok($result)
{
    $response = [
            'status' => 'OK',
            'result' => $result
    ];
    return json_encode($response);
}

function fail($info)
{
    $response = [
            'status' => 'FAIL',
            'result' => $info
    ];
    return json_encode($response);
}


