define(['jquery', 'underscore', 'backbone', 'text!../../templates/login.html', 'facebook'], function($, _, Backbone, loginTemplate, FB) {
	FB.init({
		appId: '509825915758193',
		channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
	});
	FB.login(function(response) {
		if (response.status !== 'connected') {
			FB.login();
		}
	}, {
	    scope: 'read_friendlists'
	});

	var Login = Backbone.View.extend({
		initialize: function() {
			this.$el.html(_.template(loginTemplate, {}));
		}
	});

	return Login;
});