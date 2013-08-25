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
			FB.init({
				appId: '509825915758193',
				channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
			});
			FB.login(function() {}, { scope: 'read_friendlists, user_about_me' });

			$('#loginbutton,#feedbutton').removeAttr('disabled');
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
			this.changeView(Views.Main);
		},

		changeView: function(newView) {
			if (typeof this.view !== 'undefined') {
				this.view.remove();
			}
			this.view = Utils.loadView(newView);
			this.listenTo(this.view, 'changeView', this.changeView);
			this.listenTo(this.view, 'goHome', this.loadHome);
		}

	}, Backbone.Events);
    App.init();


});