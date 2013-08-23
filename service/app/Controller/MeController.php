<?php
App::uses('AppController', 'Controller');

/**
 * "Me" controller
 *
 * Handles requests about myself.
 */
class MeController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Me';

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array();
	
	/**
	 * Gets a list of items which I want to buy.
	 */
	public function wants()
	{
		
	}
	
	/**
	 * Gets a list of requests my friends want me to buy.
	 */
	public function requests()
	{
		
	}
}
