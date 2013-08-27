define(['jquery', 'underscore', 'backbone', 'model_want', 'utils'], function($, _, Backbone, Models, Utils) {
	Models.Wants = Backbone.Collection.extend({
		model: Models.Want,
		initialize: function() {
			this.fetch({
				dataType: 'json',
				success: function(model, response, options) {
					
				},
				error: function(model, response, options) {
					if (response.status === 403) {
						Utils.logIn();
					}
				}
			});
		},
		parse: function(response) {
			return response.listings;
		}
	});
	return Models;
});