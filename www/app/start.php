<?php

use Slim\Slim;
use Slim\Views\Twig;
use Slim\Views\TwigExtension;

use Noodlehaus\Config;

use RandomLib\Factory as RandomLib;

use Oemath\User\User;
use Oemath\User\Progress;
use Oemath\Helpers\Hash;
use Oemath\Validation\Validator;
use Oemath\Mail\Mailer;

use Oemath\Middleware\BeforeMiddleware;
use Oemath\Middleware\CsrfMiddleware;

session_cache_limiter();
session_start();

define ('INC_ROOT', dirname(__DIR__));

require INC_ROOT . '/vendor/autoload.php';

$app = new Slim([
    'mode' => file_get_contents(INC_ROOT . "/mode.php"),
    'view' => new Twig(),
    'templates.path' => INC_ROOT . "/app/views"
]);

$app->add(new BeforeMiddleware);
$app->add(new CsrfMiddleware);

$app->configureMode($app->config('mode'), function() use ($app) {
    $app->config = Config::load(INC_ROOT . "/app/config/{$app->mode}.php");
});

require 'database.php';
require 'filters.php';
require 'routes.php';

$app->auth = false;

///////////////////////
$app->container->set('user', function() {
    return new User;
});

$app->container->singleton('progress', function() {
    return new Progress;
});

$app->container->singleton('hash', function() use ($app) {
    return new Hash($app->config);
});

$app->container->singleton('validation', function() use ($app) {
    return new Validator($app->user, $app->hash, $app->auth);    
});
   
$app->container->singleton('mail', function() use ($app) {
    $mailer = new PHPMailer();
    
    $mailer->isSMTP();
    $mailer->Host = $app->config->get('mail.host');
    $mailer->SMTPAuth = $app->config->get('mail.smtp_auth');
    $mailer->SMTPSecure = $app->config->get('mail.smtp_secure');
    $mailer->Port = $app->config->get('mail.port');
    $mailer->Username = $app->config->get('mail.username');
    $mailer->Password = $app->config->get('mail.password');
    $mailer->SetFrom($app->config->get('mail.username'));
    
    $mailer->isHTML($app->config->get('mail.html'));
    
    return new Mailer($app->view, $mailer);
});

$app->container->singleton('randomlib', function() {
    $factory = new RandomLib;
    return $factory->getMediumStrengthGenerator();
});

///////////////////////
    

$view = $app->config('view');

$view->parserOptions = [
    'debug' => $app->config->get('twig.debug')
];

$view->parserExtensions = [
    new TwigExtension
];


#$progress = $app->progress->update(12, 5, 501, 10, '1,2,5,6,8');

#$progress = $app->progress->select(12, 5, 501);



?>
