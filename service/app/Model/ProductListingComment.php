<?php
App::uses('AppModel', 'Model');

/**
 * Product Listing Comments model
 */
class ProductListingComment extends AppModel
{
	public $belongsTo = array(
		'ProductListing' => array(
			'className' => 'ProductListing',
			'foreignKey' => 'product_listing_id',
			'dependent' => true
		)
	);
}
