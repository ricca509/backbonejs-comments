var mongoose = require('mongoose');  

mongoose.connect('mongodb://localhost/backbone-comments');	

// Comments collection
var CommentSchema = new mongoose.Schema({
	text     		: String,
	like      		: Number,
	dislike      	: Number,
	creationDate    : {type: Date, default: Date.now}
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
	Comment: Comment
};
