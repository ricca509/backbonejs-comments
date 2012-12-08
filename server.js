var express = require('express'),
	path = require('path'),
	comments = require('./controllers/comments');

var app = express();

// Set server port
app.set('port', process.env.PORT || 3000);  
// Set folder to serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
// Log routes
app.use(express.logger());
app.use(express.bodyParser());

// REST API routes definition
// GET to /comments returns all comments
app.get('/comments', comments.getAll);
// GET to /comments/:id returns a single comment
app.get('/comments/:id', comments.getOne);
// POST to /comments adds a comment
app.post('/comments', comments.add);
// PUT to /comments/:id modifies an existing comment
app.put('/comments/:id', comments.update);
// DELETE to /comments/:id deletes an existing comment
app.delete('/comments/:id', comments.delete);

app.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
});