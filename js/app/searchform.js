define(['jquery', 'underscore', 'backbone', 'text!../../templates/search-form.html'], function($, _, Backbone, searchFormTemplate) {
	var SearchForm = Backbone.View.extend({
		template: _.template(searchFormTemplate),

		events: {
			"click a#btn-search": "searchClick"
		},

		searchClick: function() {
			var search = $('#txt-search').val();
			$('#search-results').show();
			this.searchCollection.fetch({
				data: $.param({
					search: search
				})
			});
		},

		initialize: function() {
			this.searchCollection = new Models.SearchResults();
			this.searchListingView = new Views.SearchListingView({
				collection: this.searchCollection,
				el: '#search-results',
				id: 'search-results'
			});
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});

	return SearchForm;
});