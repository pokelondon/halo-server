/*
 * Lights Server
 * Poke London Ltd. 2014
 */

// Libs
// ================================================================
var express = require('express');
var net = require('net');
var Mediator = require('mediator-js');
var redis = require('redis-client');
var url = require('url');
var bodyParser = require('body-parser');
var crypto = require('crypto');

// Configs
// ================================================================
var webServerPort = (process.env.WEB_PORT || 8080);
var serverPort = (process.env.SOCKET_PORT || 8124);
var redisURL = url.parse(process.env.REDIS_URL || 'redis://localhost:6379/1');

// Init
// ================================================================
var mediator = new Mediator.Mediator();
var app = express();
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {auth_pass: redisURL.password});

// Setup
// ================================================================
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

// Persistent (ish) State
// ================================================================
var patternType = null;
var clients = [];

// Utils
// ================================================================
function randomHash() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

// Front End
// ================================================================
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get('/webhook', function (req, res) {
    var data = {status: 'ok', data : { id: patternType }};
    patternType = 1;
    mediator.publish('pattern:change', req.params.id);
    res.json(data);
});

app.get('/keys', function(req, res) {
    redisClient.hgetall('keys', function (err, reply) {
        // Reply seems to be an itterable for hgetall
        var items = [];
        for (i in reply) {
           items.push(JSON.parse(reply[i]));
        }
        res.render('keys', { object_list: items, action: '/keys' });
    });
});

app.post('/keys', function(req, res) {
    var data = {label: req.body.label, id: randomHash()};
    redisClient.hset('keys', data.id, JSON.stringify(data));
    res.redirect('/keys');
});

app.get('/keys/del/:id', function(req, res) {
    redisClient.hdel('keys', req.params.id);
    res.redirect('/keys');
});

// API Endpoints
// ================================================================
app.get('/webhook/:id/:type', function (req, res) {
    var data = {status: 'ok', data : { id: patternType }};
    patternType = 1;
    mediator.publish('pattern:change', req.params.id);
    res.json(data);
});

// Web server for UI and API Endpoints
// ================================================================
var webserver = app.listen(webServerPort, function () {
    var host = webserver.address().address;
    var port = webserver.address().port;
    console.log('Web Server listening at http://%s:%s', host, port);
});

// Socket Server for Processing Client
// ================================================================
var server = net.createServer(function(c) { //'connection' listener
    console.log("Socket Server connected %d", clients.length);
    clients.push(c);

    if(patternType){
        c.write('PATTERN: ' + patternType + '\r\n');
    }

    c.on('end', function() {
        // Remove referrence to this socket connection
        var index = clients.indexOf(c);
        if(index > -1) {
            clients.splice(index, 1);
        }
    });

    c.pipe(c);
});

mediator.subscribe('pattern:change', function(data){
    console.log("Sending to %d", clients.length);
    clients.forEach(function(c) {
        //c.write('PATTERN: ' + patternType + '\r\n');
        c.write(data + '\r\n');
    });
});

server.listen(serverPort, function() { //'listening' listener
    console.log('Socket Server listening on %s', serverPort);
});
