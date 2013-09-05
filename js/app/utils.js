define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
	var Utils = {};

	Utils.urlencode = function(str) {
		// http://kevin.vanzonneveld.net
		// +   original by: Philip Peterson
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: AJ
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: travc
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: Lars Fischer
		// +      input by: Ratheous
		// +      reimplemented by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Joris
		// +      reimplemented by: Brett Zamir (http://brett-zamir.me)
		// %          note 1: This reflects PHP 5.3/6.0+ behavior
		// %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
		// %        note 2: pages served as UTF-8
		// *     example 1: urlencode('Kevin van Zonneveld!');
		// *     returns 1: 'Kevin+van+Zonneveld%21'
		// *     example 2: urlencode('http://kevin.vanzonneveld.net/');
		// *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
		// *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
		// *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
		str = (str + '').toString();

		// Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
		// PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
				replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
	};

	Utils.logIn = function() {
		$.ajax({
			url: '/service/me/login',
			async: false,
			dataType: 'json'
		});
	};

	Utils.loadView = function(viewToLoad, userId) {
		$('#page-content').html("");
		if (typeof viewToLoad === 'function') {
			displayedView = new viewToLoad({
				el: '#page-content',
				'userId': userId
			});
		} else {
			viewToLoad.setElement('#page-content');
			viewToLoad.userId = userId;
			viewToLoad.render();
			displayedView = viewToLoad;
		}
		return displayedView;
	};

	Utils.getFacebookApiLink = function(userId) {
		return '//graph.facebook.com/' + userId;
	};
	
	/**
	 * Requests the user's permission to have the following app permissions.
	 * @param Array or string perms
	 * @return A Promise object.
	 */
	Utils.requestFbPermission = function(perms) {
		if (!(perms instanceof Array)) {
			perms = [perms];
		}
		
		var promise = $.Deferred();
		FB.login(function(response) {
			promise.resolve(response);
		}, {
			scope: perms.join(', ')
		});
		
		return promise;
	};
	
	/**
	 * Posts a "want" to the user's Graph.
	 * 
	 * @returns a Promise object.
	 */
	Utils.postUserTimeline = function(productId) {
		var promise = $.Deferred();
		FB.api('me/crowdbuyfb:want_to_purchase', 'post',
			{
				item: 'http://fb.sapuan.org/service/products/og/' +
					productId
			},
			function(response) {
				promise.resolve(response);
			}
		);
  
		return promise;
	};

	Utils.dropTimeFromIsoDate = function(isoDateString) {
		var dropIndex = isoDateString.indexOf(" ");
		var dateParsed = isoDateString.slice(0, dropIndex);
		return dateParsed;
	};

	return Utils;
});