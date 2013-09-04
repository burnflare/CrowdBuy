define(['jquery', 'underscore', 'backbone', 'utils'], function($, _, Backbone, Utils) {
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
			dateExpire: '',
			ownerName: 'Unknown'
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

			var startParsed = Utils.dropTimeFromIsoDate(listing.date_start);
			var endParsed = Utils.dropTimeFromIsoDate(listing.date_expire);

			var attributes = {
				id: listing.id,
				name: product.name,
				owner: listing.creator_id,
				dateStart: startParsed,
				dateExpire: endParsed,
				location: listing.location,
				productId: listing.product_id,
				price: product.price,
				imageUrl: product.images[0],
				buyers: buyerArray,
				comments: commentArray
			};
			if (typeof this.attributes.ownerName === 'undefined') {
				var that = this;
				$.ajax({
					url: Utils.getFacebookApiLink(attributes.owner),
					type: 'GET',
					dataType: 'json',
					success: function(response) {
						that.set({
							ownerName: response.name
						});
					}
				});
			}
			return attributes;
		}
	});

	return Models;
});