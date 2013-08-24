define(['jquery', 'underscore', 'backbone', 'text!./app/views/templates/main.html', 'models', 'facebook'], function($, _, Backbone, mainTemplate, Models) {
		var Views = {};
		Views.Main = Backbone.View.extend({
				initialize: function() {
					this.$el.html(_.template(mainTemplate, {}));

					FB.init({
						appId: '509825915758193',
						channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
					});

					$('#loginbutton,#feedbutton').removeAttr('disabled');

					FB.getLoginStatus((function(that) {
						return function(response) {
							if (response.status === 'connected') {
								// Handle authentication here.

								FB.api('/me', function(response) {
									$('#welcome').html('Welcome, ' + response.name + '!');
								});
								that._setUpCollections();
							} else {
								alert("Whoa, something went wrong! Try refreshing this page.");
							}
						}
					})(this));
				}
			},

			_authenticationCallback: function(response) {},

			_setUpCollections: function() {
				yourCollection = new Models.Wants();
				friendCollection = new Models.Wants();
				featuredCollection = new Models.Wants();
				publicCollection = new Models.Wants();

				yourView = new Views.ListingView({
					collection: yourCollection,
					el: document.getElementById('you-section'),
					id: "you"
				});

				friendView = new Views.ListingView({
					collection: friendCollection,
					el: document.getElementById('friend-section'),
					id: "friend"
				});

				featuredView = new Views.ListingView({
					collection: featuredCollection,
					el: document.getElementById('featured-section'),
					id: "featured"
				});

				publicView = new Views.ListingView({
					collection: publicCollection,
					el: document.getElementById('public-section'),
					id: "public"
				});

				yourCollection.fetch({
					data: $.param({
						type: 'you'
					})
				});
				friendCollection.fetch({
					data: $.param({
						type: 'friend'
					})
				});
				featuredCollection.fetch({
					data: $.param({
						type: 'featured'
					})
				});
				publicCollection.fetch({
					data: $.param({
						type: 'public'
					})
				});
			}
		});

	return Views;
});