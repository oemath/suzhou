<?php

$app->get('/move', function() use ($app) {
    $app->render('admin/move.php');    
});

$app->get('/classify', function() use ($app) {
    $app->render('admin/classify.php');    
});

$app->get('/update', function() use ($app) {
	$app->render('admin/update.php');
});
	
$app->get('/level', function() use ($app) {
	$app->render('admin/level.php');
});
	
$app->get('/dogfood', function() use ($app) {
	$app->render('admin/dogfood.php');
});
	
	