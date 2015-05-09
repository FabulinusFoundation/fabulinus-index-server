var express = require('express');
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var path    = require('path');

var kaliteUrl = "http://localhost:8008";
var wikiUrl   = "http://localhost/mediawiki";
var port      = process.env.NODE_PORT || 3000;

var app = express();

app.use(morgan('dev'));
console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'logo.ico')));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index.ejs', { kaliteUrl : kaliteUrl, wikiUrl : wikiUrl });
});


var server = app.listen(port, function () {
  	var host = server.address().address;
  	var port = server.address().port;
  	console.log('Fabulinus Index Server listening at http://%s:%s', host, port);
});