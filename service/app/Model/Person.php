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
			'foreignKey' => 'creator_id'
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
	 * Override to allow inserting a new Person specifying the primary key.
	 */
	public function set($one, $two = null)
	{
		parent::set($one, $two);

		// if not already found in database
		if (!$this->exists())
		{
			if ($this->id)
			{
				$this->data[$this->alias][$this->primaryKey] = $this->id;
				$this->id = false;
			}
		}
	}
	
	/**
	 * Gets the listings by the given person.
	 * 
	 * @param string $id
	 */
	public function listings($id)
	{
		return $this->ProductListing->findAllByCreatorId($id);
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
		
		return $this->ProductListing->findAllByCreatorId($friend_ids);
	}
	
	/**
	 * Gets suggested products for the given person.
	 * 
	 * @param string $id
	 */
	public function suggestions($id)
	{
		return $this->ProductSuggestion->findAllByPersonId($id);
	}
}
