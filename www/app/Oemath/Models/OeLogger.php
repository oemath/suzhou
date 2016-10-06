<?php

namespace Oemath\Models;

require INC_ROOT . '/log4php2.3/Logger.php';

use Logger;

class OeLogger
{
	private $app;
	private $log;
	
	
	public function __construct($app)
	{
		Logger::configure(INC_ROOT . '/app/config/logger.xml');
		$this->app = $app;
		$this->log = Logger::getLogger('oemath');
	}
	
	private function format($message)
	{
		$msg = '('.substr(session_id(),-6).')';
		$user = $this->app->auth;
		if ($user) {
			$msg .= ' ('.$user->getUsername().')';
		}
		else {
			$msg .= ' ()';
		}
		
		return $msg.' '.$message;
	}
	
	public function info($message)
	{
		try {
			$this->log->info($this->format($message));
		}
		catch (\ErrorException $e) {
		}
	}

	public function error($message)
	{
		try {
			$this->log->error($this->format($message));
		}
		catch (\ErrorException $e) {
			
		}
	}

	public function warn($message)
	{
		try {
			$this->log->warn($this->format($message));
		}
		catch (\ErrorException $e) {
			
		}
	}
}