<?php

use Oemath\User\UserPermission;

$app->get('/register', $guest(), function() use ($app) {
    $app->render('auth/register.php');    
})->name('register');

$app->post('/register', $guest(), function() use ($app) {
    
    $request = $app->request;
    
    $email = $request->post('email');
    $username = $request->post('username');
    $password = $request->post('password');
    $password_confirm = $request->post('password_confirm');
    
    $v = $app->validation;
    $v->validate([
            'email' => [ $email, 'required|email|uniqueEmail' ],
            'username' => [ $username, 'required|max(20)|uniqueUsername' ],
            'password' => [$password, 'required|min(6)'],
            'password_confirm' => [$password_confirm, 'required|matches(password)']
    ]);
    
    if ($v->passes()) {
        $identifier = $app->randomlib->generateString(128);
        
        $user = $app->user->create([
                'email' => $email,
                'username' => $username,
                'password' => $app->hash->password($password),
                'salt' => 'default_salt',
                'active' => false,
                'active_hash' => $app->hash->hash($identifier),
        ]);
        
        $user->permissions()->create(UserPermission::$defaults);
        
        $app->mail->send('email/auth/register.php', [
                        'user' => $user,
                        'identifier' => $identifier,
                ], function($message) use($user) {
            $message->to($user->email);
            $message->subject('Thanks for registering.');
        });
        
        return $app->response->redirect($app->urlFor('home'));
    }
    
    $app->render('auth/register.php', [
            'errors' => $v->errors(),
            'request' => $request,
    ]);
    
})->name('register.post');

