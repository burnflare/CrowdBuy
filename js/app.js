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
		},
		'jquery-ui': {
			deps: ["jquery"],
			exports: '$'
		}
	},
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"jquery-ui": "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
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

		'utils': 'app/utils',
        
        'routes': 'app/routes'
	}
});

requirejs(["jquery", "underscore", "backbone", "views", "utils", 'routes', 'bootstrap'], function($, _, Backbone, Views, Utils, Routes) {

	// Create a loading indicator. Inspired by
	// http://tbranyen.com/post/how-to-indicate-backbone-fetch-progress
	_.each(["Model", "Collection"], function(name) {
		// Cache Backbone constructor.
		var ctor = Backbone[name];
		// Cache original fetch and set.
		var fetch = ctor.prototype.fetch;

		// Override the fetch method to emit a fetch event.
		ctor.prototype.fetch = function() {
			// Trigger the fetch event on the instance.
			this.trigger("fetch", this);

			// Pass through to original fetch.
			var result = fetch.apply(this, arguments);
			var that = this;
			result.success(function() {
				that.trigger("fetched", that);
			});
			return result;
		};
	});

	var App = _.extend({
		appId: '509825915758193',
        
        routes: new Routes(),

		init: function() {
			FB.init({
				appId: this.appId,
				channelUrl: '//crowdbuy.sapuan.org/channel.html',
				oauth: true,
				xfbml: true
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

			var that = this;
			$('#recommend-to-friends').click(function() { that.recommendToFriends(); })
			$('#add-to-timeline').click(function() { that.addToTimeline(); });
			$('#privacy-policy').click(function() { $('#privacy-policy-modal').modal('show'); });
            
            Backbone.history.start();
		},

		recommendToFriends: function() {
			var that = this;
			FB.ui({method: 'apprequests',
				message: 'Come join me in using CrowdBuy, and make group ordering easy.'
			}, function(response) {
				
			});
		},

		addToTimeline: function() {
			var permissionsUrlPromise = Utils.getFacebookCustomSectionsLink(this.appId);
			permissionsUrlPromise.done(function(response) {
				window.open(response.profile_section_url, '_blank');
			});
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