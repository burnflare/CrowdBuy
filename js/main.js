$(function() {
	testModel = new Models.ItemListing({
		id: 0,
		name: "Test Item",
		price: "(USD) $5",
		location: "Singapore",
		buyers: [0],
		owner: 0,
		imageUrl: 'http://placehold.it/96x96'
	});

	yourCollection = new Models.ItemListings();
	friendCollection = new Models.ItemListings();
	featuredCollection = new Models.ItemListings();
	publicCollection = new Models.ItemListings();

	yourView = new Views.ListingView({
		collection: yourCollection,
		el: $('#you-listing')[0]
	});

	friendView = new Views.ListingView({
		collection: friendCollection,
		el: $('#friend-listing')[0]
	});

	featuredView = new Views.ListingView({
		collection: featuredCollection,
		el: $('#featured-listing')[0]
	});

	publicView = new Views.ListingView({
		collection: publicCollection,
		el: $('#public-listing')[0]
	})

	yourCollection.add(testModel);
});
