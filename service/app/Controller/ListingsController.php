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
		//Fulfil base requirements
		if (!parent::isAuthorized($user))
		{
			return false;
		}

		//Check for friends-only listings.
		if (in_array($this->action, array('comment', 'get')))
		{
			$listingId = $this->request->params['pass'][0];
			if ($this->ProductListing->isFriendsOnly($listingId) &&
				!$this->ProductListing->isVisible($listingId, $auth['id']))
			{
				return false;
			}
		}

		//The owner of a listing can edit and delete comments of the listing
		if ($this->action === 'deleteComment')
		{
			$commentId = $this->request->params['pass'][0];
			$listingComment = $this->ProductListingComment->findById($commentId);
			$listingId = $listingComment['ProductListing']['id'];
			
			return $this->ProductListing->isOwnedBy($listingId, $user['id']) ||
				$this->ProductListingComment->isOwnedBy($commentId, $user['id']);
		}
		
		//The owner of a listing can delete it.
		else if ($this->action === 'delete')
		{
			$listingId = $this->request->params['pass'][0];
			return $this->ProductListing->isOwnedBy($listingId, $user['id']);
		}

		//Conservative default.
		return false;
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
	
	public function deleteComment($id)
	{
		$this->ProductListingComment->delete($id);
	}
	
	public function delete($id)
	{
		$this->ProductListing->delete($id);
	}
}
