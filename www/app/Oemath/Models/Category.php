<?php

namespace Oemath\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Category extends Eloquent 
{
    protected $table = 'category';
    
    protected $fillable = [
        'cid',
        'grade',
        'title',
        'description'
    ];
}

