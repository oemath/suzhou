<?php

$app->get('/membership', function() use ($app) {
    $app->render('membership.php');    
})->name('membership');
