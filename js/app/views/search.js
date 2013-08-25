define(['jquery', 'underscore', 'backbone', 
	'text!./app/views/templates/search-empty.html', 
	'text!./app/views/templates/search-listing.html',
	'text!./app/views/templates/search-listings.html',
	'models', 'utils'], function($, _, Backbone, emptySearchTemplate, searchListingTemplate, searchContainerTemplate, Models, Utils) {
	var Views = {};

	Views.SearchResult = Backbone.View.extend({
		template: _.template(searchListingTemplate),

		events: {
			"click button#btn-pledge": "pledgeClick"
		},

		pledgeClick: function() {

		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "search-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});
    
	Views.SearchResultListing = Backbone.View.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			this.childViews = [];

			this._addAllModels();
		},

		render: function() {
			var fragment = document.createDocumentFragment();

			if (this.childViews.length > 0) {
				_(this.childViews).each(function(currentView) {
					fragment.appendChild(currentView.render().el);
				});
			} else {
				$(emptySearchTemplate).appendTo(fragment);
			}

			this.$el.html(fragment);
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
			this.childViews.push(new Views.SearchResult({
				model: item
			}));
		},

		_addAllModels: function() {
			var that = this;
			this.collection.each(function(item) {
				that._addViewForModel(item);
			});
			this.render();
		}
	});

	Views.SearchSession = Backbone.View.extend({
		events: {
			"click button.close": "clickClose"
		},
		initialize: function() {
			var searchUrl = '/service/products/search/' + Utils.urlencode(Utils.urlencode(this.options.searchTerm));
			var resultCollection = new Models.SearchResults();
			resultCollection.url = searchUrl;
			resultCollection.fetch();
			this.searchResultView = new Views.SearchResultListing({
				collection: resultCollection
			});
			this.render();
		},

		render: function() {
			this.$el.html(_.template(searchContainerTemplate, { 
				searchTerm: this.options.searchTerm
			}));

			this.searchResultView.setElement('#search-listing');
			this.searchResultView.render();

			$('#search-section').fadeIn();
		},

		clickClose: function() {
			this.trigger("goHome");
			this.remove();
		}
	});
    
	Views.SearchForm = Backbone.View.extend({
		events: {
			"click a#btn-search": "searchClick",
            "keypress input[type=text]": "keypress"
		},
        
        keypress: function(e) {
            switch (e.keyCode) {
                case 13:
                this.searchClick();
            }
        },

		searchClick: function() {
			var searchListingView = new Views.SearchSession({
				searchTerm: $('#txt-search').val()
			});

			Utils.loadView(searchListingView);
		},

		initialize: function() {}
	});

	return Views;
});