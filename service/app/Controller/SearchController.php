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
		
		$this->set('products', $products);
		$this->set('_serialize', array('products'));
	}
}
