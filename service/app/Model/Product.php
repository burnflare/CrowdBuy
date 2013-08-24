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
	 * Gets the listings about the given product ID.
	 * 
	 * @param string $id The EAN ID.
	 */
	public function listings($id)
	{
		return $this->ProductListings->findByProductId($for);
	}
}
