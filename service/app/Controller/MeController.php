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
	public $uses = array('Person');
	
	/**
	 * Gets a list of items which I want to buy.
	 */
	public function wants()
	{
		var_dump($this->Person->listings(1234));
		$this->set(compact('posts', 'comments'));
		$this->set('_serialize', array('posts', 'comments'));
	}
	
	/**
	 * Gets a list of requests my friends want me to buy.
	 */
	public function requests()
	{
		
	}
}
