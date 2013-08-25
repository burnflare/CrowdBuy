define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/search-empty.html',
	'text!./app/views/templates/search-listing.html',
	'text!./app/views/templates/search-listings.html',
	'text!./app/views/templates/add-listing.html',
	'models', 'utils'], function($, _, Backbone, emptySearchTemplate, searchListingTemplate, searchContainerTemplate, addListingTemplate, Models, Utils) {
	var Views = {};

	Views.AddItemModal = Backbone.View.extend({
		template: _.template(addListingTemplate),

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
		},

		events: {
			"click button.btn-success": "submitRequest"
		},

		submitRequest: function() {
			var city = $('select.form-control').val();
			var country = $('#inputPickupCity').val();
			var locationCombined = city + ", " + country;

			// JS uses milliseconds, we need seconds.
			var dateStart = Date.now() / 1000;

			var inputDate = $('#inputExpiryDate').val();
			var dateEnd = (new Date(inputDate)).getTime() / 1000;

			$.post('/service/listing/create', {
				product_id: this.model.attributes.id,
				date_start: dateStart,
				date_expire: dateEnd,
				location: locationCombined
			});

			$('#add-listing-modal').modal('hide');
		}
	});

	Views.SearchResult = Backbone.View.extend({
		template: _.template(searchListingTemplate),

		events: {
			"click a.search-result": "clickResult"
		},

		clickResult: function() {
			var modal = new Views.AddItemModal({
				model: this.model,
				el: '#modal-container'
			});
			$('#add-listing-modal').modal('show');
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
			var escapedSearchTerm = Utils.urlencode(Utils.urlencode(this.options.searchTerm));
			var productSearchUrl = '/service/products/search/' + escapedSearchTerm;
			var productResultCollection = new Models.ProductSearchResults([], {
				url: productSearchUrl
			});
			this.productSearchResultView = new Views.SearchResultListing({
				collection: productResultCollection
			});

			var listingSearchUrl = ' /service/listing/search/' + escapedSearchTerm;
			var listingResultCollection = new Models.Wants([], {
				url: listingSearchUrl
			});
			this.listingSearchResultView = new Views.SearchResultListing({
				collection: listingResultCollection
			});

			this.render();
		},

		render: function() {
			this.$el.html(_.template(searchContainerTemplate, {
				searchTerm: this.options.searchTerm
			}));

			this.productSearchResultView.setElement('#product-listing');
			this.productSearchResultView.render();

			this.listingSearchResultView.setElement('#request-listing');
			this.listingSearchResultView.render();

			$('#search-section').fadeIn();
		},

		clickClose: function() {
			this.trigger("goHome");
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

			this.trigger('changeView', searchListingView);
		},

		initialize: function() {}
	});

	return Views;
});