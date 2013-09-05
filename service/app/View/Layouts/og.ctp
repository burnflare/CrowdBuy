<?php
/**
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
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = __d('cake_dev', 'CakePHP: the rapid development php framework');
?>
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# crowdbuyfb: http://ogp.me/ns/fb/crowdbuyfb#">
	<title>
		<?php echo $cakeDescription ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->meta('icon');

		echo $this->fetch('meta');
		echo $this->fetch('css');
		echo $this->fetch('script');

		foreach ($og as $name => $value) {
			echo $this->Html->meta(array('property' => $name, 'content' => $value));
		}
	?>
</head>

<body>
	<div id="wrapper">
		<h1><?php echo $title_for_layout; ?></h1>
		<table border="0" cellspacing="0">
<?php
		$table = array();
		foreach ($og as $key => $value)
		{
			$table[] = array($key, $value);
		}
		echo $this->Html->tableCells($table);
?>
		</table>
	</div>
</body>
</html>
