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
        return;// $app->render('web/practice.php');
    }

    $category = $app->category->where([['grade','=',$grade],['cid','=',$cid]])->first();//Category::select($grade, $cid);
    if (!$category) {
    	$app->log->error('/practice?g='.$grade.'&c='.$cid.' invalid_cid');
    	echo 'Invalid category in practice: grade='.$grade.'cid='.$cid;
    	return;// $app->render('web/practice.php');
    }
    $title = $category->title;
    
    $app->log->info('/practice?g='.$grade.'&c='.$cid);
    
    $session_token = $app->randomlib->generateString(32);
	$problem_ids = initProblemIds($app, $grade, $cid);
    $_SESSION[$session_token]['index'] = 0;
    $_SESSION[$session_token]['practice_problem_ids'] = $problem_ids;
    
    $app->render('web/practice.php', [
            'grade' => $grade,
            'cid' => $cid,
            'title' => $title,
            'token' =>  $session_token,
            'count' => count($problem_ids),
            'practice_css' => true
    ]);
})->name('practice');
