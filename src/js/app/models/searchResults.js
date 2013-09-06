define(['jquery', 'underscore', 'backbone', 'model_search_item'], function($, _, Backbone, Models) {
	Models.ProductSearchResults = Backbone.Collection.extend({
		model: Models.SearchItem,
		url: '/service/products/search/',
		parse: function(response, options) {
			if (response.result) {
				return response.result.results;
			} else {
				return response.listings;
			}
		},
		initialize: function() {
			this.fetch();
		}
	});
	return Models;
});