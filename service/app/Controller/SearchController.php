<?php
App::uses('AppController', 'Controller');

/**
 * Search controller
 *
 * Handles site-wide search.
 */
class SearchController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Search';

	/**
	 * The components this controller uses.
	 * 
	 * @var array
	 */
	public $components = array(
		'Products'
	);

	/**
	 * The models this controller uses.
	 *
	 * @var array
	 */
	public $uses = array('ProductListing');

	public function this($description, $start = 0)
	{
		$products = $this->Products->searchSemantics3($description, $start);
		$this->set('products', $products);
			
		$productIds = array_map(function($item) {
				return $item->id;
			}, $products->results);

		$listings = $this->ProductListing->findByProductId($productIds);
		$this->set('listings', $listings);

		$this->set('_serialize', array('products', 'listings'));
	}
}
