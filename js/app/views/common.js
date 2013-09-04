define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing.html',
	'text!./app/views/templates/item-listing-empty.html',
	'text!./app/views/templates/loading.html',
	'models', 'utils', 'facebook', 'view_common'
], function($, _, Backbone, mainTemplate, itemListingTemplate, itemListingEmptyTemplate, defaultLoadingTemplate, Models, Utils) {
	var Views = {};

	Views.GenericCollectionView = Backbone.View.extend({
		loadingTemplate: defaultLoadingTemplate,

		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			var that = this;
			this.listenTo(this.collection, 'fetched', function() {
				that._loaded = true;
				that.render();
			});

			this.childViews = [];
			this.render();
		},

		render: function() {
			var fragment = document.createDocumentFragment();

			if (!this._loaded) {
				$(this.loadingTemplate).appendTo(fragment);
			} else if (this.childViews.length > 0) {
				_(this.childViews).each(function(currentView) {
					fragment.appendChild(currentView.render().el);
				});
			} else {
				$(itemListingEmptyTemplate).appendTo(fragment);
			}

			this._appendFragmentToDocument(fragment);
			return this;
		},

		collectionAdded: function(item) {
			var that = this;
			item.set({
				userId: that.options.userId
			});
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
			this.childViews.push(new this.subView({
				model: item
			}));
		},

		_addAllModels: function() {
			var that = this;
			this.collection.each(function(item) {
				item.set({
					userId: that.options.userId
				});
				that._addViewForModel(item);
			});
			this.render();
		}
	});

	Views.ItemView = Backbone.View.extend({
		template: _.template(itemListingTemplate),

		events: {
			"click button#btn-pledge": 'pledgeClicked',
			"click button#btn-unpledge": 'unpledgeClicked',
			"click div.item-buyers": "buyersClicked"
		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "item-" + this.model.attributes.id;

			this._initBuyerDetails();
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
			this.model.fetch();
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
			this.model.fetch();
		},

		buyersClicked: function() {
		},

		_initBuyerDetails: function() {
			var buyerIds = this.model.attributes.buyers;
			buyerIds.push(this.model.attributes.owner);

			// var buyerQueries = [];
			var buyerObjects = new Backbone.Collection([], {});
			
			_.each(buyerIds, function(currentId) {
				var requestUrl = Utils.getFacebookApiLink(currentId);
				var pictureUrl = requestUrl + '/picture';
				// buyerQueries.push($.ajax({
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
				// }));
			});
			
			// var that = this;
			// $.when(buyerQueries).done(function() {
				// var buyerFragment = document.createDocumentFragment();
			// 	$('div.item-buyers', that.$el).popover({
			// 		selector: '#' + this.id,
			// 		title: 'Hoorah',
			// 		content: 'Yay'
			// 	});
			// 	$('div.item-buyers', that.$el).popover('show');
			// });

			this.buyersView = new Views.BuyersListing({
				collection: buyerObjects,
				el: this.$('.buyer-popover')
			});
		}
	});

	Views.BuyerView = Backbone.View.extend({
		template: _.template('<a href="<%= link %>"><%= name %></a>'),

		render: function() {
			var formatted = this.template(this.model.attributes);
			this.$el.html(formatted);
			return this;
		}
	});
	
	Views.BuyersListing = Views.GenericCollectionView.extend({
		subView: Views.BuyerView,
		_appendFragmentToDocument: function(fragment) {
			this.$el.html(fragment);
		}
	});

	Views.ListingView = Views.GenericCollectionView.extend({
		_appendFragmentToDocument: function(fragment) {
			this.$('.item-listing').html(fragment);
		},
		subView: Views.ItemView
	});

	return Views;
});