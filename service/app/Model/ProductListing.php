<?php
App::uses('AppModel', 'Model');

/**
 * Product Listing Model
 */
class ProductListing extends AppModel
{
	public $hasAndBelongsToMany = array(
		'Buyer' => array(
			'className' => 'Person',
			'joinTable' => 'product_listing_buyers',
			'associationForeignKey' => 'person_id',
			'unique' => true
		)
	);

	public $hasMany = array(
		'Comment' => array(
			'className' => 'ProductListingComment',
			'foreignKey' => 'product_listing_id',
			'dependent' => true
		)
	);
	
	public function isOwnedBy($listingId, $personId)
	{
		$listing = $this->findById($listingId);
		return (string)$listing['ProductListing']['creator_id'] === (string)$personId;
	}
}
