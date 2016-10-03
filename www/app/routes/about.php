<?php

$app->get('/about', function() use ($app) {
    $app->render('about.php');    
})->name('about');
