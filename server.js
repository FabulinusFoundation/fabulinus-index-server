var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','logo.ico')));


app.get('/', function (req, res) {
	res.sendFile('public/index.html', {root: __dirname })
});


var server = app.listen(3000, function () {
  	var host = server.address().address;
  	var port = server.address().port;
  	console.log('Fabulinus Index Server listening at http://%s:%s', host, port);
});