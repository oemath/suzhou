<?php

use Models\Category;

$app->get('/math', function() use ($app) {
    $grade = $_REQUEST['grade'];
    if (!$grade) {
        throw Exception;
    }
    
    $category = $app->category->where('grade', $grade)->get();

    $app->render('web/math.php', [
            'grade' => $grade,
            'category' => $category,
    ]);
})->name('math');