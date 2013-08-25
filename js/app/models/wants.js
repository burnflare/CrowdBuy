define(['jquery', 'underscore', 'backbone', ' model_want'], function($, _, Backbone, Models) {
	Models.Wants = Backbone.Collection.extend({
	    url: '/service/me/wants',
		model: Models.Want
	});
    console.log(Models);
	return Models;
});