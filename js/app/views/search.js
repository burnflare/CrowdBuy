define(['jquery', 'underscore', 'backbone', 
	'text!./app/views/templates/search-form.html', 
	'text!./app/views/templates/search-empty.html', 
	'text!./app/views/templates/search-listing.html',
	'models'], function($, _, Backbone, searchFormTemplate, emptySearchTemplate, searchListingTemplate, Models) {
	var Views = {};

	Views.SearchView = Backbone.View.extend({
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

			if (this.childViews.length > 0) {
				_(this.childViews).each(function(currentView) {
					fragment.appendChild(currentView.render().el);
				});
			} else {
				$(emptySearchTemplate).appendTo(fragment);
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
    
	Views.SearchForm = Backbone.View.extend({
		template: _.template(searchFormTemplate),

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
			var search = $('#txt-search').val();
			this.searchCollection.url = '/service/products/search/' + escape(search);
			this.searchCollection.fetch({
			    success: function(results) {
        			$('#lbl-search').text(search);
        			$('#search-results').show();
			    }
			});
			this.searchListingView.render();
		},

		initialize: function() {
			this.render();
			this.searchCollection = new Models.SearchResults();
			this.searchListingView = new Views.SearchListing({
				collection: this.searchCollection,
				el: '#search-results',
				id: 'search-results'
			});
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	return Views;
});