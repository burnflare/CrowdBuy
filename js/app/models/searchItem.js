define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.SearchItem = Backbone.Model.extend({
		defaults: {
			id: '',
			productId: '',
			category: '',
			name: '',
			price: ''
		},
		initialize: function() {

		}
	});
	return Models;
});