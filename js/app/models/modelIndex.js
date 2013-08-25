define(['jquery', 'underscore', 'backbone', 'model_want', 'model_wants', 'model_search_item', 'model_search_results'], function($, _, Backbone) {

	var Models = {};
    
    console.log(Models);

	// Load all the models we have.
	for (var i = 3; i < arguments.length; i++) {
		_.extend(Models, arguments[i]);
	}
    
    console.log(Models);
    
	return Models;
});