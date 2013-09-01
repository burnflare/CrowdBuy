define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing.html',
	'text!./app/views/templates/item-listing-empty.html',
	'models', 'utils', 'facebook'
], function($, _, Backbone, mainTemplate, itemListingTemplate, itemListingEmptyTemplate, Models, Utils) {
	var Views = {};
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

	Views.ItemView = Backbone.View.extend({
		template: _.template(itemListingTemplate),

		events: {
			"click button#btn-pledge" : 'pledgeClicked',
			"click button#btn-unpledge" : 'unpledgeClicked',
			"click div.item-buyers" : "buyersClicked"
		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "item-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		pledgeClicked: function() {
			$.ajax({
				url: '/service/me/want',
				dataType: 'json',
				type: 'POST',
				data: {
					product_listing_id: this.model.attributes.id
				}
			});
		},

		unpledgeClicked: function() {
			$.ajax({
				url: '/service/me/dontWant',
				dataType: 'json',
				type: 'POST',
				data: {
					product_listing_id: this.model.attributes.id
				}
			});
		},

		buyersClicked: function() {
			var buyerIds = this.model.attributes.buyers;
			var buyerObjects = new Backbone.Collection([], {
				
			});
			_.each(buyerIds, function(currentId) {
				var requestUrl = '//graph.facebook.com/' + currentId;
				var pictureUrl = requestUrl + '/picture';
				$.ajax({
					url: requestUrl,
					dataType: 'json',
					type: 'GET',
					success: function(response) {
						buyerObjects.add({
							name: response.name,
							link: response.link,
							picture: pictureUrl
						});
					}
				});
			});
		}
	});

	Views.ListingView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			this.childViews = [];
		},

		render: function() {
			var fragment = document.createDocumentFragment();

			if (this.childViews.length > 0) {
				_(this.childViews).each(function(currentView) {
					fragment.appendChild(currentView.render().el);
				});
			} else {
				$(itemListingEmptyTemplate).appendTo(fragment);
			}

			this.$('.item-listing').html(fragment);
			return this;
		},

		collectionAdded: function(item) {
			var that = this;
			item.set({userId: that.options.userId});
			this._addViewForModel(item);
			this.render();
		},

		collectionRemoved: function(item) {
			this.childViews = this.childViews.filter(function(view) {
				return view.model.id !== item.id;
			});
			this.render();
		},

		collectionChanged: function(item) {
			if (!item.changed.userId) {
				this.childViews = [];
				this._addAllModels();
			}
		},

		_addViewForModel: function(item) {
			this.childViews.push(new Views.ItemView({
				model: item
			}));
		},

		_addAllModels: function() {
			var that = this;
			this.collection.each(function(item) {
				item.set({userId: that.options.userId});
				that._addViewForModel(item);
			});
			this.render();
		}
	});

	return Views;
});