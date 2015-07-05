var express = require('express');
var favicon = require('connect-favicons');
var morgan  = require('morgan');
var path    = require('path');
var fs      = require('fs');
var os 		= require('os');

var host, kaliteUrl, wikiUrl;
var port = process.env.NODE_PORT || 3000;
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    host = null;
	kaliteUrl = 'http://' + add + ':8008';
	wikiUrl   = 'http://' + add + ':8080';
  });
});

var app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images')));

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    getI18N(function (err, languages) {
        if (err){
            console.log(err);
        }
        var custom = 'en';
        var selected = req.query.lang || custom;
        var customStrings;
        var selectedStrings;
        for (var i=0; i<languages.length; i++){
            if (languages[i].id == selected){
                selectedStrings = languages[i].strings;
            }
            if (languages[i].id == custom){
                customStrings = languages[i].strings;
            }
        }
        res.render('index.ejs', {
            languages : languages,
            strings : selectedStrings || customStrings,
            kalite : kaliteUrl,
            wiki : wikiUrl
        });
    });
});


function getI18N(done){
    var dir = path.join(__dirname, 'public', 'i18n');
    var languages = [];

    fs.readdir(dir,function(err, files){
        if (err){
            return done(err, languages);
        }
        var count = 0;
        files.forEach(function(file){
            fs.readFile(path.join(dir, file),'utf-8',function(err, language){
                if (err){
                    return done(err, languages);
                }
                var json = JSON.parse(language);
                languages.push(json);
                if (++count == files.length){
                    return done(null, languages);
                }
            });
        });
    });
}


var server = app.listen(port, function () {
  	var host = server.address().address;
  	var port = server.address().port;
  	console.log('Fabulinus Index Server listening at http://%s:%s', host, port);
});
