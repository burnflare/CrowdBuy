requirejs.config({
	shim: {
		'facebook': {
			export: 'FB'
		},
		'backbone': {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		'underscore': {
			exports: "_"
		}
	},
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"facebook": "//connect.facebook.net/en_US/all",
		"underscore": "libs/underscore.min",
		"backbone": "libs/backbone.min",
		"json": "libs/json2",
		"text": "libs/text",

		'models': 'app/models/modelIndex',
		'model_want': 'app/models/want',
		'model_wants': 'app/models/wants',
		'model_search_item': 'app/models/searchItem',
		'model_search_results': 'app/models/searchResults',

		'views': 'app/views/viewIndex',
		'view_main': 'app/views/main',
		'view_search': 'app/views/search',

		'utils': 'app/utils'
	}
});

requirejs(["jquery", "underscore", "backbone", "views", "utils"], function($, _, Backbone, Views, Utils) {

	// Global Dispatcher from http://www.michikono.com/2012/01/11/adding-a-centralized-event-dispatcher-on-backbone-js/
	(function() {
		var dispatcher;
		if (this.isExtended) {
			return;
		}
		dispatcher = _.extend({}, Backbone.Events, {
			cid: "dispatcher"
		});
		return _.each([Backbone.Collection.prototype, Backbone.Model.prototype, Backbone.View.prototype, Backbone.Router.prototype], function(proto) {
			return _.extend(proto, {
				global_dispatcher: dispatcher
			});
		});
	})();


	var App = _.extend({
		init: function() {
			this.loadHome();

			this.SearchPane = new Views.SearchForm({
				el: '#search-bar',
				id: 'search'
			});

			this.listenTo(this.global_dispatcher, 'goHome', this.loadHome);
		},

		loadHome: function() {
			this.view = Views.Main;
			Utils.loadView(this.view);
		}

	}, Backbone.Events);
	App.init();


});