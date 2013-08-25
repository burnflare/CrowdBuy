define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
	var Utils = {};

	Utils.logIn = function() {
		$.ajax({
			url: '/service/me/login',
			async: false,
			dataType: 'json'
		});
	};

	Utils.loadView = function(viewToLoad) {
		$('#page-content').html();
		if (typeof viewToLoad === 'function') {
			new viewToLoad({
				el: '#page-content'
			});
		} else {
			viewToLoad.el = '#page-content';
			viewToLoad.render();
		}
	};

	return Utils;
});