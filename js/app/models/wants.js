define(['jquery', 'underscore', 'backbone', 'model_want'], function($, _, Backbone, Models) {
	Models.Wants = Backbone.Collection.extend({
		model: Models.Want,
		initialize: function() {
			this.fetch();
		}
	});
	return Models;
});