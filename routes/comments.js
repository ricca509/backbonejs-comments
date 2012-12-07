var mongoose = require('mongoose'),	
	CommentsModel = require('../models/comments.js');

// Returns all comments
var getAll = function(req, res) {
	CommentsModel.Comment.find({}, function (err, comments) {
		if (err) {
			console.log('error');
		}
		console.log(comments);
		console.log('comments')
		res.type('application/json');
	    res.send(200, comments);
	});
	
};

// Return a single comment
var getOne = function(req, res) {
	CommentsModel.Comment.findById(req.params.id, function (err, comment) {
		if (err) {
			console.log('Error searching the comment...');
		}
	
		res.type('application/json');
		res.send(200, comment);
	});					
};

// Adds a comment
var add = function(req, res) {					
  	var comment = new CommentsModel.Comment({
  		text: req.body.text,
  		like: 0,
  		dislike: 0,
  		creationDate: new Date()
  	});

  	comment.save(function (err, comm) {  		
		if (err) {
			res.type('text/plain');
			res.send(500, "Error saving the comment");
		}

		res.type('application/json');
		res.send(200, comm);
	});			
};

// Updates a single comment
var update = function(req, res) {
	CommentsModel.Comment.findById(req.params.id, function (err, comment) {
		if (err) {
			console.log('Error searching the comment...');
		}

		// Update the comment
		comment.like = req.body.like;
		comment.dislike = req.body.dislike;

		// Save the modified comment
		comment.save(function (err, comm) {  		
			if (err) {
				res.type('text/plain');
				res.send(500, "Error saving the comment");
			}

			res.type('application/json');
			res.send(200, comm);
		});				
	});

};

// Deletes a single comment
var del = function(req, res) {	
	CommentsModel.Comment.findById(req.params.id, function(err, comment) {
		comment.remove(function(err, comm) {
			if (err) {
				res.type('text/plain');
				res.send(500, "Error removing the comment");
			}
			res.type('application/json');
			res.send(200, "");
		});
	});	
};

module.exports = {
	getOne: getOne,
	getAll: getAll,
	add: add,
	update: update,
	delete: del
};