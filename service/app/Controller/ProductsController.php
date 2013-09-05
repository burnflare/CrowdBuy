<?php
App::uses('AppController', 'Controller');

/**
 * Products controller
 *
 * Handles requests about products.
 */
class ProductsController extends AppController
{
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Product';
	
	/**
	 * The components this controller uses.
	 * 
	 * @var array
	 */
	public $components = array(
		'Products'
	);

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array();
	
	public function isAuthorized($user)
	{
		//If this is an Open Graph ping, we have to allow public access/
		if (in_array($this->action, array('og')))
		{
			return true;
		}
		
		return parent::isAuthorized($user);
	}
	
	/**
	 * Searches for a product like the given string.
	 * 
	 * This can be invoked through a call to requestAction, which then will return
	 * the object that would otherwise be serialised to the client.
	 */
	public function search($description, $start = 0)
	{
		$result = $this->Products->searchSemantics3($description, $start);
		
		$this->set('result', $result);
		$this->set('_serialize', array('result'));
	}
	
	/**
	 * Gets Semantics3's product info given the product ID.
	 */	
	public function get($id)
	{
		$result = Semantics3::getInfo($id);
		
		$this->set('result', $result);
		$this->set('_serialize', array('result'));
	}
	
	/**
	 * Gets Open Graph metadata about a listing.
	 * @throws FileNotFoundException
	 */
	public function og($id)
	{
		$result = Semantics3::getInfo($id);
		
		$meta = array(
			'fb:app_id' => '509825915758193',
			'og:type'   => 'crowdbuyfb:item',
			//TODO: Make this clickable.
			'og:url'    => 'http://' . $_SERVER['SERVER_NAME'] . '/service/products/og/' . $id,
			'og:title'  => $result->name,
			'og:image'  => empty($result->images) ? '' : $result->images[0]
		);
		$this->set('og', $meta);
		$this->render('og', 'og');
	}
}
