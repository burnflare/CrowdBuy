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
		'ProductListing'
	);

	public function wants()
	{
		$listings = $this->ProductListing->find('random', array(
			'conditions' => array(
				'ProductListing.friends_only' => 0
			),
			'limit' => 10
		));
		
		$this->Listings->augmentProductInfo($listings);
		$this->set('listings', $listings);
		
		$this->set('_serialize', array('listings'));
	}
}