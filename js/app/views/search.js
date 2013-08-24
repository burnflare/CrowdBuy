define(['jquery', 'underscore', 'backbone', 'text!./app/views/templates/search-form.html', 'models'], function($, _, Backbone, searchFormTemplate, Models) {
	var Views = {};

	Views.SearchForm = Backbone.View.extend({
		template: _.template(searchFormTemplate),

		events: {
			"click a#btn-search": "searchClick"
		},

		searchClick: function() {
			var search = $('#txt-search').val();
			$('#search-results').show();
			this.searchCollection.fetch({
				data: $.param({
					search: search
				})
			});
		},

		initialize: function() {
			this.searchCollection = new Models.SearchResults();
			this.searchListingView = new Views.SearchListing({
				collection: this.searchCollection,
				el: '#search-results',
				id: 'search-results'
			});
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	Views.SearchListing = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			this.childViews = [];

			this._addAllModels();
		},

		render: function() {
			var fragment = document.createDocumentFragment();
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

		_addViewForModel: function(item) {
			this.childViews.push(new Views.SearchView({
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