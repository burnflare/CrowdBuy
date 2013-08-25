define(['jquery', 'underscore', 'backbone', 'model_want'], function($, _, Backbone) {
	var Models = {};
	Models.Wants = Backbone.Collection.extend({
	    url: '/service/me/wants',
		model: Models.Want
	});
	return Models;
});