<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;
use Oemath\Models\Category;

$app->get('/practice', function() use ($app) {
    
    $PROBLEMS_COUNT = 20;

    $request = $app->request;
    
    $grade = $request->get("grade");
    $cid = $request->get("cid");
//    $title = htmlspecialchars_decode($request->get("title"));

    if (!$grade || !$cid/* || !$title*/) {
        echo 'Invalid request';
        return;// $app->render('web/practice.php');
    }

    $category = $app->category->where([['grade','=',$grade],['cid','=',$cid]])->first();//Category::select($grade, $cid);
    if (!$category) {
    	echo 'Invalid category in practice: grade='.$grade.'cid='.$cid;
    	return;// $app->render('web/practice.php');
    }
    $title = $category->title;
    
    $start = 1;
    $failure = array();
    
    if ($app->auth) {
        $progress = Progress::select($app->auth->id, $grade, $cid);
        if ($progress) {
            $start = $progress->start;
            $failure = $progress->failure;
        }
    }
    
    $problem_ids = Problem::selectProblemIds($grade, $cid, $PROBLEMS_COUNT - count($failure));
    $problem_ids = !empty($problem_ids) ? $problem_ids : array();
    $problem_ids = array_slice(array_merge($failure, $problem_ids), 0, $PROBLEMS_COUNT);

    $session_token = $app->randomlib->generateString(32);
    $_SESSION[$session_token]['practice_problem_ids'] = $problem_ids;
    $app->render('web/practice.php', [
            'grade' => $grade,
            'cid' => $cid,
            'title' => $title,
            'token' =>  $session_token,
            'count' => $PROBLEMS_COUNT,
            'practice_css' => true
    ]);
})->name('practice');
