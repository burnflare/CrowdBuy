define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Models = {};
	Models.Want = Backbone.Model.extend({
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

	return Models;
});