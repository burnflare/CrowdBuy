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
	
	public function login()
	{
		//TODO: Dummy login stub.
		$this->Auth->login(array('id' => ''));
	}

	/**
	 * Gets a list of items which I want to buy.
	 */
	public function wants()
	{
		var_dump($this->Person->findByFacebookId($this->Auth->user('id')));
		var_dump($this->Person->listings($this->Auth->user('id')));
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
