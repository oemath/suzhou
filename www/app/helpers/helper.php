<?php

use Oemath\Models\Progress;
use Oemath\Models\Problem;

function getProblemCount($user)
{
	if (null === $user || !$user) return 5;
	if ($user->membershipValid()) return 20;
	return 10;
}

function setSessionVar($app, $key, $value)
{
	$token = $_REQUEST['token'];
	if ($token == null) {
		$app->log->error('setSessionVar-no_session_token?k='.$key.'&v='.$value);
		return;
	}
	$_SESSION[$token][$key] = $value;
}


function getSessionVar($app, $key)
{
	$token = $_REQUEST['token'];
	if ($token == null) {
		$app->log->error('getSessionVar-no_session_token?k='.$key);
		return null;
	}

	try {
		return $_SESSION[$token][$key];
	}
	catch (\ErrorException $e) {
		$app->log->error('getSessionVar?k='.$key);
		return null;
	}
}

function cleanupFailure($app, $grade, $cid)
{
	if (!$app->auth) {
		$app->log->error('fail_cleanupFailure_no-auth');
		return;
	}
	
	$app->log->info('cleanupFailure?u='.$app->auth->id.'&g='.$grade.'&c='.$cid);
	Progress::update($app->auth->id, $grade, $cid, null, null);
}


function getProblemIds($app, $grade, $cid)
{
    return getSessionVar($app, 'practice_problem_ids');
}

function initProblemIds($app, $grade, $cid)
{
	$failure = array();
	$start = 1;
	
	if ($app->auth) {
		$progress = Progress::select($app->auth->id, $grade, $cid);
		if ($progress) {
			$start = $progress->start;
			$failure = $progress->failure;
			if (null === $failure) {
				$failure = array();
			}
			$app->log->info('progress:s='.$start.'&f='.implode(',', $failure));
		}
	}
	
	$count = getProblemCount($app->auth);
	$problem_ids = Problem::selectProblemIds($grade, $cid, $count - count($failure), $start);
	$problem_ids = !empty($problem_ids) ? $problem_ids : array();
	$problem_ids = array_slice(array_merge($failure, $problem_ids), 0, $count);
	
	// shuffle($problem_ids);
	$app->log->info('pids:'.implode(',', $problem_ids));
	
	return $problem_ids;
}

function ok($result)
{
    $response = [
            'status' => 'OK',
            'result' => $result
    ];
    return json_encode($response);
}

function fail($info)
{
    $response = [
            'status' => 'FAIL',
            'result' => $info
    ];
    return json_encode($response);
}

function nextExpiration_($today, $months)
{
	$nexttime = strtotime('last day of +'.$months.' month '.$today);
	$todaytime = strtotime($today);
	if (date('t', $todaytime) > date('j', $todaytime)) {
		$back = date('j',$nexttime) - date('j',$todaytime);
		if ($back > 0) {
			$nexttime = strtotime('-'. $back.' days '.date('Y-m-d', $nexttime));
		}
	}
	return date('Y-m-d', $nexttime);
}

// compute next expiration day in next month
function nextExpirationMonth($today)
{
	return nextExpiration_($today, 1);
}

// compute next expiration day in next year
function nextExpirationYear($today)
{
	return nextExpiration_($today, 12);
}
