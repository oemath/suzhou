<?php

namespace Oemath\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
//use Illuminate\Database\Capsule\Manager as DB;

class Category extends Eloquent 
{
    protected $table = 'category';
    
    protected $fillable = [
        'cid',
        'grade',
        'title',
        'description'
    ];

/*    static public function select($grade, $cid)
    {
        if ($grade == null || $cid == null) {
            return null;
        }
        
        try {
            $category = DB::select(
                    "select title, description
            		from ". self::$table ."
                     where grade = {$grade} and cid = {$cid}");
            
            if ($category) {
                return $category[0];
            }
        }
        catch ( \Illuminate\Database\QueryException $e) {
        }

        return null;
    }*/
}

