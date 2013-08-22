var Views = {};
Views.ListingView = Backbone.View.extend({
	initialise: function() {
		this.listenTo(this.collection, "change", this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});

Views.ItemView = Backbone.View.extend({
	template: Templates.ItemListingTemplate,
	initialise: function() {
		this.listenTo(this.model, "change", this.render);
		this.id = "item-" + this.model.attributes.id;
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});