var Models = {};
Models.ItemListing = Backbone.Model.extend({
	defaults: {
		id: '',
		name: '',
		price: '',
		location: '',
		buyers: [],
		owner: ''
	}
	initialize: function() {

	}
});