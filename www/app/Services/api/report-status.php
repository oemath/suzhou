<?php

use Oemath\Models\Progress;

require_once 'helper.php';

$app->post('/api/report-status', function() use ($app) {
    
    $request = $app->request;
    
    $problem_ids = getProblemIds();
    if (!$problem_ids) {
        echo fail('Session timeout');
        return;
    }
    
    $grade = $_REQUEST["grade"];
    $category = $_REQUEST["category"];
    $status = $_REQUEST["status"];
    
    if (!$grade || !$category || !$status) {
        echo 'Invalid request';
        return;
    }

    if ($app->auth) {
        $status_array = explode(',', $status);
        $length = count($status_array);
        if ($length == count($problem_ids)) {
            $failures = array();
            $max_pid = 0;
            for ($i=0; $i < $length; $i++) {
                if ($status_array[$i] != 0) {
                    array_push($failures, $problem_ids[$i]);
                }
                $max_pid = max($max_pid, $problem_ids[$i]);
            }
            Progress::update($app->auth->id, $grade, $category, $max_pid + 1, join($failures, ','));
        }
    }
});
