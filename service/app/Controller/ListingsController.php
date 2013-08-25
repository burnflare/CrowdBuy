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
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array('ProductListing');
	
	/**
	 * Creates a new listing.
	 */
	public function create()
	{
		if ($this->request->is('post'))
		{
			//If the form data can be validated and saved...
			$this->request->data['person_id'] = $this->Auth->user('id');
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
		$pattern = '/^(http|https|spdy):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.([A-Z]+))(:(\d+))?\/?/i';
		if (preg_match($pattern, $description))
		{
			$result = Semantics3::searchByUrl($description, $start);
		}
		else
		{
			$result = Semantics3::search($description, $start);
		}
		
		$productIds = array_map(function($item) {
				return $item->sem3_id;
			}, $result->results);

		$listings = $this->ProductListing->findByProductId($productIds);

		$this->set('listings', $listings);
		$this->set('_serialize', array('listings'));
	}
}
