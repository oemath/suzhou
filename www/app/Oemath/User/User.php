<?php

namespace Oemath\User;

use Illuminate\Database\Eloquent\Model as Eloquent;

class User extends Eloquent 
{
    protected $table = 'users';
    
    protected $fillable = [
        'email',
        'username',
        'realname',
        'password',
        'salt',
        'active',
        'active_hash',
        'remember_identifier',
        'remember_token',
        'recover_hash'
    ];
    
    public function getUsername()
    {
        return $this->username;
    }
    
    public function getRealnameOrUsername()
    {
        if ($this->realname) {
            return $this->realname;
        }
        else {
            return $this->username;
        }
    }
    
    public function activateAccount()
    {
        $this->update([
                'active' => true,
                'active_hash' => null
        ]);
    }
    
    public function updateRememberCredentials($identifier, $token)
    {
        $this->update([
                'remember_identifier' => $identifier,
                'remember_token' => $token
        ]);
    }
    
    public function removeRememberCredentials()
    {
        $this->updateRememberCredentials(null, null);
    }
    
    public function hasPermission($permission)
    {
        return (bool) $this->permissions->{$permission};
    }
    
    public function isAdmin()
    {
        return $this->hasPermission('is_admin');
    }
    
    public function permissions()
    {
        return $this->hasOne('Oemath\User\UserPermission', 'user_id');
    }
}

