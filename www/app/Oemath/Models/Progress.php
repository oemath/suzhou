<?php

namespace Oemath\Models;

use Illuminate\Database\Capsule\Manager as DB;

class Progress
{
    static protected $table = 'progress';

    static public function update($uid, $grade, $category, $start, $failure)
    {
        $exist = DB::select(
                "select uid 
                 from ". self::$table ." 
                 where uid = {$uid} and grade={$grade} and category={$category}");
        
        if ($exist) {
            DB::update("update ". self::$table ." set 
                        start = {$start},
                        failure = '{$failure}'
                        where uid = {$uid} and grade={$grade} and category={$category}");
            return 'update';
        }
        else {
            DB::insert("insert into {self::$table} (uid, grade, category, start, failure) values (?, ?, ?, ?, ?)", 
            [$uid, $grade, $category, $start, $failure]);
            return 'insert';
        }
    }
    
    static public function select($uid, $grade, $category)
    {
        $progresses = DB::select(
                "select start, failure 
                 from ". self::$table ." 
                 where uid = {$uid} and grade={$grade} and category={$category}");
        
        if ($progresses) {
            $progress = $progresses[0];
            if ($progress->failure && !empty(trim($progress->failure))) {
                $progress->failure = array_map('intval', explode(',', $progress->failure));
            }
            else {
                $progress->failure = null;
            }
            return $progress;
        }
        else {
            return null;
        }
    }
}
