requirejs.config({
	shim: {
		'facebook' : {
			export: 'FB'
		}
	},
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		"facebook": "//connect.facebook.net/en_US/all",
		"underscore": "libs/underscore.min",
		"backbone": "libs/backbone.min",
		"json": "libs/json2",
		"text": "libs/text"
	}
});

requirejs(["jquery", "underscore", "backbone", "app/login"], function($, _, Backbone, Login) {
	new Login({
		el: $('#application')
	});
});