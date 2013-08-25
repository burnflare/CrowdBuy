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

			FB.init({
				appId: '509825915758193',
				channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
			});
			FB.login(function() {}, { scope: 'read_friendlists, user_about_me' });

			$('#loginbutton,#feedbutton').removeAttr('disabled');

			FB.getLoginStatus((function(that) {
				return function(response) {
					if (response.status === 'connected') {
						// Handle authentication here.
						Utils.logIn(response);

						FB.api('/me', function(response) {
							var welcomeString = that._randomWelcome();
							$('#welcome').html(welcomeString + response.first_name + '!');
						});
						that._setUpCollections();
					} else {
						alert("Whoa, something went wrong! Try refreshing this page.");
					}

				};
			})(this));
		},

		_setUpCollections: function() {
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
		},

		_randomWelcome: function() {
			var welcomeMessages = ["Welcome, ", "Hey ", "Hello ", "Hi "];
			var rand = Math.floor(Math.random() * 4);
			return welcomeMessages[rand];
		}
	});

	Views.ItemView = Backbone.View.extend({
		template: _.template(itemListingTemplate),

		events: {
			"click button#btn-pledge": "pledgeClick"
		},

		pledgeClick: function() {

		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "item-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
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