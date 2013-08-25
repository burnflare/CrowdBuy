define(['jquery', 'underscore', 'backbone', 'model_search_item'], function($, _, Backbone, Models) {
	Models.SearchResults = Backbone.Collection.extend({
		model: Models.SearchItem,
		url: '/service/products/search/',
		initialize: function() {
			this.fetch();
		},
		parse: function(response, options) {
			return response.result.results;
		}
	});
	return Models;
});