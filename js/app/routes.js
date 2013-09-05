define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    return Backbone.Router.extend({
        routes: {
            'listing/:id': 'showListing'
        },
        
        initialize: function() {
            
        },
        
        showListing: function(id) {
            
        }
    });
});