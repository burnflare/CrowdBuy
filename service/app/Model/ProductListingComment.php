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
		),
		
		'Person' => array(
			'className' => 'Person',
			'foreignKey' => 'author_id',
			'dependent' => true
		)
	);
	
	public function isOwnedBy($commentId, $personId)
	{
		$comment = $this->findById($commentId);
		return (string)$comment['ProductListingComment']['author_id'] === (string)$personId;
	}
}
