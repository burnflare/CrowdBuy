
	var testModel = new Models.ItemListing({
		id: 0,
		name: "Test Item",
		price: "(USD) $5",
		location: "Singapore",
		buyers: [0],
		owner: 0,
		imageUrl: 'http://placehold.it/96x96'
	});

	var yourCollection = new Models.ItemListings();

	var yourView = new Views.ListingView({
		collection: yourCollection,
		id: "you-listing"
	});

	yourCollection.add(testModel);
