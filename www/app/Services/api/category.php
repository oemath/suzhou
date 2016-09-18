<?php

use Oemath\Models\Category;

require_once 'helper.php';

$app->get('/api/category', function() use ($app) {

    $grade = $_REQUEST['grade'];
    $cid = $_REQUEST['cid'];

    if ($grade == null || $cid == null) {    
        echo fail('Invalid request');
        return;
    }
    
    if ($app->auth) {
        //
    }

    $category = Category::select($grade, $cid);
    
    echo $category ? ok($category) : fail('No such category: grade='.$grade.',cid='.$cid);
});
