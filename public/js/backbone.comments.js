/**
 * backbone.comments.js
 * http://www.riccardocoppola.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Riccardo Coppola
 * http://www.riccardocoppola.com
 */
'use strict';
// Create a namespace for our app,
// every object will be attached to this
// to keep a well-defined scope
var app = app || {};

// The code of the enter key
// on the keyboard, will be used to 
// check if the user presses the enter key
app.ENTER = 13;

// Comment model
// This model will hold data
// and custom methods for a single comment
app.Comment = Backbone.Model.extend({
	initialize: function() {
		// Register to the 'add' event of the model.
		// Every time a model is created, an 'add' event is fired
		// automatically from the Backbone engine. We use this
		// event to handle the new model by adding dynamically generated
		// parameters (e.g. the creation date)
		this.on('add', this.addHandler, this);
	},		

	idAttribute: '_id',

	// Every time a new model is created we add dafault values to some
	// or every parameter. 
	defaults: {
		like: 0,
		dislike: 0		
	},

	// Validation method: every time a property is set on the model,
	// the validation is performed
	validate: function(attributes) {
		var errors = [];

		if (attributes.text === "") {
			errors.push('Insert a text for the comment');
		}

		if (errors.length !== 0) {
			return errors;
		}
	},

	// The url to call for any interaction with the server
	urlRoot: '/comments',

	// We use this method to add
	// dynamically generated values to the 
	// newly added model
	addHandler: function() {
		// Example: you could set a date 
		// for every new model
		if (this.isNew()) {
			this.set({
				creationDate: new Date()
			});
		}			
	},

	// Move all the code that modifies the model into
	// the model itself and call the code from the views
	addLike: function() {
		var likeN = this.get('like') - 0;
		likeN++;
		this.set({
			like: likeN
		});
	},

	addDislike: function() {
		var dislikeN = this.get('dislike') - 0;
		dislikeN++;
		this.set({
			dislike: dislikeN
		});
	}

});

// Comments collection
// This collection will hold the list of comments
app.Comments = Backbone.Collection.extend({
	model: app.Comment,
	// The url to call for any interaction with the server
	url: '/comments'
});

// Add comment view
// Represents the view that makes it possible to add comments
// We use an already existin
app.AddCommentView = Backbone.View.extend({
	initialize: function() {
		
	},

	// Bind events to view methods
	events : {
		'click #btnAddComment': 'add',
		'keypress #appendedInputButton': 'checkKey',
		'focusin #appendedInputButton': 'widenTextbox',
		'focusout #appendedInputButton': 'narrowTextbox',
	},

	checkKey: function(ev) {
		// Check if enter key pressed and add a comment
		if (ev.keyCode === app.ENTER) {
			this.add();
	    }
	},

	widenTextbox: function() {
		this.$('#appendedInputButton').animate({
			'width': '90%'
		});
	},

	narrowTextbox: function() {
		this.$('#appendedInputButton').animate({
			'width': '40%'
		});
	},

	initForm: function() {
		this.$('#appendedInputButton').val('');
		this.$('#appendedInputButton').focus();
	},

	add : function() {
		var comment = new app.Comment({
			text: this.$('#appendedInputButton').val()			
		});
		
		// Call the server and add to collection		
		this.collection.create(comment);
		this.initForm();
	}
});

// Comment View
// Represents a single comment
app.CommentView = Backbone.View.extend({
	tagName: 'div',

	className: 'comment',

	events: {
		'click .like': 'like',
		'click .dislike': 'dislike',
		'hover': 'hover',
		'click .close': 'remove'
	},

	// Cache the underscore template
	template: _.template($('#comment-tmpl').html()),

	initialize: function() {
		// Register to any changes of the model
		// and re-render itself every time automatically
		this.model.on('change', this.render, this);
	},

	render: function() {		
		// Just change the element represented by this view			
		// Call the template function by passing
		// the json of the model
		this.$el.html(this.template(this.model.toJSON()));

		// Return the view object to make chainable call
		return this;
	},

	hover: function() {
		
	},

	like: function() {	
		// The view doesn't change anything in the model:
		// it just call models' methods to make changes happen,
		// the model is responsible to change its own attributes
		this.model.addLike();		

		this.model.save();
	},

	dislike: function() {
		this.model.addDislike();	

		this.model.save();	
	},

	// Remove the element from the DOM and destroy the model 
	// (it removes the model from the collection too)	
	remove: function() {
		var that = this;
		this.model.destroy();

		this.$el.fadeOut('slow', function() {
			that.$el.remove();
		});		
	}
});

// Comments count view
// Represent the comment counter
app.CommentsCountView = Backbone.View.extend({
	tagName: 'div',

	className: 'well',

	initialize: function() {
		// We want to react at every change in the comments
		// collection and re-render the view
		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
		this.collection.on('reset', this.render, this);
		// Auto-rendered view
		this.render();
	},

	template: _.template($('#comments-count-tmpl').html()),

	render: function() {		
		var attributes = {
			commentsCount: this.collection.length
		};

		this.$el.html(this.template(attributes));

		return this;
	}
});


// App view 
// We use the AppView to bootstrap the application
// and render the views for the first time
app.AppView = Backbone.View.extend({
	initialize: function() {
		// At every 'add' event of the collection, call the addOneComment method
		this.collection.on('add', this.addOneComment, this);
		// At every 'reset' event of the collection, call the addAllComments method
		this.collection.on('reset', this.addAllComments, this);

		this.render();
	},

	render: function() {
		app.commentsCountView = new app.CommentsCountView({
			collection: app.comments
		});

		$('#commentsCountCountainer').append(app.commentsCountView.render().$el);

		app.addCommentView = new app.AddCommentView({
			collection: app.comments
		});
		app.addCommentView.setElement($('#add-comment'));
	},

	addAllComments: function() {
		var that = this;
		this.collection.each(that.addOneComment);
	},

	addOneComment: function(comment) {
		var commentV = new app.CommentView({
			model: comment
		});

		$('#commentsContainer').prepend(commentV.render().$el.fadeIn('slow'));
	}
});

// Self invoking function that starts the app
(function() {
	// Create the collection
	app.comments = new app.Comments();	

	app.appView = new app.AppView({
		collection: app.comments
	});	

	// Fetch data from the server
	app.comments.fetch();

}());

