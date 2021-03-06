<?php
App::uses('Component', 'Controller');
App::uses('Semantics3', 'Semantics3');

class ListingsComponent extends Component
{
	public function augmentProductInfo(&$listings)
	{
		$productIds = array_map(function($item) {
				return $item['ProductListing']['product_id'];
			}, $listings);
		$products = Semantics3::getInfo($productIds);
		if (!empty($products))
		{
			$products = array_combine(array_map(function($item) {
					return $item->sem3_id;
				}, $products), $products);
		}
		
		foreach ($listings as &$listing)
		{
			$productId = $listing['ProductListing']['product_id'];
			$listing['ProductListing']['product'] = $products[$productId];
			$listing = (object)$listing;
		}
		
		return $products;
	}
	
	/**
	 * Removes the OAuth token which we use to authenticate against Facebook from
	 * all product listings.
	 * 
	 * @param array $listings
	 */
	public function sanitise(&$listings)
	{
		foreach ($listings as &$listing)
		{
			foreach ($listing->Buyer as &$buyer)
			{
				unset($buyer['oauth_token']);
			}
		}
	}
}
