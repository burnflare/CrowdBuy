define(['jquery', 'underscore', 'backbone',
	'text!./app/views/templates/main.html',
	'text!./app/views/templates/item-listing.html',
	'text!./app/views/templates/item-listing-empty.html',
	'text!./app/views/templates/person-info.html',
	'text!./app/views/templates/loading.html',
	'text!./app/views/templates/delete-modal.html',
	'models', 'utils', 'facebook', 'view_common'
], function($, _, Backbone, mainTemplate, itemListingTemplate, itemListingEmptyTemplate, personInfoTemplate, defaultLoadingTemplate,
	deleteModalTemplate, Models, Utils) {
	var Views = {};

	Views.GenericCollectionView = Backbone.View.extend({
		loadingTemplate: defaultLoadingTemplate,

		initialize: function() {
			this.listenTo(this.collection, 'add', this.collectionAdded);
			this.listenTo(this.collection, 'change', this.collectionChanged);
			this.listenTo(this.collection, 'remove', this.collectionRemoved);

			var that = this;
			this.listenTo(this.collection, 'fetched', function() {
				that._loaded = true;
				that.render();
			});

			this.childViews = [];
			this.render();
		},

		render: function() {
			var fragment = document.createDocumentFragment();

			if (!this._loaded) {
				$(this.loadingTemplate).appendTo(fragment);
			} else if (this.childViews.length > 0) {
				_(this.childViews).each(function(currentView) {
					fragment.appendChild(currentView.render().el);
				});
			} else {
				$(itemListingEmptyTemplate).appendTo(fragment);
			}

			this._appendFragmentToDocument(fragment);
			return this;
		},

		collectionAdded: function(item) {
			var that = this;
			item.set({
				userId: that.options.userId
			});
			this._addViewForModel(item);
			this.render();
		},

		collectionRemoved: function(item) {
			this.childViews = this.childViews.filter(function(view) {
				return view.model.id !== item.id;
			});
			this.render();
		},

		collectionChanged: function(item) {
			if (!item.changed.userId) {
				this.childViews = [];
				this._addAllModels();
			}
		},

		_addViewForModel: function(item) {
			this.childViews.push(new this.subView({
				model: item
			}));
		},

		_addAllModels: function() {
			var that = this;
			this.collection.each(function(item) {
				item.set({
					userId: that.options.userId
				});
				that._addViewForModel(item);
			});
			this.render();
		}
	});

	Views.ItemView = Backbone.View.extend({
		template: _.template(itemListingTemplate),
		personInfoTemplate: _.template(personInfoTemplate),

		events: {
			"click button#btn-pledge": 'pledgeClicked',
			"click button#btn-unpledge": 'unpledgeClicked',
			"click button#btn-delete": 'deleteClicked',
			"click div.item-buyers": "buyersClicked"
		},

		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.id = "item-" + this.model.attributes.id;
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this;
		},

		pledgeClicked: function() {
			var that = this;
			$.ajax({
				url: '/service/me/want',
				dataType: 'json',
				type: 'POST',
				data: {
					product_listing_id: this.model.attributes.id
				}
			}).success(function() {
				FB.api('me/crowdbuyfb:want_to_purchase', 'post',
					{
					  item: 'http://fb.sapuan.org/service/products/og/' + that.model.attributes.productId
					},
					function(response) {
					  // handle the response
					}
				  );
			});
			this.model.fetch();
		},

		unpledgeClicked: function() {
			$.ajax({
				url: '/service/me/dontWant',
				dataType: 'json',
				type: 'POST',
				data: {
					product_listing_id: this.model.attributes.id
				}
			});
			this.model.fetch();
		},

		buyersClicked: function() {
			if (this._buyerListPopover) {
				//We only handle this once.
				return;
			}

			var buyerIds = this.model.attributes.buyers;
			buyerIds.push(this.model.attributes.owner);
			var buyerQueries = [];
			var buyerObjects = new Backbone.Collection([], {

			});
			_.each(buyerIds, function(currentId) {
				var requestUrl = Utils.getFacebookApiLink(currentId);
				var pictureUrl = requestUrl + '/picture';
				buyerQueries.push($.ajax({
					url: requestUrl,
					dataType: 'json',
					type: 'GET',
					success: function(response) {
						buyerObjects.add({
							name: response.name,
							link: response.link || '//www.facebook.com/' + response.id,
							picture: pictureUrl
						});
					}
				}));
			});

			var that = this;
			$.when.apply($, buyerQueries)
				.done(function() {
					function handlePopoverClick(e) {
						if (!that._buyerListPopover) {
							return;
						}

						var target = e.target || e.toElement;
						if (target === that._buyerListPopover[0]) {
							//We are going to ourself.
							that._buyerListPopover.popover('toggle');
						} else {
							dismissPopover();
						}
					}

					function dismissPopover() {
						if (that._buyerListPopover) {
							that._buyerListPopover.popover('hide');
						}
					}

					var buyerFragment = document.createElement('div');
					for (var i = 0; i < buyerObjects.length; ++i) {
						$(that.personInfoTemplate(buyerObjects.models[i].attributes)).
						appendTo(buyerFragment);
					}

					$('a', buyerFragment).tooltip();
					that._buyerListPopover = $('div.item-buyers span.item-buyers-list', that.$el);
					that._buyerListPopover.parents('div.item-listing').on('scroll', dismissPopover);
					$(document).on('click', handlePopoverClick);
					that._buyerListPopover.popover({
						selector: '#' + this.id,
						html: true,
						content: buyerFragment,
						container: that._buyerListPopover,
						toggle: 'trigger'
					});
					that._buyerListPopover.popover('show');
				});
		},

		deleteClicked: function() {
			if (this.modal) {
				this.disposeModal();
			}

			this.modal = new Views.DeleteListingView({
				model: this.model,
				el: '#modal-container'
			});
			this.listenTo(this.modal, 'viewClosed', this.disposeModal);
		},

		disposeModal: function(isDeleted) {
			this.modal.undelegateEvents();

			if (isDeleted) {
				this.model.trigger("destroy");
			}
		}
	});

	Views.DeleteListingView = Backbone.View.extend({
		template: _.template(deleteModalTemplate),

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.attributes));
			$('#delete-warning-modal').modal('show');
		},

		events: {
			"click button.btn-danger": "deleteClicked",
			"click button.btn-success": "keepClicked"
		},

		deleteClicked: function() {
			var serviceUrl = '/service/listings/delete/' + this.model.attributes.id;

			var that = this;
			$.ajax({
				url: serviceUrl,
				dataType: 'json',
				type: 'GET',
				success: function() {
					that.dismissModal(true);
				},
				error: function() {
					alert("Oops. We couldn't delete the listing - try again later!");
				}
			});
		},

		keepClicked: function() {
			this.dismissModal(false);
		},

		dismissModal: function(isDeleted) {
			$('#delete-warning-modal').modal('hide');
			this.trigger("viewClosed", isDeleted);
		}
	});

	Views.ListingView = Views.GenericCollectionView.extend({
		_appendFragmentToDocument: function(fragment) {
			this.$('.item-listing').html(fragment);
		},
		subView: Views.ItemView
	});

	return Views;
});