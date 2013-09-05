<?php
App::uses('AppController', 'Controller');

/**
 * "Public" controller
 *
 * Handles requests about the public.
 */
class PublicController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Public';

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
		'ProductListings'
	);

	public function wants()
	{
		$listings = array_map(function($item) {
			return array('ProductListing' => $item['ProductListings']);
		}, $this->ProductListings->find('all', array(
			'conditions' => array(
				'ProductListings.friends_only' => 0
			)
		)));
		
		$this->Listings->augmentProductInfo($listings);
		$this->set('listings', $listings);
		
		$this->set('_serialize', array('listings'));
	}
}