<?php

use Oemath\Models\Problem;

require_once 'helper.php';

$app->post('/api/problem', function() use ($app) {

    $problem_ids = getProblemIds();
    if (!$problem_ids) {
        echo fail('Session timeout');
        return;
    }

    $grade = $_REQUEST['grade'];
    $category = $_REQUEST['category'];
    $index = $_REQUEST['index'];

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
