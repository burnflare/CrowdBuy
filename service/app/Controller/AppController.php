<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
App::uses('Controller', 'Controller');

App::import('Lib', 'Facebook');
App::uses('FB', 'Facebook.Lib');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{
	public $helpers = array('Js', 'Facebook.Facebook');
	public $components = array('Session',
		'Auth'				 => array(
			'authenticate'	 => array(
				'Form' => array(
					'fields' => array('username' => 'email')
				)
			),
			'authorize'		 => 'Controller',
			'model'			 => 'Person',
			'loginAction'	 => 'me/login'
		),
		'Facebook.Connect',
		'RequestHandler'
	);
	
	public function isAuthorized($user)
	{
		//Currently, logged-in users can do everything.
		return !empty($user);
	}
	
	public function checkFacebookAuthToken()
	{
		if (!isset($this->request->query['auth']))
		{
			throw new ForbiddenException();
		}

		$info = FB::api(sprintf('/debug_token?input_token={%s}&access_token={%s}',
			$this->request->query['auth']['accessToken'],
			Configure::read('Facebook.appId') . '|' . Configure::read('Facebook.secret')));
		if (isset($info['data']['error']))
		{
			//Invalid token.
			throw new ForbiddenException();
		}
		
		//TODO: Check that the token belongs to us!
	}
}
