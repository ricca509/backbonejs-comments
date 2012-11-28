'use strict';
// Namespace
var app = app || {};

// Comment model
app.Comment = Backbone.Model.extend({
	urlRoot: '/comments',

	defaults: {
		like: 0,
		dislike: 0
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
	model: app.Comment,	

	initialize: function() {	
	}	
});

// Add comment view
app.AddCommentView = Backbone.View.extend({
	events : {
		'click #btnAddComment': 'add',
		'keypress #appendedInputButton': 'checkKey'
	},

	checkKey: function(ev) {
		// Check if enter key pressed and add a comment
		if (ev.keyCode === 13) {
			this.add();
	    }
	},

	add : function() {
		var comment = new app.Comment({
			text: this.$('#appendedInputButton').val(),
			creationDate: new Date()
		});
		
		// Add to collection
		this.collection.add(comment);

		this.$('#appendedInputButton').val('');
		this.$('#appendedInputButton').focus();
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

		this.render();
	},

	dislike: function() {
		this.model.addDislike();

		this.render();
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
	initialize: function() {
		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
		// Auto-rendered view
		this.render();
	},

	render: function() {
		$('#commentsCount').html(this.collection.size());
	}
});


// App view 
app.AppView = Backbone.View.extend({
	initialize: function() {
		this.collection.on('add', this.addComment, this);
	},

	addComment: function(comment) {
		var commentV = new app.CommentView({
			model: comment
		});

		$('#commentsContainer').append(commentV.render().el);
	}
});

app.init = function() {
	// Create the collection
	app.comments = new app.Comments();

	app.commentsCountView = new app.CommentsCountView({
		collection: app.comments
	});

	app.addCommentView = new app.AddCommentView({
		collection: app.comments
	});
	app.addCommentView.setElement($('#add-comment'));

	app.appView = new app.AppView({
		collection: app.comments
	});	

};

