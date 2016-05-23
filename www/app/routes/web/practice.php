<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;

$app->get('/practice', function() use ($app) {
    
    $PROBLEMS_COUNT = 25;

    $request = $app->request;
    
    $grade = $request->get("grade");
    $category = $request->get("category");
    $title = $request->get("title");

    if (!$grade || !$category || !$title) {
        echo 'Invalid request';
        return;// $app->render('web/practice.php');
    }

    $start = 1;
    $failure = array();
    
    if ($app->auth) {
        $progress = Progress::select($app->auth->id, $grade, $category);
        if ($progress) {
            $start = $progress->start;
            $failure = $progress->failure;
        }
    }
    
    $problem_ids = Problem::selectProblemIds($grade, $category, $PROBLEMS_COUNT - count($failure));
    $problem_ids = !empty($problem_ids) ? $problem_ids : array();
    $problem_ids = array_slice(array_merge($failure, $problem_ids), 0, $PROBLEMS_COUNT);

    $session_token = $app->randomlib->generateString(32);
    $_SESSION[$session_token]['practice_problem_ids'] = $problem_ids;
    
    $app->render('web/practice.php', [
            'grade' => $grade,
            'category' => $category,
            'title' => $title,
            'token' =>  $session_token,
            'count' => $PROBLEMS_COUNT,
    ]);
})->name('practice');
