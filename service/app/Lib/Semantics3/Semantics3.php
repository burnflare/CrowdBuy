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
	 * @param integer $start The offset for results to start from
	 * @param integer $limit The number of matches to return, starting from the
	 *        $start value.
	 */
	private function query($type, $query, $start = 0, $limit = 20)
	{
		$query->offset = $start;
		$query->limit = $limit;

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
