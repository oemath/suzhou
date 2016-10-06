<?php

namespace Oemath\Models;

use Illuminate\Database\Capsule\Manager as DB;

class Problem
{
    static public function table($grade, $category)
    {
        return DB::table('g'. $grade . 'c' . $category);
    }


    static public function select($grade, $category, $pid)
    {
        if ($grade == null || $category == null || $pid == null) {
            return null;
        }
        
        try {
            $problems = DB::select(
                    "select type, level, flag, question, parameter, knowledge, hint, flag
                     from g{$grade}c{$category}
                     where id = {$pid}");
            
            if ($problems) {
                return $problems[0];
            }
        }
        catch ( \Illuminate\Database\QueryException $e) {
        }

        return null;
    }
    
    
    static public function selectProblemIds($grade, $category, $count, $first_id = null)
    {
        if ($count <= 0) {
            return null;
        }
        
        if (null === $first_id) {
            $first_id = 1;
        }
        
        try {
            $problems = DB::select(
                    //"select type, level, question, parameter, knowledge, hint 
                    "select id 
                    from g{$grade}c{$category} 
                     where id >= {$first_id} 
                     order by id asc 
                     limit {$count}");
            if (count($problems) < $count) {
                $count_from_start = $count - count($problems); 
                $problems_from_start = DB::select(
                        //"select type, level, question, parameter, knowledge, hint 
                        "select id 
                        from g{$grade}c{$category}
                        order by id asc
                        limit {$count_from_start}");
                
                if (count($problems_from_start) > 0) {
                    while (count($problems) < $count) {
                        $problems = array_merge($problems, $problems_from_start);
                    }
                    
                    $problems = array_slice($problems, 0, $count);
                }
            }

            return array_map(function($a) { return $a->id; }, $problems);
        }
        catch ( \Illuminate\Database\QueryException $e) {
        	return null;
        }        
    }
    
    static public function selectAllProblemIds($grade, $category)
    {
        try {
            $problems = DB::select(
                    //"select type, level, question, parameter, knowledge, hint 
                    "select id 
                    from g{$grade}c{$category} 
                     order by id asc");

            return array_map(function($a) { return $a->id; }, $problems);
        }
        catch ( \Illuminate\Database\QueryException $e) {
            return null;
        }     
    }
}