define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.SearchItem = Backbone.Model.extend({
		defaults: {
			id: '',
			category: '',
			name: '',
			price: ''
		},
		initialize: function() {

		},
		parse: function(response, options) {
			return response;
		}
	});
	return Models;
});