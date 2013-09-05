define(['jquery', 'underscore', 'backbone', 'models', 'utils', 'view_common'], function($, _, Backbone, Models, Utils, Views) {
    return Backbone.Router.extend({
        routes: {
            'listing/:id': 'showListing'
        },
        
        initialize: function() {
            
        },
        
        showListing: function(id) {
            console.log(id);
            
            this.item = new Models.Want({
                url: '/service/listings/get/' + id
            });
            
            this.item.fetch({
                success: function(results) {
                    console.log(results);
                }
            });
            
			this.modal = new Views.ViewItemModal({
				model: this.item,
				el: '#modal-container'
			});
        }
    });
});