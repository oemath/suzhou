<?php

$app->get('/', function() use ($app) {
	$app->log->info('home');

    $app->render('home.php', [
    		'current_page' => 'home'
    ]);    
})->name('home');
