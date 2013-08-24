<?php
App::uses('AppModel', 'Model');

/**
 * Product model
 */
class ProductSuggestion extends AppModel
{
	public $belongsTo = array(
		'Person',
		'Product'
	);
}
