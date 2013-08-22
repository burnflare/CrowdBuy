var Models = {};
Models.ItemListing = Backbone.Model.extend({
	defaults: {
		id: '',
		name: '',
		price: '',
		location: '',
		buyers: [],
		owner: '',
		imageUrl: ''
	},
	initialize: function() {

	}
});

Models.ItemListings = Backbone.Collection.extend({
	model: Models.ItemListing
});