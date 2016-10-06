<?php

use Oemath\Models\Category;
use Oemath\Models\Problem;
use Illuminate\Database\Capsule\Manager as DB;

require_once INC_ROOT . '/app/helpers/helper.php';

$app->get('/insert/category', function() use ($app) {
    $json = array();
    
    $grade = $_REQUEST['grade'];
    if (!$grade) {
        echo fail("Invalid request");
    }
    else {
        $category = $app->category->where('grade', $grade)->get();
        echo ok($category);
    }
});


$app->get('/insert/pids', function() use ($app) {
    $json = array();

    $grade = $_REQUEST['grade'];
    $category = $_REQUEST['category'];
    if (!$grade || !$category) {
        echo fail("Invalid request: grade=".$grade."; category=".$category);
    }
    else {
        $problem_ids = Problem::selectAllProblemIds($grade, $category);
        echo ok($problem_ids);
    }
});
    
    
$app->get('/insert/getproblem', function() use ($app) {
    $grade = $_REQUEST["grade"];
    $category = $_REQUEST["category"];
    $pid = $_REQUEST["pid"];
    if (isset($_REQUEST["action"])) $action = $_REQUEST["action"]; else $action = "get";
    
    if ($action == "prev") {
        $query = "pid<". $pid . " order by pid desc limit 1";
    }
    else if ($action == "next") {
        $query = "pid>". $pid . " order by pid limit 1";
    }
    else { // "curr"
        $query = "pid>=". $pid . " order by pid limit 1";
    }
    
    $result = Problem::select($grade, $category, $pid);
    
    if ($result != null && count($result) > 0) {
        $problem = $result;
        $problem->question = unescape_sql_string($problem->question);
        $problem->parameter = unescape_sql_string($problem->parameter);
        $problem->hint = unescape_sql_string($problem->hint);
    }
    else {
        $problem = null;
    }
    
    $json = array();
    
    if ($problem) {
        echo ok($problem); 
    }
    else {
        echo fail("Not found: grade=".$grade."; category=".$category."; pid=".pid);
    }
});

function escape_sql_string($query)
{
  //  return str_replace("'", "''", str_replace("\\", "\\\\", $query));
  return $query;
}
    
function unescape_sql_string($query)
{
//    return str_replace("''", "'", str_replace("\\\\", "\\", $query));
  return $query;
}
    
$app->post('/insert/save', function() use ($app) {
    $grade = $_REQUEST["grade"];
	$category = $_REQUEST["category"];
    $table = 'g'.$grade.'c'.$category;
	
    $pid = $_REQUEST["pid"];
	$type = $_REQUEST["type"];
	$level = $_REQUEST["level"];
	$flag = $_REQUEST["flag"];
	$question = escape_sql_string($_REQUEST["question"]);
	$parameter = escape_sql_string($_REQUEST["parameter"]);
	$hint = escape_sql_string($_REQUEST["hint"]);
    
	$problem = DB::select('select id from '.$table.' where id = '.$pid);
    if ($problem) {
        DB::table($table)->where('id', $pid)->update([
                'type' => $type,
                'level' => $level,
                'flag' => $flag,
                'question' => $question,
                'parameter' => $parameter,
                'hint' => $hint
        ]);
    }
    else {
        DB::table($table)->insert([[
                'id' => $pid,
                'type' => $type,
                'level' => $level,
                'question' => $question,
                'parameter' => $parameter,
                'knowledge' => null,
                'hint' => $hint,
                'flag' => $flag
        ]]);
    }
    
    echo ok("saved");
});