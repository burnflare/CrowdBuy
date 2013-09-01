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
	 * The components this controller uses.
	 * 
	 * @var array
	 */
	public $components = array(
		'Listings'
	);

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
			throw new ForbiddenException();
		}

		//Exchange the short-term access token for a long-lived access token.
		FB::setExtendedAccessToken();
		$this->Person->id = $userId;
		if (strpos(FB::getAccessToken(), '|') !== false)
		{
			//We have our secret key inside. Don't store in database, but we need
			//the person's FBID in our persons table.
			if ($this->Person->find('count', array(
				'conditions' => array(
					'Person.facebook_id' => $userId
				)
			)) === 0)
			{
				//In this situation, we won't set his key to null, in the event we
				//have an existing long-lived OAuth token.
				$this->Person->save(array(
					'oauth_token' => null
				));
			}
		}
		else
		{
			$this->Person->save(array(
				'oauth_token' => FB::getAccessToken()
			));
		}

		$this->Auth->login(array('id' => $userId));
		$this->set('_serialize', array());
	}

	/**
	 * Gets a list of items which I want to buy.
	 */
	public function wants()
	{
		$listings = $this->Person->listings($this->Auth->user('id'));
		$this->Listings->augmentProductInfo($listings);
		$this->set('listings', $listings);
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
			unset($this->request->data['id']);
			$this->request->data['person_id'] = $this->Auth->user('id');
			
			//Ensure idempotence
			if (!$this->ProductListingBuyers->find('count', array(
				'conditions' => array(
					'ProductListingBuyers.id' => $this->request->data['product_listing_id'],
					'ProductListingBuyers.person_id' => $this->request->data['person_id'])
				)))
			{
				//If the form data cannot be validated and saved...
				if (!$this->ProductListingBuyers->save($this->request->data))
				{
					debug($this->Recipe->validationErrors);
				}
			}

			//Set a session flash message and redirect.
			$this->Session->setFlash('Want saved.');
			$this->set('_serialize', array());
		}
	}
	
	/**
	 * Tells the server the user does not want something any more.
	 * 
	 * @param string $productListing The product listing ID the user no longer wants.
	 */
	public function dontWant()
	{
		if ($this->request->is('post'))
		{
			if ($this->ProductListingBuyers->deleteAll(array(
				'ProductListingBuyers.product_listing_id' =>
					$this->request->data('product_listing_id'),
				'ProductListingBuyers.person_id' =>
					$this->Auth->user('id'))))
			{
				//Set a session flash message and redirect.
				$this->Session->setFlash('Wants saved.');
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
		$listings = $this->Person->friendListings($this->Auth->user('id'));
		$this->Listings->augmentProductInfo($listings);
		$this->set('listings', $listings);
		
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
