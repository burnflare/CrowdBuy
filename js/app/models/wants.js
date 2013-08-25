define(['jquery', 'underscore', 'backbone', 'model_want', 'utils'], function($, _, Backbone, Models, Utils) {
	Models.Wants = Backbone.Collection.extend({
		model: Models.Want,
		initialize: function() {
			this.fetch({
				dataType: 'json',
				success: function(model, response, options) {
					console.log(response);
				},
				error: function(model, response, options) {
					console.log(response);
				}
			});
		}
	});
	return Models;
});