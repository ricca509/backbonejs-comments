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
	})
	
};

// Return a single comment
var getOne = function(req, res) {
	var resp = {
		id : req.params.id
	};
	res.type('application/json');
    res.send(200, resp);
};

// Adds a comment
var add = function(req, res) {					
  	var comment = new CommentsModel.Comment({
  		text: req.body.text,
  		like: 0,
  		dislike: 0	  		
  	});

  	comment.save(function (err, comm) {  		
		if (err) {
			res.type('text/plain');
			res.send(500);
		}

		res.type('application/json');
		res.send(200, comm);
	});			
};

// Updates a single comment
var update = function(req, res) {
	var comment = req.body;	
	res.type('application/json');
    res.send(200, comment);
};

// Deletes a single comment
var del = function(req, res) {	
	res.type('application/json');
    res.send(200, req.params.id);
};

module.exports = {
	getOne: getOne,
	getAll: getAll,
	add: add,
	update: update,
	delete: del
};