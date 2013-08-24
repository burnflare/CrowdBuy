<?php
App::uses('AppModel', 'Model');

/**
 * Product model
 */
class Product extends AppModel
{
	public $hasAndBelongsToMany = array(
		'Person' => array(
			'className' => 'Person',
			'joinTable' => 'productlistings',
			'foreignKey' => 'product_id',
			'associationForeignKey' => 'person_id',
			'unique' => true
		)
	);
	
	/**
	 * Gets the listings by the given person.
	 */
	public function listings(Person $for)
	{
		return $this->ProductListings->findByPerson($for);
	}
}
