<?php

$app->get('/recover-password', $guest(), function() use ($app) {
    $app->render('auth/password/recover.php');
})->name('password.recover');

$app->post('/recover-password', $guest(), function() use ($app) {
    $request = $app->request;
    
    $email = $request->post('email');
    
    $v = $app->validation;
    
    $v->validate([
            'email' => [$email, 'required|email']
    ]);
    
    if ($v->passes()) {
        $user = $app->user->where('email', $email)->first();
        
        if (!$user) {
            $app->flash('global', 'Could not found that user');
        }
        else {
            $identifier = $app->randomlib->generateString(128);
            
            $user->update([
                    'recover_hash' => $app->hash->hash($identifier)
            ]);
            
            $app->mail->send('email/auth/password/recover.php', ['user'=>$user, 'identifier'=>$identifier], function($message) use ($user) {
                $message->to($user->email);
                $message->subject('Recover your password');
            });
            
            $app->flash('global', 'An email containgin a link to recove password has been sent out.');
        }
        
        return $app->response->redirect($app->urlFor('home'));
    }
    
    $app->render('auth/password/recover.php', [
            'errors' => $v->errors(),
            'request' => $app->request
    ]);
    
})->name('password.recover.post');
