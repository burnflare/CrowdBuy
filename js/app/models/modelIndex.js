define(['jquery', 'underscore', 'backbone', 'model_want'], function($, _, Backbone) {

	var Models = {};

	// Load all the models we have.
	for (var i = 3; i < arguments.length; i++) {
		_.extend(Models, arguments[i]);
	}

	return Models;
});