define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing-empty.html',
	'models', 'facebook'], function($, _, Backbone, mainTemplate, itemListingEmptyTemplate, Models) {
	var Views = {};
	Views.Main = Backbone.View.extend({
		initialize: function() {
			this.$el.html(_.template(mainTemplate, {}));

			FB.init({
				appId: '509825915758193',
				channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
			});

			$('#loginbutton,#feedbutton').removeAttr('disabled');

			FB.getLoginStatus((function(that) {
				return function(response) {
					if (response.status === 'connected') {
						// Handle authentication here.

						FB.api('/me', function(response) {
							$('#welcome').html('Welcome, ' + response.name + '!');
						});
						that._setUpCollections();
					} else {
						alert("Whoa, something went wrong! Try refreshing this page.");
					}

				};
			})(this));
		},

		_setUpCollections: function() {
			yourCollection = new Models.Wants();
			friendCollection = new Models.Wants();
			featuredCollection = new Models.Wants();
			publicCollection = new Models.Wants();
            
			yourView = new Views.ListingView({
                collection: yourCollection,
				el: document.getElementById('you-section'),
				id: "you"
			});

			friendView = new Views.ListingView({
                collection: friendCollection,
				el: document.getElementById('friend-section'),
				id: "friend"
			});

			featuredView = new Views.ListingView({
                collection: featuredCollection,
				el: document.getElementById('featured-section'),
				id: "featured"
			});

			publicView = new Views.ListingView({
                collection: publicCollection,
				el: document.getElementById('public-section'),
				id: "public"
			});
            
            yourView.url = '/service/me/want/your';
            friendView.url = '/service/me/want/friend';
            featuredView.url = '/service/me/want/feature';
            publicView.url = '/service/me/want/public';

			yourCollection.fetch();
			friendCollection.fetch();
			featuredCollection.fetch();
			publicCollection.fetch();
		}
	});

	Views.ListingView = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			this.childViews = [];

			this._addAllModels();
		},

		events: {
			"click span#add-item": "addItemClick"
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
			this._addViewForModel(item);
			this.render();
		},

		collectionRemoved: function(item) {
			this.childViews = this.childViews.filter(function(view) {
				return view.model.id !== item.id;
			});
			this.render();
		},

		collectionChanged: function() {
			this.childViews = [];
			this._addAllModels();
		},

		addItemClick: function() {

		},

		_addViewForModel: function(item) {
			this.childViews.push(new Views.ItemView({
				model: item
			}));
		},

		_addAllModels: function() {
			this.collection.each(function(item) {
				_addViewForModel(item);
			});
			this.render();
		}
	});

	return Views;
});