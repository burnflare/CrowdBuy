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
			'className' => 'ProductListing',
			'foreignKey' => 'creator'
		)
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
}
