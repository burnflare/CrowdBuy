define(['jquery', 'underscore', 'backbone', 'view_item', 'view_search', 'view_main'], function($, _, Backbone) {

	var Views = {};

	// Load all the views we have.
	for (var i = 3; i < arguments.length; i++) {
		_.extend(Views, arguments[i]);
	}

	return Views;
});