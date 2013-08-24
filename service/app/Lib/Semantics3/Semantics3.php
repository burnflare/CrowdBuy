<?php
Configure::load('semantics3');
App::import('Vendor/oauth-php/library', 'OAuthStore');
App::import('Vendor/oauth-php/library', 'OAuthRequester');

/**
 * Semantics3 API for CrowdBuy
 */
class Semantics3
{
	/**
	 * The URI to query Semantics3 with.
	 */
	const URI = 'https://api.semantics3.com/v1/';

	private function __construct()
	{
		$options = array(
			'consumer_key' => Configure::Read('Semantics3.apiKey'),
			'consumer_secret' => Configure::Read('Semantics3.secret')
		);
		OAuthStore::instance('2Leg', $options);
	}

	private static function get()
	{
		static $instance;
		if (empty($instance))
		{
			$instance = new Semantics3();
		}
		
		return $instance;
	}

	/**
	 * Queries Semantics3 with the given properties.
	 * 
	 * @param string $type The type of query.
	 * @param stdClass $query An object with the query parameters.
	 */
	private function query($type, $query)
	{
		$request = new OAuthRequester(self::URI . $type . '?q=' . json_encode($query), 'GET', '');
		$result = $request->doRequest();
		$response = $result['body'];

		return json_decode($response);
	}
	
	public static function search($description)
	{
		var_dump(self::get()->query('products', (object)array(
			'search' => $description
		)));
		die();
	}
}
