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

	Utils.loadView(Views.Main);
    
    new Views.SearchForm({
		el: '#search-section',
		id: 'search'
	});
});