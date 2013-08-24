var Models = {};
Models.Want = Backbone.Model.extend({
    url: '/service/me/want',
	defaults: {
		id: '',
		name: '',
		price: '',
		location: '',
		buyers: [],
		owner: '',
		imageUrl: '',
		dateStart: '',
		dateExpire: ''
	},
	initialize: function() {

	}
});

Models.Wants = Backbone.Collection.extend({
    url: '/service/me/wants',
	model: Models.ItemListing
});

Models.SearchItem = Backbone.Model.extend({
    defaults: {
        id: '',
        category: '',
        name: '',
        price: ''
    },
	initialize: function() {

	},
    parse: function(response, options) {
        return response;
    }
});

Models.SearchResults = Backbone.Collection.extend({
    url: '/service/products/results/',
    model: Models.SearchItem,
    parse: function(response, options) {
        return response.result.results;
    }
});