<?php
App::uses('AppModel', 'Model');

/**
 * Person model
 */
class Person extends AppModel {
	public $hasAndBelongsToMany = array(
		'Product' => array(
			'className' => 'Product',
			'joinTable' => 'ProductListings',
			'foreignKey' => 'person_id',
			'associationForeignKey' => 'product_id',
			'unique' => true
		)
	);
}
