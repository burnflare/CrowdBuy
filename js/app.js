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

	var App = _.extend({
		init: function() {
			FB.init({
				appId: '509825915758193',
				channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
			});
			FB.login(function() {}, {
				scope: 'read_friendlists, user_about_me'
			});

			$('#loginbutton,#feedbutton').removeAttr('disabled');

			FB.getLoginStatus((function(that) {
				return function(response) {
					if (response.status === 'connected') {
						// Handle authentication here.
						Utils.logIn();

						FB.api('/me', function(response) {
							var welcomeString = that._randomWelcome();
							$('#welcome').html(welcomeString + response.first_name + '!');
						});
					} else {
						alert("Whoa, something went wrong! Try refreshing this page.");
					}

				};
			})(this));

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
				this.stopListening(this.view);
			}
			this.view = Utils.loadView(newView);
			this.listenTo(this.view, 'changeView', this.changeView);
			this.listenTo(this.view, 'goHome', this.loadHome);
		},

		_randomWelcome: function() {
			var welcomeMessages = ["Welcome, ", "Hey ", "Hello ", "Hi "];
			var rand = Math.floor(Math.random() * 4);
			return welcomeMessages[rand];
		}

	}, Backbone.Events);
	App.init();


});