define(['jquery', 'underscore', 'backbone', 'text!./app/views/templates/item-listing.html'], function($, _, Backbone, itemListingTemplate) {
	var Views = {};
	Views.ItemView = Backbone.View.extend({
		template: _.template(itemListingTemplate),

		events: {
			"click button#btn-pledge": "pledgeClick"
		},

		pledgeClick: function() {

		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "item-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});

	return Views;
});