<?php

use Oemath\Models\Problem;
use Oemath\Models\OeLogger;

require_once INC_ROOT . '/app/helpers/helper.php';

$app->post('/api/problem', function() use ($app) {

    $grade = $_REQUEST['grade'];
    $cid = $_REQUEST['category'];
    $index = $_REQUEST['index'];
    
//    usleep(6000000);
    
    if ($grade == null || $cid == null || $index == null || $index < 0) {
    	$app->log->error("/api/problem?g=".$grade."&c=".$cid."&i=".$index);
    	echo fail('Invalid request');
    	return;
    }
    
    $app->log->info("/api/problem?g=".$grade."&c=".$cid."&i=".$index);
    $problem_ids = getProblemIds($app, $grade, $cid);
    if (null === $problem_ids) {
    	$app->log->info("##api/problem".$app->token);
    	setSessionVar($app, 'index', $index);
    	$problem_ids = initProblemIds($app, $grade, $cid);
    }
    
    if (null === $problem_ids) {
    	$app->log->error("/api/problem?g=".$grade."&c=".$cid."&i=".$index.' empty_problem_pids');
    	echo fail('Internal error');
        return;
    }

    if ($index >= count($problem_ids)) {    
    	$app->log->error("/api/problem?g=".$grade."&c=".$cid."&i=".$index.' invalid_index');
    	echo fail('Invalid request');
        return;
    }
    
    if ($app->auth) {
        //
    }

    $pid = $problem_ids[$index];
	$problem = Problem::select($grade, $cid, $pid);
	
	if (null === $problem) {
		for ($i=0; $i<count($problem); $i++) {
			$pid = $problem_ids[$i];
			$problem = Problem::select($grade, $cid, $pid);
			if ($problem) {
    			$app->log->warn("/api/problem?g=".$grade."&c=".$cid."&i=".$index.'('.$i.') pid='.$pid);
    			$problem_ids[$index] = $pid; // replace the pid.
				break;
			}
		}
	}

	if (null === $problem) {
		// if still cannot find a valid pid, the failure history must be wrong, 
		// clean it up and retrieve pid list again.
		cleanupFailure($app, $grade, $cid);
		initProblemIds($app, $grade, $cid);
		$pid = $problem_ids[$index]; // $index must be 0
		$problem = Problem::select($grade, $cid, $pid);
	}
	
    if ($problem) {
    	echo ok($problem);
    }
    else {
    	$app->log->error("/api/problem?g=".$grade."&c=".$cid."&i=".$index.' pid='.$pid);
    	echo fail('Select nothing: '.$pid);
    }
});
