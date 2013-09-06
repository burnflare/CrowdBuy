define(['jquery', 'underscore', 'backbone', 'models', 'utils', 'view_common'], function($, _, Backbone, Models, Utils, Views) {
    return Backbone.Router.extend({
        routes: {
            'listings/:id': 'showListing'
        },
        
        initialize: function() {
            
        },
        
        showListing: function(id) {
            this.item = new Models.Want([], {
                url: '/service/listings/get/' + id
            });
            
            this.modal = new Views.ViewItemModal({
				model: this.item,
				el: '#route-modal-container'
			});
        }
    });
});