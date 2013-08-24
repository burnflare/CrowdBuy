var Views = {};
Views.ListingView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'add', this.collectionAdded);
		this.listenTo(this.collection, 'change', this.collectionChanged);
		this.listenTo(this.collection, 'remove', this.collectionRemoved);
		
		this.childViews = [];

		this._addAllModels();
	},

	events: {
		"click span#add-item" : "addItemClick"
	},

	render: function() {
		var fragment = document.createDocumentFragment();

		if(this.childViews.length > 0) {
			_(this.childViews).each(function(currentView) {
				fragment.appendChild(currentView.render().el);
			});
		} else {
			$(Templates.EmptyListingTemplate()).appendTo(fragment);
		}

		this.$('.item-listing').html(fragment);
		return this;
	},

	collectionAdded: function(item) {
		this._addViewForModel(item);
		this.render();
	},

	collectionRemoved: function(item) {
		this.childViews = this.childViews.filter(function(view) {
			return view.model.id !== item.id;
		});
		this.render();
	},

	collectionChanged: function() {
		this.childViews = [];
		this._addAllModels();
	},

	addItemClick: function() {
		
	},

	_addViewForModel: function(item) {
		this.childViews.push(new Views.ItemView({
			model: item
		}));
	},

	_addAllModels: function() {
		this.collection.each(function(item) {
			_addViewForModel(item);
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

Views.SearchFormView = Backbone.View.extend({
	template: Templates.SearchFormTemplate,

	events: {
		"click a#btn-search" : "searchClick"
	},

	searchClick: function() {
		alert('hello');
	},
    
	initialize: function() {
		
	},
    
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

Views.SearchListingView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'add', this.collectionAdded);
		this.listenTo(this.collection, 'change', this.collectionChanged);
		this.listenTo(this.collection, 'remove', this.collectionRemoved);
		
		this.childViews = [];

		this._addAllModels();
	},

	render: function() {
		var fragment = document.createDocumentFragment();
		this.$('.item-listing').html(fragment);
		return this;
	},

	collectionAdded: function(item) {
		this._addViewForModel(item);
		this.render();
	},

	collectionRemoved: function(item) {
		this.childViews = this.childViews.filter(function(view) {
			return view.model.id !== item.id;
		});
		this.render();
	},

	collectionChanged: function() {
		this.childViews = [];
		this._addAllModels();
	},

	_addViewForModel: function(item) {
		this.childViews.push(new Views.SearchView({
			model: item
		}));
	},

	_addAllModels: function() {
		this.collection.each(function(item) {
			_addViewForModel(item);
		});
		this.render();
	}
});

Views.SearchView = Backbone.View.extend({
	template: Templates.SearchListingTemplate,

	events: {
		"click button#btn-pledge" : "pledgeClick"
	},

	pledgeClick: function() {
		
	},

	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.id = "item-" + this.model.attributes.id;
	},
    
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.id = "search-" + this.model.attributes.id;
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});