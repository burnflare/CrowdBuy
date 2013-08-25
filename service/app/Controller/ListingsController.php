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
		'Products'
	);

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array(
		'Product',
		'ProductListing'
	);
	
	/**
	 * Creates a new listing.
	 */
	public function create()
	{
		if ($this->request->is('post'))
		{
			//Try creating the product first.
			$this->Product->id = $this->request->data['product_id'];
			$this->Product->save(array());
			
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

		$listings = $this->ProductListing->findByProductId($productIds);

		$this->set('listings', $listings);
		$this->set('_serialize', array('listings'));
	}
}
