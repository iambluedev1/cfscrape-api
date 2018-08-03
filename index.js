var express = require('express');
var apicache = require('apicache');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cfget = require('cfget');
var got = require('got');
var app = express();
var cache = apicache.middleware;
var generateToken = require('./token.js');

var savedScrape = [];

app.use(helmet());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/wait', function(req, res){
    var url = req.body.url;
    if(url == null){
        res.send({
            error: 1,
            message: "Please specify an url"
        });
        return;
    } else {
        try {
            var page = cfget(url);
            page.then(async function(request){
				const response = await got(request.url, request);
				res.send({
					url: url,
					html: response.body
				});
            });
        } catch (e) {
            res.send({
                error: 2,
                message: "An error occured"
            });
        }
    }
});

app.post('/get', function(req, res){
    var url = req.body.url;
    if(url == null){
        res.send({
            error: 1,
            message: "Please specify an url"
        });
        return;
    } else {
        generateToken(10, function(id){
            scrape(id, url);
            res.send({
                token: id,
                startedAt: Math.floor(Date.now() / 1000),
                refreshAt: Math.floor(Date.now() / 1000) + 5500,
                estimatedTime: 5500,
                rawUrl: "http://" + req.headers.host + "/raw/" + id
            });
        });
    }
});

function scrape(id, url){
    savedScrape.push({
        token: id,
        finished: false,
        url: url,
        html: "",
    });
    var scrape = savedScrape.find(function(el){
        return el.url == url;
    });
    try {
        var page = cfget(url);
        page.then(async function(request) {
            var response = await got(request.url, request);
            console.log("scraping of " + scrape.token + " finished");
            scrape.finished = true;
            scrape.html = response.body;
        });
    } catch (e) {
		console.log(e);
	}
}

function remove(arr, item) {
    for(var i = arr.length; i--;) {
        if(arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

app.get('/raw/:token', function(req, res){
    var token = req.params.token;
    if(token == null){
        res.send({
            error: 3,
            message: "Please specify a token"
        });
        return;
    } else {
        var scrape = savedScrape.find(function(el){
            return el.token == token;
        });

        if(scrape == null){
            res.send({
                error: 4,
                message: "Bad or already used token !"
            });
            return;
        }

        if(!scrape.finished) {
            res.send({
                error: 5,
                message: "Scraping not finished ! Please wait."
            });
        }else{
            remove(savedScrape, scrape);
            res.send(scrape);
        }
    }
});

app.listen('8888');
console.log('Listening on localhost:8888');
exports = module.exports = app;
