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
	
	/**
	 * Checks if the given listing is owned by the person specified.
	 * 
	 * @param int $listingId
	 * @param string  $personId
	 * @return boolean
	 */
	public function isOwnedBy($listingId, $personId)
	{
		$listing = $this->findById($listingId);
		return (string)$listing['ProductListing']['creator_id'] === (string)$personId;
	}
	
	/**
	 * Checks if a listing is only visible by friends.
	 * 
	 * @param int $listingId
	 * @return boolean
	 */
	public function isFriendsOnly($listingId)
	{
		$listing = $this->findById($listingId);
		return intval($listing['ProductListing']['friends_only']) !== 0;
	}
}
