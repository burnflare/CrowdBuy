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
		'Products',
		'Listings'
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

		$listings = $this->ProductListing->find('visible', array(
			'conditions' => array(
				'ProductListing.product_id' => $productIds)));
		$this->Listings->augmentProductInfo($listings);
		$this->Listings->sanitise($listings);
		$this->set('listings', $listings);

		$this->set('_serialize', array('products', 'listings'));
	}
}
