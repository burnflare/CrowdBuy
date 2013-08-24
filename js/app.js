requirejs.config({
	"baseUrl": "js/lib",
	shim: {
		'facebook' : {
			export: 'FB'
		}
	},
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
		"text": "text.js",
		"underscore": "underscore.min.js",
		"backbone": "backbone.min.js",
		"facebook": "//connect.facebook.net/en_US/all"
	}
});

requirejs(["jquery", "text", "underscore", "backbone", "fb"], function($, _, Backbone, FB, App) {
	new App({
		el: $('#application');
	})
});