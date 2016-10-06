<?php

use Models\Category;

$app->get('/math', function() use ($app) {
    $grade = $_REQUEST['grade'];
    if (!$grade) {
    	$app->log->error('/math?g='.$grade);
        throw Exception;
    }
    $app->log->info('/math?g='.$grade);
    
    $category = $app->category->where('grade', $grade)->get();

    $app->render('web/math.php', [
            'grade' => $grade,
            'category' => $category,
    ]);
})->name('math');