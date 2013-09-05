define(['jquery', 'underscore', 'backbone', 'models', 'utils', 'view_common'], function($, _, Backbone, Models, Utils, Views) {
    return Backbone.Router.extend({
        routes: {
            'listing/:id': 'showListing'
        },
        
        initialize: function() {
            
        },
        
        showListing: function(id) {
            that = this;
            
            this.item = new Models.Want({
                id: id
            });
            
            this.item.fetch({
                success: function(results) {
                    
                }
            });
            
            this.modal = new Views.ViewItemModal({
				model: this.item,
				el: '#route-modal-container'
			});
        }
    });
});