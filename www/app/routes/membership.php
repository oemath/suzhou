<?php

require_once INC_ROOT . '/app/helpers/helper.php';

$app->get('/membership', function() use ($app) {
    $app->render('membership.php');    
})->name('membership');

$app->post('/membership', function() use ($app) {
	if($app->auth && $app->auth->membership) {
		$app->auth->update([
				'membership' => nextExpirationMonth($app->auth->membership)
		]);
	}
	
	return $app->response->redirect($app->urlFor('home'));
})->name('membership.post');
