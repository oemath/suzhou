<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;

require_once INC_ROOT . '/app/helpers/helper.php';

$app->post('/api/report-status', function() use ($app) {
	if (!$app->auth) return;
	
    //$request = $app->request;
    $grade = $_REQUEST["grade"];
    $cid = $_REQUEST["category"];
    $status = $_REQUEST["status"];
    if (!$grade || !$cid || !$status) {
    	$app->log->error("/api/report-status?g=".$grade."&c=".$cid."&s=".$status." invalid_request");
    	echo 'Invalid request';
    	return;
    }
    
	$index = getSessionVar($app, 'index');
    $problem_ids = getSessionVar($app, 'practice_problem_ids');
    if (null===$index || null===$problem_ids) {
    	$app->log->error("/api/report-status?g=".$grade."&c=".$cid."&s=".$status."&i=".$index." session_timeout");
    	echo fail('Invalid request');
        return;
    }
    
    $status_array = explode(',', $status);
    $failures = array();

    $i = $index;
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

    $start = $index == 0 ? max($problem_ids) + 1 : null;
    
    $fail_str = join(array_keys($failures), ',');
    Progress::update($app->auth->id, $grade, $cid, $start, $fail_str);
   	$app->log->info("/api/report-status?g=".$grade."&c=".$cid."&s=".$start."&f=".$fail_str);
   	echo ok('');
});
