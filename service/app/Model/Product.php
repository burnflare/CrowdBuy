<?php
App::uses('AppModel', 'Model');

/**
 * Product model
 */
class Product extends AppModel
{
	public $hasMany = array(
		'ProductListing'
	);
	
	/**
	 * Gets the listings about the given product ID.
	 * 
	 * @param string $id The EAN ID.
	 */
	public function listings($id)
	{
		return $this->ProductListing->findByProductId($for);
	}
}
