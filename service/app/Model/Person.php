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
	
	/**
	 * Gets the listings by the given person.
	 * 
	 * @param string $id
	 */
	public function listings($id)
	{
		return $this->ProductListing->findById($id);
	}
}
