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
	 * The models this controller uses.
	 *
	 * @var array
	 */
	public $uses = array('ProductListing');

	public function this($description, $start = 0)
	{
		$pattern = '/^(http|https|spdy):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.([A-Z]+))(:(\d+))?\/?/i';
		if (preg_match($pattern, $description))
		{
			$result = Semantics3::searchByUrl($description, $start);
		}
		else
		{
			$result = Semantics3::search($description, $start);
		}
		
		$products = (object)array(
			'total_results_count' => $result->total_results_count,
			'results' => array_map(function($item) {
				$item->id = $item->sem3_id;
				unset($item->sem3_id);
				return $item;
			}, $result->results)
		);
		$this->set('products', $products);
			
		$productIds = array_map(function($item) {
				return $item->id;
			}, $result->results);

		$listings = $this->ProductListing->findByProductId($productIds);
		$this->set('listings', $listings);

		$this->set('_serialize', array('products', 'listings'));
	}
}
