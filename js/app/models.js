var Models = {};

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
        price: ''
    },
	initialize: function() {

	}
});

Models.SearchResults = Backbone.Collection.extend({
    url: '/service/products/results/',
    model: Models.SearchItem
});