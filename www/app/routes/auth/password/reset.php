<?php

$app->get('/password-reset', $guest(), function() use ($app) {
    $request = $app->request;
    
    $email = $request->get('email');
    $identifier = $request->get('identifier');
    
    $hashedIdentifier = $app->hash->hash($identifier);
    
    $user = $app->user->where('email', $email)->first();
    if (!$user || 
    	!$user->recover_hash ||
    	!$app->hash->hashCheck($user->recover_hash, $hashedIdentifier)) {
    	$app->flash('global', 'The link to reset password is invalid or expired');
    	return $app->response->redirect($app->urlFor('home'));
    }
        
    $app->render('auth/password/reset.php', [
            'email' => $user->email,
            'identifier' => $identifier
    ]);
})->name('password.reset');


$app->post('/password-reset', $guest(), function() use ($app) {
    $request = $app->request;
    
    $email = $request->get('email');
    $identifier = $request->get('identifier');
    
    $hashedIdentifier = $app->hash->hash($identifier);
    
    $user = $app->user->where('email', $email)->first();
    if (!$user) {
    	$app->flash('global', 'The link to reset password is invalid or expired');
    	return $app->response->redirect($app->urlFor('home'));
    }
    
    if (!$user->recover_hash) {
    	$app->flash('global', 'The link to reset password is invalid or expired');
    	return $app->response->redirect($app->urlFor('home'));
    }
    
    if (!$app->hash->hashCheck($user->recover_hash, $hashedIdentifier)) {
    	$app->flash('global', 'The link to reset password is invalid or expired');
    	return $app->response->redirect($app->urlFor('home'));
    }

    $password = $request->post('password');
    $password_confirm = $request->post('password_confirm');
    
    $v = $app->validation;
    
    $v->validate([
            'password' => [$password, 'required|min(6)'],
            'password_confirm' => [$password_confirm, 'required|matches(password)']
    ]);
    
    if ($v->passes()) {
    	$salt = $app->randomlib->generateString(32);
        $user->update([
                'password' => $app->hash->password($password.'+'.$salt),
        		'salt' => $salt,
                'recover_hash' => null
        ]);
        
        $app->flash('global', 'Password has been reset');
        return $app->response->redirect($app->urlFor('home'));
    }
    
    $app->render('auth/password/reset.php', [
            'email' => $email,
            'identifier' => $identifier,
    		'errors' => $v->errors()
    ]);
    
})->name('password.reset.post');

