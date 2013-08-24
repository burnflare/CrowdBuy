<?php
App::uses('AppController', 'Controller');

/**
 * Products controller
 *
 * Handles requests about products.
 */
class ProductsController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Product';

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array();
	
	/**
	 * Searches for a product like the given string.
	 */
	public function search($description, $start = 0)
	{
		$result = Semantics3::search($description, $start);
		$display = (object)array(
			'total_results_count' => $result->total_results_count,
			'results' => array_map(function($item) {
				$item->id = $item->sem3_id;
				unset($item->sem3_id);
				return $item;
			}, $result->results)
		);
		
		$this->set(array('result' => &$display));
		$this->set('_serialize', array('result'));
	}
}
