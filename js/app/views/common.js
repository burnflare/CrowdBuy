define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing.html',
	'text!./app/views/templates/item-listing-empty.html',
	'text!./app/views/templates/person-info.html',
	'text!./app/views/templates/loading.html',
	'models', 'utils', 'facebook', 'view_common'
], function($, _, Backbone, mainTemplate, itemListingTemplate, itemListingEmptyTemplate, personInfoTemplate, defaultLoadingTemplate, Models, Utils) {
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
		personInfoTemplate: _.template(personInfoTemplate),

		events: {
			"click button#btn-pledge": 'pledgeClicked',
			"click button#btn-unpledge": 'unpledgeClicked',
			"click div.item-buyers": "buyersClicked"
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
			if (this._buyerListPopover) {
				this._buyerListPopover.popover('toggle');
				return;
			}

			var buyerIds = this.model.attributes.buyers;
			buyerIds.push(this.model.attributes.owner);
			var buyerQueries = [];
			var buyerObjects = new Backbone.Collection([], {

			});
			_.each(buyerIds, function(currentId) {
				var requestUrl = Utils.getFacebookApiLink(currentId);
				var pictureUrl = requestUrl + '/picture';
				buyerQueries.push($.ajax({
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
				}));
			});
			
			var that = this;
			$.when.apply($, buyerQueries)
			.done(function() {
				var buyerFragment = document.createElement('div');
				for (var i = 0; i < buyerObjects.length; ++i) {
					$(that.personInfoTemplate(buyerObjects.models[i].attributes)).
						appendTo(buyerFragment);
				}
				
				$('a', buyerFragment).tooltip();
				that._buyerListPopover = $('div.item-buyers span.item-buyers-list', that.$el);
				that._buyerListPopover.parents('div.item-listing').on('scroll', function() {
					if (that._buyerListPopover) {
						that._buyerListPopover.popover('hide');
					}
				});
				that._buyerListPopover.popover({
					selector: '#' + this.id,
					title: 'Hoorah',
					html: true,
					content: buyerFragment,
					container: that._buyerListPopover,
					toggle: 'trigger'
				});
				that._buyerListPopover.popover('show');
			});
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