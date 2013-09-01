define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.Want = Backbone.Model.extend({
		urlRoot: '/service/listings/get',
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
			/* If we're parsing a response retrieved from the 
			collection, it comes in a form similar to:
			{
				ProductListing: {},
				Buyer: [],
				Comment: []
			}

			However, if it's from /service/listings/get, it looks like:
			{
				listing: {
					ProductListing: {},
					Buyer: [],
					Comment: []
				}
			}

			Hence the use of responseRoot below. */

			var responseRoot;
			if (response.ProductListing) {
				responseRoot = response;
			} else {
				responseRoot = response.listing;
			}
			var listing = responseRoot.ProductListing;
			var product = listing.product;
			var buyerArray = _.map(responseRoot.Buyer, function(buyer) {
				return buyer.facebook_id;
			});
			var commentArray = response.Comment;
			var attributes = {
				id: listing.id,
				name: product.name,
				owner: listing.creator_id,
				dateStart: listing.date_start,
				dateExpire: listing.date_expire,
				location: listing.location,
				productId: listing.product_id,
				price: product.price,
				imageUrl: product.images[0],
				buyers: buyerArray,
				comments: commentArray
			};
			return attributes;
		}
	});

	return Models;
});