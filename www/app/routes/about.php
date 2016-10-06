<?php

$app->get('/about', function() use ($app) {
	var_dump($_SERVER['REMOTE_ADDR']);
    $app->render('about.php');    
})->name('about');
