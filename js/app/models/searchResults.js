define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.SearchResults = Backbone.Collection.extend({
		url: '/service/products/results/',
		model: Models.SearchItem,
		parse: function(response, options) {
			return response.result.results;
		}
	});
	return Models;
});