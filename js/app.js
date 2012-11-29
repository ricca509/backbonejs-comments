'use strict';
// Namespace
var app = app || {};

app.ENTER = 13;

// Comment model
app.Comment = Backbone.Model.extend({
	initialize: function() {
		this.on('add', this.addHandler, this);
	},	

	defaults: {
		like: 0,
		dislike: 0		
	},

	urlRoot: '/comments',

	// I use this method to add
	// dynamically generated values to the 
	// newly added model
	addHandler: function() {
		this.set({
			creationDate: new Date()
		});
	},

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
app.Comments = Backbone.Collection.extend({
	model: app.Comment	
});

// Add comment view
app.AddCommentView = Backbone.View.extend({
	initialize: function() {
		//setTimeout(this.initForm, 200);		
	},

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
		// ATM there's no server implementation,
		// this is only for demonstration
		this.collection.create(comment);
		this.initForm();
	}
});

// Comment View
app.CommentView = Backbone.View.extend({
	tagName: 'div',

	className: 'comment',

	events: {
		'click .like': 'like',
		'click .dislike': 'dislike',
		'hover': 'hover',
		'click .close': 'remove'
	},

	template: _.template($('#comment-tmpl').html()),

	initialize: function() {
		this.model.on('change', this.render, this);
	},

	render: function() {
		var that = this;				

		// Call the template function by passing
		// the json of the model
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	hover: function() {
		
	},

	like: function() {	 
		this.model.addLike();		
	},

	dislike: function() {
		this.model.addDislike();		
	},

	remove: function() {
		var that = this;
		this.model.destroy();

		this.$el.fadeOut('slow', function() {
			that.$el.remove();
		});		
	}
});

// Comments count view
app.CommentsCountView = Backbone.View.extend({
	tagName: 'div',

	className: 'well',

	initialize: function() {
		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
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

		/*if (this.collection.length > 0) {
			$('#lastComment').html(this.collection.at(this.collection.length - 1).get('creationDate') + "");
		}*/
	}
});


// App view 
app.AppView = Backbone.View.extend({
	initialize: function() {
		this.collection.on('add', this.addComment, this);

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

	addComment: function(comment) {
		var commentV = new app.CommentView({
			model: comment
		});

		$('#commentsContainer').append(commentV.render().$el.fadeIn('slow'));
	}
});

app.init = (function() {
	// Create the collection
	app.comments = new app.Comments();	

	app.appView = new app.AppView({
		collection: app.comments
	});	

}());

