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
		},
		'bootstrap': {
			deps: ["jquery"]
		}
	},
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"facebook": "//connect.facebook.net/en_US/all",
		"underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min",
		"backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min",
		"json": "//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.min",
		"text": "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min",
		'bootstrap': '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.0/js/bootstrap.min',

		'models': 'app/models/modelIndex',
		'model_want': 'app/models/want',
		'model_wants': 'app/models/wants',
		'model_search_item': 'app/models/searchItem',
		'model_search_results': 'app/models/searchResults',

		'views': 'app/views/viewIndex',
		'view_common': 'app/views/common',
		'view_main': 'app/views/main',
		'view_search': 'app/views/search',

		'utils': 'app/utils'
	}
});

requirejs(["jquery", "underscore", "backbone", "views", "utils", 'bootstrap'], function($, _, Backbone, Views, Utils) {

	var App = _.extend({
		init: function() {
			FB.init({
				appId: '509825915758193',
				channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
				oauth: true
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
							that.userId = response.id;
							$('#welcome').html(welcomeString + response.first_name + '!');

							if (that.view) {
								that.view.userId = response.id;
							}
							
							that._continueInit();
						});

					} else {
						alert("Whoa, something went wrong! Try refreshing this page.");
					}

				};
			})(this));
		},

		loadHome: function() {
			this.changeView(Views.Main);
		},

		changeView: function(newView) {
			if (typeof this.view !== 'undefined') {
				this.stopListening(this.view);
			}
			this.view = Utils.loadView(newView, this.userId);
			this.listenTo(this.view, 'changeView', this.changeView);
			this.listenTo(this.view, 'goHome', this.loadHome);
		},

		_randomWelcome: function() {
			var welcomeMessages = ["Welcome, ", "Hey ", "Hello ", "Hi "];
			var rand = Math.floor(Math.random() * 4);
			return welcomeMessages[rand];
		},

		_continueInit: function() {
			this.loadHome();

			this.SearchPane = new Views.SearchForm({
				el: '#search-bar',
				id: 'search',
				userId: this.userId
			});

			this.listenTo(this.SearchPane, 'changeView', this.changeView);
			this.listenTo(this.SearchPane, 'goHome', this.loadHome);
			this.listenTo(this.view, 'changeView', this.changeView);
		}

	}, Backbone.Events);
	App.init();


});