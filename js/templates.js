var Templates = {};

Templates.ItemListingTemplate = _.template('\
	<div class="item media">\
		<img class="pull-left" src="<%= imageUrl %>" />\
		<div class="media-body">\
			<h3 class="media-heading"><%= name %></h3>\
			<dv class="item-location"><strong>Location:</strong> <%= location %></div>\
			<div class="item-price"><%= price %></div>\
			<div class="item-buyers"><%= buyers.length %></div>\
		</div>\
	</div>');