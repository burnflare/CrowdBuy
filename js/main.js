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

	yourView = new Views.ListingView({
		collection: yourCollection,
		el: document.getElementById('you-listing')
	});

	yourCollection.add(testModel);
});
