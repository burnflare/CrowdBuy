var Templates = {};

Templates.ItemListingTemplate = _.template('\
	<div class="item media">\
		<img class="pull-left" src="<%= imageUrl %>" />\
		<div class="media-body">\
			<h3 class="media-heading"><%= name %></h3>\
			<div class="item-expiry"><span class="glyphicon glyphicon-calendar"></span><%= dateEnd.toDateString() %></div>\
			<div class="item-location"><span class="glyphicon glyphicon-globe"></span><%= location %></div>\
			<div class="item-price"><span class="glyphicon glyphicon-usd"></span><%= price %></div>\
			<div class="item-buyers"><span class="glyphicon glyphicon-user"></span><%= buyers.length %> \
			<% if(buyers.length == 1) { %> buyer <% } else { %> buyers <% } %></div>\
		</div>\
		<div class="pull-right btn-group-vertical">\
			<button type="button" id="btn-pledge" class="btn btn-default pull-right">I\'m in!</button>\
		</div>\
	</div>');

Templates.EmptyListingTemplate = _.template('\
	<div class="item">\
		<h3 class="centered">Nothing\'s here yet. :(</h3>\
	</div>\
	');