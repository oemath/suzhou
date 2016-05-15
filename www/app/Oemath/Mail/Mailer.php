<?php

namespace Oemath\Mail;

class Mailer
{
    protected $mailer;
    
    protected $view;
    
    public function __construct($view, $mailer)
    {
        $this->view = $view;
        $this->mailer = $mailer;
    }
    
    public function send($template, $data, $callback)
    {
        $message = new Message($this->mailer);
        
        $this->view->appendData($data);
        
        $message->body($this->view->render($template));
        
        call_user_func($callback, $message);
        
        $message->send();
    }
}
