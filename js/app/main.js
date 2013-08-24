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
    //searchCollection = new Models.SearchResults();
    
	yourCollection = new Models.Wants();
	friendCollection = new Models.Wants();
	featuredCollection = new Models.Wants();
	publicCollection = new Models.Wants();
    
    /*searchFormView = new Views.SearchFormView({
        el: document.getElementById('search-section'),
        id: "search"
    });*/
    
    /*searchListingView = new Views.SearchListingView({
        collection: searchCollection,
        el: document.getElementById('search-results'),
        id: "search-results"
    });*/

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

	yourCollection.fetch({ data: $.param({ type:'you' }) });
    friendCollection.fetch({ data: $.param({ type:'friend' }) });
    featuredCollection.fetch({ data: $.param({ type:'featured' }) });
    publicCollection.fetch({ data: $.param({ type:'public' }) });

	FB.api('/me', function(response) {
		$('#welcome').html('Welcome, ' + response.name + '!');
	});
}