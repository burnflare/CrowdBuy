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
	 * Custom find methods.
	 * @var array
	 */
	public $findMethods = array(
		'visible' => true
	);
	
	protected function _findVisible($state, $query, $results = array())
	{
		if ($state === 'before')
		{
			$query['conditions'][] = array('OR' => array(
				'ProductListing.friends_only' => 0,
				'ProductListing.creator_id' =>
					self::getFacebookFriends(AuthComponent::user('id'))
			));
			return $query;
		}
		return $results;
	}
	
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
	
	/**
	 * Checks if the given listing is visible to the given person.
	 * @param int $listingId
	 * @param string $personId
	 * @return boolean
	 */
	public function isVisible($listingId, $personId)
	{
		$listing = $this->findById($listingId);
		$creator_id = $listing['ProductListing']['creator_id'];
		$friend_ids = self::getFacebookFriends($creator_id);
		
		return in_array($personId, $friend_ids);
	}
	
	/**
	 * Gets an array of Facebook friends for the given person's ID.
	 * 
	 * @param string $personId
	 * @return array
	 */
	private static function getFacebookFriends($personId)
	{
		$friends = FB::api('/' . $personId . '/friends');
		$friend_ids = array_map(function($friend) {
				return $friend['id'];
			}, $friends['data']);
			
		return $friend_ids;
	}
}
