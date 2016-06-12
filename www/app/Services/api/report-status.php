<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;

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
        $failures = array();

        $i = 0;
        $length = count($status_array);
        for (; $i < $length; $i++) {
            if ($status_array[$i] != 0) {
                $failures[$problem_ids[$i]] = 1;
            }
        }
        $length = count($problem_ids);
        for (; $i < $length; $i++) {
            $failures[$problem_ids[$i]] = 1;
        }
        Progress::update($app->auth->id, $grade, $category, max($problem_ids) + 1, join(array_keys($failures), ','));
    }
});
