<?php

namespace Oemath\User;

use Illuminate\Database\Eloquent\Model as Eloquent;

class User extends Eloquent 
{
    protected $table = 'users';
    
    private static $MembershipBits = 0x01;
    private static $AdminBit = 0x80;
    
    
    protected $fillable = [
        'email',
        'username',
        'realname',
        'password',
        'salt',
    	// last 1 bits: 0: non-membership; 1: membership
    	// bit 7: 80: admin; 00: others
    	'flag',
    	'membership', // membership valid until date
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
    
    public function isAdmin()
    {
        return (bool) ($this->flag & self::$AdminBit);
    }

    public function isMembership()
    {
    	return (bool) (($this->flag & self::$MembershipBits) == 1);
    }
    
    public function membershipValid()
    {
    	return (bool) (($this->isMembership()) && (date('Y-m-d') <= $this->membership));
    }
    
    public function membershipExpirationDate()
    {
    	return $this->membership;
    }
}

