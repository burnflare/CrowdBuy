var Templates = {};

Templates.ItemListingTemplate = _.template('\
	<div class="item media">\
		<img class="pull-left" src="<%= imageUrl %>" />\
		<div class="media-body">\
			<h3 class="media-heading"><%= name %></h3>\
			<div class="item-location"><span class="glyphicon glyphicon-globe"></span> <%= location %></div>\
			<div class="item-price"><span class="glyphicon glyphicon-usd"></span><%= price %></div>\
			<div class="item-buyers"><%= buyers.length %></div>\
		</div>\
	</div>');