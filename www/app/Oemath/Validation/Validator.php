<?php

namespace Oemath\Validation;

use Violin\Violin;

use Oemath\Helpers\Hash;

use Oemath\User\User;

class Validator extends Violin 
{
    protected $user;
    
    protected $hash;
    
    protected $auth;
    
    public function __construct(User $user, Hash $hash, $auth = null) {
        $this->user = $user;
        $this->hash = $hash;
        $this->auth = $auth;
        
        $this->addFieldMessages([
                'email' => [
                        'uniqueEmail' => 'That email is already in use.'
                ],
                'username' => [
                        'uniqueUsername' => 'That username is already taken.'
                ],
        ]);
        
        $this->addRuleMessages([
                'matchesCurrentPassword' => 'That does not match your current password'
        ]);
    }
    
    public function validate_uniqueEmail($value, $input, $args) {
        if ($this->auth && $this->auth->email === $value) {
            return true;
        }
        return $this->user->where('email', $value)->count() == 0;
    }
    
    public function validate_uniqueUsername($value, $input, $args) {
        return $this->user->where('username', $value)->count() == 0;
    }
    
    public function validate_matchesCurrentPassword($value, $input, $args) {
        if ($this->auth && $this->hash->passwordCheck($value, $this->auth->password)) {
            return true;
        }
        
        return false;
    }
}
