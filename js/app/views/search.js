define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/search-empty.html',
	'text!./app/views/templates/search-listing.html',
	'text!./app/views/templates/search-listings.html',
	'text!./app/views/templates/add-listing.html',
	'models', 'utils', 'view_common'], function($, _, Backbone, emptySearchTemplate, searchListingTemplate, searchContainerTemplate, addListingTemplate, Models, Utils, Views) {
	Views.AddItemModal = Backbone.View.extend({
		template: _.template(addListingTemplate),

		initialize: function() {
			FB.api('/me', function(resp) {
				var locationParts = resp.location.name.split(', ');
				for (var i = locationParts.length - 1; i >= 0; --i) {
					$('#country').val(locationParts[i]);
					if ($('#country').val()) {
						break;
					}
				}
			});
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
		},

		events: {
			"click button.btn-success": "submitRequest",
			"click button.btn-danger": "closeModal"
		},

		submitRequest: function() {
			var country = $('select.form-control').val();
			var city = $('#inputPickupCity').val();
			var locationCombined = city + ", " + country;

			// JS uses milliseconds, we need seconds.
			var dateStart = Math.floor(Date.now() / 1000);

			var inputDate = $('#inputExpiryDate').val();
			var dateEnd = (new Date(inputDate)).getTime() / 1000;

			var that = this;
			$.ajax({
				url: '/service/listings/create',
				dataType: 'json',
				type: 'POST',
				data: {
					product_id: this.model.attributes.id,
					date_start: dateStart,
					date_expire: dateEnd,
					location: locationCombined
				},
				success: function() {
					$('#add-listing-modal').modal('hide');
					that.trigger("viewClosed");
				},
				error: function() {
					alert("Oops, something went wrong. Try sending your request again!");
				}
			});
		},

		closeModal: function() {
			this.trigger("viewClosed");
		}
	});

	Views.SearchResult = Backbone.View.extend({
		template: _.template(searchListingTemplate),

		events: {
			"click a.search-result": "clickResult"
		},

		clickResult: function() {
			if (this.modal) {
				this.disposeModal();
			}

			this.modal = new Views.AddItemModal({
				model: this.model,
				el: '#modal-container'
			});
			this.listenTo(this.modal, 'viewClosed', this.disposeModal);
			$('#add-listing-modal').modal('show');
		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "search-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		disposeModal: function() {
			this.modal.undelegateEvents();
		}
	});

	Views.SearchResultListing = Views.ListingView.extend({
		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			this.childViews = [];

			this._addAllModels();
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
		},
		
		_appendFragmentToDocument: function(fragment) {
			this.$el.html(fragment);
		},
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

			var listingSearchUrl = '/service/listings/search/' + escapedSearchTerm;
			var listingResultCollection = new Models.Wants([], {
				url: listingSearchUrl
			});
			this.listingSearchResultView = new Views.ListingView({
				collection: listingResultCollection,
				'userId': this.options.userId
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
				searchTerm: $('#txt-search').val(),
				userId: this.options.userId
			});

			this.trigger('changeView', searchListingView);
		},

		initialize: function() {}
	});

	return Views;
});