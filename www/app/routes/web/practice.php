<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;
use Oemath\Models\Category;

require_once INC_ROOT . '/app/helpers/helper.php';

$app->get('/practice', function() use ($app) {
    
    $request = $app->request;
    
    $grade = $request->get("grade");
    $cid = $request->get("cid");
//    $title = htmlspecialchars_decode($request->get("title"));

    if (!$grade || !$cid/* || !$title*/) {
    	$app->log->error('/practice?g='.$grade.'&c='.$cid);
    	echo 'Invalid request';
        return;
    }

    $category = $app->category->where([['grade','=',$grade],['cid','=',$cid]])->first();//Category::select($grade, $cid);
    if (!$category) {
    	$app->log->error('/practice?g='.$grade.'&c='.$cid.' invalid_cid');
    	echo 'Invalid category in practice: grade='.$grade.'cid='.$cid;
    	return;
    }
    $title = $category->title;
    
    $app->log->info('/practice?g='.$grade.'&c='.$cid);
    
    $session_token = $app->randomlib->generateString(32);
	$problem_ids = initProblemIds($app, $grade, $cid);
    $_SESSION[$session_token]['index'] = 0;
    $_SESSION[$session_token]['practice_problem_ids'] = $problem_ids;
    
    $userType = 0; // guest
    if ($app->auth) {
    	if (!$app->auth->isMembership()) {
    		$userType = 1; // not a membership
    	}
    	else if (!$app->auth->membershipValid()) {
    		$userType = 2; // membership not valid or expired
    	}
    	else {
    		$userType = 3; // a valid membership
    	}
    }

    $app->render('web/practice.php', [
            'grade' => $grade,
            'cid' => $cid,
            'title' => $title,
            'token' =>  $session_token,
            'count' => count($problem_ids),
    		'userType' => $userType,
            'practice_css' => true
    ]);
})->name('practice');
