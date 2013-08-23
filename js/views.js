var Views = {};
Views.ListingView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'add', this.collectionAdded);
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this.collection, 'remove', this.collectionRemoved);
		
		this.childViews = [];

		var that = this;
		this.collection.each(function(item) {
			that.collectionAdded(item);
		});
	},

	render: function() {
		var fragment = document.createDocumentFragment();

		_(this.childViews).each(function(currentView) {
			fragment.appendChild(currentView.render().el);
		});

		this.$('.item-listing').html(fragment);
		return this;
	},

	collectionAdded: function(item) {
		this.childViews.push(new Views.ItemView({
			model: item
		}));
		this.render();
	},

	collectionRemoved: function(item) {
		this.childViews = this.childViews.filter(function(view) {
			return view.model.id !== item.id;
		});
		this.render();
	}
});

Views.ItemView = Backbone.View.extend({
	template: Templates.ItemListingTemplate,

	events: {
		"click button#btn-pledge" : "pledgeClick"
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