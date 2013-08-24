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
        productId: '',
        category: '',
        name: '',
        price: '',
    }
	initialize: function() {

	}
});

Models.SearchResults = Backbone.Model.extend({
    url: '/service/products/results/',
    model: Models.SearchItem
});