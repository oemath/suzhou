<?php

$app->get('/account/profile', $authenticated(), function() use ($app) {
    $app->render('account/profile.php');
})->name('account.profile');

$app->post('/account/profile', $authenticated(), function() use ($app) {
    
    $request = $app->request;
    
    $email = $request->post('email');
    $name = $request->post('name');
    
    $v = $app->validation;
    
    $v->validate([
            'email' => [$email, 'required|email|uniqueEmail'],
            'name'=> [$name, 'alpha|max(50)']
    ]);
    
    if ($v->passes()) {
        $app->auth->update([
                'email' => $email,
                'realname' => $name
        ]);
        
        $app->flash('global', 'Your profile has been updated');
        return $app->response->redirect($app->urlFor('account.profile'));
    }

    $app->render('account/profile.php', [
            'errors' => $v->errors(),
            'request' => $request
    ]);
    
})->name('account.profile.post');

