var Models = {};

Models.SearchResults = Backbone.Collection.extend({
    url: '/service/products/results/',
    model: Models.SearchItem
});