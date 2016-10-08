<?php

//require_once INC_ROOT . '/app/helpers/helper.php';

$app->get('/', function() use ($app) {
	$app->log->info('home');

	/*if ($app->auth) {
		echo 'status:'.$app->auth->membershipStatus()."<br>";
		echo 'exp   :'.$app->auth->membershipExpirationDate()."<br>";
		echo 'membership:'.($app->auth->membershipValid()?' valid':' NOT valid').'<br>';
	}
	else {
		echo 'not login';
	}*/
	
    $app->render('home.php', [
    		'current_page' => 'home'
    ]);    
})->name('home');
