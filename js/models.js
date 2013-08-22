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
	}
	initialize: function() {

	}
});