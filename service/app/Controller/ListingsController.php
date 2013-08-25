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
	public $name = 'Me';

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
	 * Searches for listings which include the following products.
	 * @param array $productIds An array of products.
	 * @throws ForbiddenException
	 */
	public function searchInternal(array $productIds)
	{
		//This is internal.
		if (!empty($this->request->params['requested']))
		{
			throw new ForbiddenException();
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
		$products = $this->requestAction(array(
			'controller' => 'products',
			'action' => 'search'),
			array('pass' => array($description, $start)));
		
		$results = $this->searchInternal(
			array_map(function($item) {
				return $item->id;
			}, $products->results));
			
		$this->set('listings', $results);
		$this->set('_serialize', array('listings'));
	}
}
