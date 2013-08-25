requirejs.config({
	shim: {
		'facebook' : {
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

	var App = _.extend({
		init: function() {
			this.loadHome();

			this.SearchPane = new Views.SearchForm({
				el: '#search-bar',
				id: 'search'
			});

			this.listenTo(this.SearchPane, 'changeView', this.changeView);
			this.listenTo(this.SearchPane, 'goHome', this.loadHome);
			this.listenTo(this.view, 'changeView', this.changeView);
		},

		loadHome: function() {
			this.view = Views.Main;
			Utils.loadView(this.view);
		},

		changeView: function(newView) {
			this.view = newView;
			this.listenTo(newView, 'changeView', this.changeView);
			this.listenTo(newView, 'goHome', this.loadHome);
		}

	}, Backbone.Events);
    App.init();


});