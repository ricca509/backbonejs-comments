var getAll = function(req, res) {
	res.type('application/json');
    res.send(200, "");
};

var getOne = function(req, res) {
	var resp = {
		id : req.params.id
	};
	res.type('application/json');
    res.send(200, resp);
};

var add = function(req, res) {
	var comment = req.body;
	comment.id = parseInt(Math.random() * 100);
	res.type('application/json');
    res.send(200, comment);
};

var update = function(req, res) {
	var comment = req.body;	
	res.type('application/json');
    res.send(200, comment);
};

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