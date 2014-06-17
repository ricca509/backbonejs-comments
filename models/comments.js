var mongoose = require('mongoose');

mongoose.connect('mongodb://comments:comments@ds029207.mongolab.com:29207/comments');	

// Comments collection
var CommentSchema = new mongoose.Schema({
	text     		: String,
	like      		: Number,
	dislike      	: Number,
	creationDate    : Date
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
	Comment: Comment
};
