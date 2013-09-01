<?php
App::uses('AppController', 'Controller');

/**
 * "Listings" controller
 *
 * Handles requests about myself.
 */
class ListingsController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Listing';

	/**
	 * The components this controller uses.
	 * 
	 * @var array
	 */
	public $components = array(
		'Products',
		'Listings'
	);

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array(
		'Product',
		'ProductListing',
		'ProductListingComment'
	);
	
	public function isAuthorized($user)
	{
		//All registered users can add comments
		//TODO: check for friends-only listings.
		if ($this->action === 'comment' || $this->action === 'deleteComment')
		{
			return parent::isAuthorized($user);
		}

		//The owner of a listing can edit and delete it
		else if (in_array($this->action, array('edit', 'delete')))
		{
			$postId = $this->request->params['pass'][0];
			if ($this->Post->isOwnedBy($postId, $user['id']))
			{
				return true;
			}
		}

		return parent::isAuthorized($user);
	}

	/**
	 * Creates a new listing.
	 */
	public function create()
	{
		if ($this->request->is('post'))
		{
			//Try creating the product first.
			if (!$this->Product->find('count', array(
				'conditions' => array(
					'Product.id' => $this->request->data['product_id'])
				)))
			{
				$this->Product->id = $this->request->data['product_id'];
				$this->Product->save(array());
			}
			
			//Make sure we don't clobber someone else's entry
			unset($this->request->data['id']);
			
			//If the form data can be validated and saved...
			$this->request->data['creator_id'] = $this->Auth->user('id');
			if ($this->ProductListing->save($this->request->data))
			{
				//Set a session flash message and redirect.
				$this->Session->setFlash('Listing saved.');
				$this->set('_serialize', array());
			}
			else
			{
				debug($this->Recipe->validationErrors);
			}
		}
	}

	/**
	 * Searches for a listing containing the given product.
	 * 
	 * This can be invoked through a call to requestAction, which then will return
	 * the object that would otherwise be serialised to the client.
	 */
	public function search($description, $start = 0)
	{
		$products = $this->Products->searchSemantics3($description, $start);
		$productIds = array_map(function($item) {
				return $item->id;
			}, $products->results);

		$listings = $this->ProductListing->findAllByProductId($productIds);
		$this->Listings->augmentProductInfo($listings);
		$this->Listings->sanitise($listings);

		$this->set('listings', $listings);
		$this->set('_serialize', array('listings'));
	}
	
	/**
	 * Gets a listing.
	 * @param integer $id The ID of the listing to retriveve
	 */
	public function get($id)
	{
		//We make an array of listings, so we can use augmentProductInfo with it.
		$listings = array($this->ProductListing->findById($id));
		$this->Listings->augmentProductInfo($listings);
		$this->Listings->sanitise($listings);
		
		//Then we just take the first one.
		$this->set('listing', $listings[0]);
		$this->set('_serialize', array('listing'));
	}
	
	public function comment()
	{
		if ($this->request->is('post'))
		{
			//Reject invalid listings.
			if (!$this->ProductListing->find('count', array(
				'conditions' => array(
					'ProductListing.id' => $this->request->data['product_listing_id'])
				)))
			{
				throw new FileNotFoundException();
			}
			
			//Reject attempts to create comments with an ID
			unset($this->request->data['id']);
			
			//If the form data can be validated and saved...
			$this->request->data['author_id'] = $this->Auth->user('id');
			if ($this->ProductListingComment->save($this->request->data))
			{
				//Set a session flash message and redirect.
				$this->Session->setFlash('Listing saved.');
				$this->set('_serialize', array());
			}
			else
			{
				debug($this->ProductListingComment->validationErrors);
			}
		}
	}
}
