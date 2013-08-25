define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.SearchItem = Backbone.Model.extend({
		defaults: {
			id: '',
			category: '',
			name: '',
			price: '',
			user_price: '',
			user_currency: '',
			length: '',
			width: '',
			height: ''
		},
		initialize: function() {

		},
		parse: function(response, options) {
			return response;
		}
	});
	return Models;
});