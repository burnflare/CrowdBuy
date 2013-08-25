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
	 * 
	 * This can be invoked through a call to requestAction, which then will return
	 * the object that would otherwise be serialised to the client.
	 */
	public function search($description, $start = 0, $count = 20)
	{
		//If we aren't requesting through requestAction, cap the number of results
		//returned to 100.
		if (empty($this->request->params['requested']))
		{
			$count = max(min($count, 100), 1);
		}

		$pattern = '/^(http|https|spdy):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.([A-Z]+))(:(\d+))?\/?/i';
		if (preg_match($pattern, $description))
		{
			$result = Semantics3::searchByUrl($description, $start, $count);
		}
		else
		{
			$result = Semantics3::search($description, $start, $count);
		}
		
		$display = (object)array(
			'total_results_count' => $result->total_results_count,
			'results' => array_map(function($item) {
				$item->id = $item->sem3_id;
				unset($item->sem3_id);
				return $item;
			}, $result->results)
		);
		
		if (!empty($this->request->params['requested']))
		{
			return $display;
		}
		else
		{
			$this->set(array('result' => &$display));
			$this->set('_serialize', array('result'));
		}
	}
}
