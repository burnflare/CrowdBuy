define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing.html',
	'text!./app/views/templates/item-listing-empty.html',
	'models', 'utils', 'facebook', 'view_common'
], function($, _, Backbone, mainTemplate, itemListingTemplate, itemListingEmptyTemplate, Models, Utils) {
	Views.Main = Backbone.View.extend({
		initialize: function() {
			this.$el.html(_.template(mainTemplate, {}));
			this._setUpCollections();
		},

		_setUpCollections: function() {
			var userId = this.options.userId;
			yourCollection = new Models.Wants([], {
				url: '/service/me/wants'
			});
			friendCollection = new Models.Wants([], {
				url: '/service/me/friendsWants'
			});
			featuredCollection = new Models.Wants([], {
				url: '/service/me/recommended'
			});
			publicCollection = new Models.Wants([], {
				url: '/service/public/wants' // I don't think this exists, but hey.
			});

			yourView = new Views.ListingView({
				collection: yourCollection,
				el: document.getElementById('you-section'),
				id: "you",
				'userId': userId
			});

			friendView = new Views.ListingView({
				collection: friendCollection,
				el: document.getElementById('friend-section'),
				id: "friend",
				'userId': userId
			});

			featuredView = new Views.ListingView({
				collection: featuredCollection,
				el: document.getElementById('featured-section'),
				id: "featured",
				'userId': userId
			});

			publicView = new Views.ListingView({
				collection: publicCollection,
				el: document.getElementById('public-section'),
				id: "public",
				'userId': userId
			});
		}
	});

	return Views;
});