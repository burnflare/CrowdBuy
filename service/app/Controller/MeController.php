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
	 * The models this controller uses
	 *
	 * @var array
	 */
	public $uses = array(
		'Person',
		'ProductListingBuyers',
		'ProductSuggestion'
	);
	
	public function login()
	{
		$userId = FB::getUser();
		if (empty($userId))
		{
			throw ForbiddenException();
		}

		$this->Auth->login(array('id' => $userId));
		
		$referer = $this->request->referer();
		if (empty($referer))
		{
			$this->set('_serialize', array());
		}
		else
		{
			$this->response->location($this->request->referer());
		}
	}

	/**
	 * Gets a list of items which I want to buy.
	 */
	public function wants()
	{
		$this->set('listings',
			$this->Person->listings($this->Auth->user('id')));
		$this->set('_serialize', array('listings'));
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
	
	/**
	 * Get a list of items my friends want to buy.
	 */
	public function friendsWants()
	{
		$this->set('listings',
			$this->Person->friendListings($this->Auth->user('id')));
		$this->set('_serialize', array('listings'));
	}
	
	/**
	 * Gets a list of products recommended.
	 */
	public function recommended()
	{
		$this->set('products',
			$this->Person->suggestions($this->Auth->user('id')));
		$this->set('_serialize', array('products'));
	}
}
