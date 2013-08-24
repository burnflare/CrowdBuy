<?php
App::uses('AppModel', 'Model');

/**
 * Product Listing Model
 */
class ProductListing extends AppModel
{
	public $hasMany = array(
		'Comment' => array(
			'className' => 'ProductListingComment',
			'foreignKey' => 'product_id',
			'dependent' => true
		)
	);
}
