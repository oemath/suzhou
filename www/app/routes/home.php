<?php

$app->get('/', function() use ($app) {
    $app->render('home.php', [
    		'current_page' => 'home'
    ]);    
})->name('home');
