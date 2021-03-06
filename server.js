var express = require('express');
var favicon = require('connect-favicons');
var morgan  = require('morgan');
var path = require('path');
var fs   = require('fs');
var os 	 = require('os');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');

var port = process.env.NODE_PORT || 3000;
var host = os.networkInterfaces()['wlan0'][0].address;
var kaliteUrl = 'http://' + host + ':8008';
var wikiUrl   = 'http://' + host + ':8080';

var app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images')));
app.use(bodyParser.urlencoded({
    extended : true
}));

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


app.get('/shutdown', function(req, res){
	res.render('shutdown.ejs');
});


app.post('/shutdown', function(req, res){
    var user = req.body.username;
    var password = req.body.password;
    if (user == 'admin' && password == 'nkybwwrhsjtl'){
	console.log('before');
	exec('sudo shutdown -h now', function(error, stdout, stderr){
	    res.end('Shutting down! Please wait...');
	})
	return;
    }
    res.end('Username and/or password incorrect.');
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


app.listen(port);
console.log('Fabulinus Index Server listening at http://%s:%s', host, port);
