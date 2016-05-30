<?php

use Oemath\Models\Problem;

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


$app->get('/api/problem', function() use ($app) {

    $request = $app->request;

    $token = $request->get('token');
    if ($token == null) {
        echo fail('Session timeout');
        return;
    }

    $problem_ids = $_SESSION[$token]['practice_problem_ids'];
    if ($problem_ids == null) {
        echo fail('Session timeout');
        return;
    }
    
    $grade = $request->get('grade');
    $category = $request->get('category');
    $index = $request->get('index');

    if ($grade == null || $category == null || $index == null ||
        $index < 0 || $index >= count($problem_ids)) {    
        echo fail('Invalid request');
        return;
    }
    
    $pid = $problem_ids[$index];

    if ($app->auth) {
        //
    }

    $problem = Problem::select($grade, $category, $pid);
    
    echo $problem ? ok($problem) : fail('Select nothing: '.$pid);
});
