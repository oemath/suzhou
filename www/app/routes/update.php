<?php

$app->get('/update', function() use ($app) {
    $app->render('update.php');    
});
