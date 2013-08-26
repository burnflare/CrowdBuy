define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.Want = Backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			price: '',
			location: '',
			buyers: [],
			owner: '',
			imageUrl: '',
			dateStart: '',
			dateExpire: ''
		},
		initialize: function() {

		},
		parse: function(response) {
			var listing = response.ProductListing;
			var product = listing.product;
			var attributes = {
				id: listing.id,
				owner: listing.creator_id,
				dateStart: listing.date_start,
				dateExpire: listing.date_expire,
				location: listing.location,
				productId: listing.product_id,
				price: product.price,
				imageUrl: product.images[0]
			};
			return attributes;
		}
	});

	return Models;
});