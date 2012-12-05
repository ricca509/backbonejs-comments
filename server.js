var express = require('express'),
	path = require('path'),
	comments = require('./routes/comments');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
});

// REST API
app.get('/comments', comments.getAll);
app.get('/comments/:id', comments.getOne);
app.post('/comments', comments.add);
app.put('/comments/:id', comments.update);
app.delete('/comments/:id', comments.delete);

app.listen(app.get('port'), function() {
	console.log('Server started');
});