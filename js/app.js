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
		"text": "libs/text"
	}
});

requirejs(["jquery", "underscore", "backbone", "app/main", "app/searchform"], function($, _, Backbone, Main, SearchForm) {
	new Main({
		el: $('#page-content')
	});
	new SearchForm({
		el: $('search-section')
	});
});