<?php
App::uses('AppModel', 'Model');

/**
 * Person model
 */
class Person extends AppModel
{
	public $primaryKey = 'facebook_id';

	public $hasMany = array(
		'ProductListing' => array(
			'foreignKey' => 'creator'
		),
		'ProductSuggestion'
	);

	public $hasAndBelongsToMany = array(
		'Buys' => array(
			'className' => 'ProductListing',
			'joinTable' => 'product_listing_buyers',
			'associationForeignKey' => 'product_listing_id',
			'unique' => true
		)
	);
	
	/**
	 * Gets the listings by the given person.
	 * 
	 * @param string $id
	 */
	public function listings($id)
	{
		return $this->ProductListing->findByCreatorId($id);
	}
	
	/**
	 * Gets the listings from the friends of the given person.
	 * 
	 * @param string $id
	 */
	public function friendListings($id)
	{
		$friends = FB::api('/' . $id . '/friends');
		$friend_ids = array_map(function($friend) {
				return $friend['id'];
			}, $friends['data']);
		
		return $this->ProductListing->findByCreatorId($friend_ids);
	}
}
