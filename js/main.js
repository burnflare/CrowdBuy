$(function() {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/all.js', function(){
		FB.init({
		  appId: '509825915758193',
		  channelUrl: '//http://crowdbuy.sapuan.org/channel.html',
		});     
		
		$('#loginbutton,#feedbutton').removeAttr('disabled');

		FB.getLoginStatus(authenticationCallback);
	});
});

function authenticationCallback(response) {
	if (response.status === 'connected') {
		// Handle authentication here.
		setUpBackbone();
	} else {
		alert("Whoa, something went wrong! Try refreshing this page.");
	}
}

function setUpBackbone() {
	yourCollection = new Models.ItemListings();
	friendCollection = new Models.ItemListings();
	featuredCollection = new Models.ItemListings();
	publicCollection = new Models.ItemListings();

	yourView = new Views.ListingView({
		collection: yourCollection,
		el: document.getElementById('you-section'),
		id: "you"
	});

	friendView = new Views.ListingView({
		collection: friendCollection,
		el: document.getElementById('friend-section'),
		id: "friend"
	});

	featuredView = new Views.ListingView({
		collection: featuredCollection,
		el: document.getElementById('featured-section'),
		id: "featured"
	});

	publicView = new Views.ListingView({
		collection: publicCollection,
		el: document.getElementById('public-section'),
		id: "public"
	});

	yourCollection.add({
		id: 0,
		name: "Test Item",
		price: "5.00 (USD)",
		location: "Singapore",
		buyers: [0],
		owner: 0,
		imageUrl: 'http://placehold.it/96x96',
		dateStart: new Date(2013, 8, 23),
		dateEnd: new Date(2013, 9, 22)
	});
	friendCollection.add({
		id: 1,
		name: "Another Item",
		price: "25.00 (USD)",
		location: "Singapore",
		buyers: [0, 1, 2],
		owner:  1,
		imageUrl: 'http://placehold.it/96x96',
		dateStart: new Date(2013, 8, 22),
		dateEnd: new Date(2013, 9, 16)
	});

	FB.api('/me', function(response) {
		$('#welcome').html('Welcome, ' + response.name + '!');
	});
}