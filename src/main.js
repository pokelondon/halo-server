/*
 * Lights Server
 * Poke London Ltd. 2014
 */

// Libs
var express = require('express');
var net = require('net');
var Mediator = require('mediator-js');

// Configs
var webServerPort = (process.env.WEB_PORT || 8080);
var serverPort = (process.env.SOCKET_PORT || 8124);

// Init
var mediator = new Mediator.Mediator();
var app = express();

// Setup
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'))

// Persistent (ish) State
var patternID = null;
var clients = [];

// Front End
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

// API Endpoints
app.get('/webhook/:id', function (req, res) {
    console.log(req.params.id);
    var data = {status: 'ok', data : { id: patternID }};
    patternID = 1;
    mediator.publish('pattern:change', req.params.id);
    res.json(data);
});

// Web server for UI and API Endpoints
var webserver = app.listen(webServerPort, function () {
    var host = webserver.address().address;
    var port = webserver.address().port;
    console.log('Web Server listening at http://%s:%s', host, port);
});

// Socket Server for Processing Client
var server = net.createServer(function(c) { //'connection' listener
    console.log('Socket Server connected');
    clients.push(c);

    if(patternID){
        c.write('PATTERN: ' + patternID + '\r\n');
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
        //c.write('PATTERN: ' + patternID + '\r\n');
        c.write(data + '\r\n');
    });
});

server.listen(serverPort, function() { //'listening' listener
    console.log('Socket Server listening on %s', serverPort);
});
