<?php

use Oemath\Models\Category;

require_once INC_ROOT . '/app/helpers/helper.php';

$app->get('/api/category', function() use ($app) {

    $grade = $_REQUEST['grade'];
    $cid = $_REQUEST['cid'];
    
    if ($grade == null || $cid == null) {
    	$app->log->info("/api/category?g=".$grade."&c=".$cid);
    	echo fail('Invalid request');
        return;
    }
    
    if ($app->auth) {
        //
    }

    $category = Category::select($grade, $cid);

    if ($category) {
    	$app->log->info("/api/category?g=".$grade."&c=".$cid);
    	echo ok($category);
    }
    else {
    	$app->log->error("/api/category?g=".$grade."&c=".$cid);
    	echo fail('No such category: grade='.$grade.',cid='.$cid);
    }
});
