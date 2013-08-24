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
	public $uses = array('Person', 'ProductListingBuyers');
	
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
		$this->Person->listings($this->Auth->user('id'));
		$this->set(compact('posts', 'comments'));
		$this->set('_serialize', array('posts', 'comments'));
	}
	
	/**
	 * Tells the server the user wants something.
	 * 
	 * @param string $productListing The product listing ID the user wants.
	 */
	public function want()
	{
		if ($this->request->is('post'))
		{
			//If the form data can be validated and saved...
			$this->request->data['person_id'] = $this->Auth->user('id');
			if ($this->ProductListingBuyers->save($this->request->data))
			{
				//Set a session flash message and redirect.
				$this->Session->setFlash('Want saved.');
				$this->set('_serialize', array());
			}
			else
			{
				debug($this->Recipe->validationErrors);
			}
		}
	}
	
	public function friendsWants()
	{
		$this->Person->friendListings($this->Auth->user('id'));
	}
	
	/**
	 * Gets a list of requests my friends want me to buy.
	 */
	public function requests()
	{
		
	}
}
