define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.Wants = Backbone.Collection.extend({
	    url: '/service/me/wants',
		model: Models.Want
	});
	return Models;
});