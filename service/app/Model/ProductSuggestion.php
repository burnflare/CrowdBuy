<?php
App::uses('AppModel', 'Model');

/**
 * Product model
 */
class ProductSuggestion extends AppModel
{
	public $belongsTo = array(
		'Person',
		'Product',
		'Recommender' => array(
			'className' => 'Person',
			'foreignKey' => 'recommender_id'
		)
	);
}
