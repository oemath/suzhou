<?php

$app->get('/move', function() use ($app) {
    $app->render('move.php');    
});
