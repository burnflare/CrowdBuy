var Views = {};
Views.ListingView = Backbone.View.extend({
	initialise: function() {
		this.listenTo(this.collection, "add", this.render);
		this.listenTo(this.collection, "change", this.render);
		this.listenTo(this.collection, "remove", this.render);
		this.childViews = [];
	},

	render: function() {
		this.childViews = [];

		var fragment = document.createDocumentFragment();

		var currentChildView;
		var that = this;
		this.collection.each(function(currentModel) {
			currentChildView = new Views.ItemView({
				model: currentModel
			});
			that.childViews.push(currentChildView);
			fragment.appendChild(currentChildView.render().el);
		});

		this.$el.html(fragment);
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