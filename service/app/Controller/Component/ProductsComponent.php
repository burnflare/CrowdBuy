<?php
App::uses('Component', 'Controller');
App::uses('Semantics3', 'Semantics3');

class ProductsComponent extends Component
{
	/**
	 * Filters the list of products returned by Semantics3, to change their Sem3 ID
	 * to just 'ID' used by us, as well as to localise currencies for the user.
	 * @param array $products
	 */
	public function filterSemantics3ProductsList(array &$products)
	{
		
	}
	
	/**
	 * Searches Semantics3's database for the item with the given description.
	 * @param string $description The thing to search for, special treatment is given
	 *        for URLs.
	 * @param integer $start The offset to start listing results from.
	 */
	public function searchSemantics3($description, $start = 0)
	{
		//Decide if it is a URL.
		$pattern = '/^(http|https|spdy):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.([A-Z]+))(:(\d+))?\/?/i';
		if (preg_match($pattern, $description))
		{
			$result = Semantics3::searchByUrl($description, $start);
		}
		else
		{
			$result = Semantics3::search($description, $start);
		}
		
		//query for the current user's native currency.
		$fbid = AuthComponent::user('id');
		$personModel = ClassRegistry::init('Person');
		$token = $personModel->findByFacebookId($fbid);
		$token = $token['Person']['oauth_token'];
		
		FB::setAccessToken($token);
		$currency = FB::api(sprintf('/%s?fields=currency', $fbid));
		if (isset($currency['currency']))
		{
			$exchange_rate = $currency['currency']['usd_exchange_inverse'];
		}
		
		return (object)array(
			'total_results_count' => $result->total_results_count,
			'results' => array_map(function($item) use (&$exchange_rate) {
				$item->id = $item->sem3_id;
				unset($item->sem3_id);
				
				if (isset($exchange_rate) && isset($item->price))
				{
					$item->user_price = floatval($item->price) * $exchange_rate;
				}
				return $item;
			}, $result->results)
		);
	}
}
