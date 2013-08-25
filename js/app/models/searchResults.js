define(['jquery', 'underscore', 'backbone', 'model_search_item'], function($, _, Backbone, Models) {
	Models.SearchResults = Backbone.Collection.extend({
		url: '/service/products/search/',
		model: Models.SearchItem,
		parse: function(response, options) {
			return response.result.results;
		}
	});
	return Models;
});