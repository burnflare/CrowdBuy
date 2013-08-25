<?php
App::uses('AppController', 'Controller');

/**
 * Search controller
 *
 * Handles site-wide search.
 */
class SearchController extends AppController
{
	public function this($description, $start = 0)
	{
		$products = $this->requestAction(array(
			'controller' => 'products',
			'action' => 'search'),
			array('pass' => array($description, $start)));
		
		$listings = $this->requestAction(array(
			'controller' => 'listings',
			'action' => 'searchInternal'),
			array('pass' => array(
				array_map(function($item) {
					return $item->id;
				}, $products->results))
			));
		$this->set('products', $products);
		$this->set('listings', $listings);
		$this->set('_serialize', array('products', 'listings'));
	}
}
