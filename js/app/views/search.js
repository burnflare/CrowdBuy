define(['jquery', 'underscore', 'backbone', 
	'text!./app/views/templates/search-form.html', 
	'text!./app/views/templates/search-empty.html', 
	'text!./app/views/templates/search-listing.html',
	'models'], function($, _, Backbone, searchFormTemplate, emptySearchTemplate, searchListingTemplate, Models) {
	var Views = {};
    
    function urlencode (str) {
      // http://kevin.vanzonneveld.net
      // +   original by: Philip Peterson
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: AJ
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: travc
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Lars Fischer
      // +      input by: Ratheous
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Joris
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // %          note 1: This reflects PHP 5.3/6.0+ behavior
      // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
      // %        note 2: pages served as UTF-8
      // *     example 1: urlencode('Kevin van Zonneveld!');
      // *     returns 1: 'Kevin+van+Zonneveld%21'
      // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
      // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
      // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
      // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
      str = (str + '').toString();

      // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
      // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
      return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
      replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
    }

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
			$('#search-results').show();
			var search = $('#txt-search').val();
			this.searchCollection.url = '/service/products/search/' + urlencode(urlencode(search));
			this.searchCollection.fetch({
				success: function(results) {
					$('#lbl-search').text(search);
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