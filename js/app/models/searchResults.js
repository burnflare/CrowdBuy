define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.SearchResults = Backbone.Collection.extend({
		url: '/service/products/results/',
		model: Models.SearchItem
	});
	return Models;
});