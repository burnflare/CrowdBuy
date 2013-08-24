requirejs.config({
	"baseUrl": "js/lib",
	"paths": {
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
		"text": "text.js",
		"underscore": "underscore.min.js",
		"backbone": "backbone.min.js",
		"app": "../app"
	}
});

requirejs(["jquery", "text", "underscore", "backbone", "app/main"],);