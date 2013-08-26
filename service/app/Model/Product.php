<?php
App::uses('AppModel', 'Model');

/**
 * Product model
 */
class Product extends AppModel
{
	public $hasMany = array(
		'ProductListing',
		'ProductSuggestion'
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
	 * Gets the listings about the given product ID.
	 * 
	 * @param string $id The EAN ID.
	 */
	public function listings($id)
	{
		return $this->ProductListing->findByProductId($for);
	}
}
