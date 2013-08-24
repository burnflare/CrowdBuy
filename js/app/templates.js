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
Templates.SearchFormTemplate = _.template('\
    <div class="background-panel">\
    	<div class="input-group">\
    		<input id="txt-search" type="text" class="form-control" placeholder="What do you want to buy?" />\
    		<a id="btn-search" class="input-group-addon btn">Find it!</a>\
    	</div>\
    </div>\
    <div id="search-results" style="display:none">\
    	<div class="row">\
    		<div id="search-section" class="col-sm-12 section">\
    			<h3 class="section-header">\
    				SEARCH RESULTS FOR &quot;<span id="lbl-search"></span>&quot;\
    			</h3>\
    			<div id="search-listing" class="item-listing">\
		            \
    			</div>\
    		</div>\
    	</div>\
    </div>\
    ');
Templates.SearchListingTemplate = _.template('\
	<div class="item media">\
		<div class="media-body">\
			<h3 class="media-heading"><%= name %></h3>\
			<div class="item-price"><span class="glyphicon glyphicon-usd"></span><%= price %></div>\
		</div>\
		<div class="pull-right btn-group-vertical">\
			<button type="button" id="btn-pledge" class="btn btn-default pull-right">I\'m in!</button>\
		</div>\
	</div>');
Templates.EmptySearchTemplate = _.template('\
	<div class="item">\
		<h3 class="centered">There are no search results :(</h3>\
	</div>\
	');