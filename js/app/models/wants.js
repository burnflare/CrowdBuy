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
		},

		comparator: function(first, second) {
			var dateValue1 = first.get("dateStart");
			var dateValue2 = second.get("dateStart");

			var firstDate = Date.parse(dateValue1);
			var secondDate = Date.parse(dateValue2);

			var difference = secondDate - firstDate;
			if (difference > 0) {
				return 1;
			} else if (difference == 0) {
				return 0;
			} else {
				return -1;
			}
		}
	});
	return Models;
});