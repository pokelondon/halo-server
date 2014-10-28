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

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'))

// Front End
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

// API Endpoints
app.get('/webhook', function (req, res) {
    var data = {status: 'ok'};
    mediator.publish('pattern', { id: 1 });
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
    mediator.subscribe('pattern', function(data){
        console.log('Subscriber heard', data.id);
        c.write('PATTERN: ' + data.id + '\r\n');
    });
    console.log('Socket Server connected');
    c.on('end', function() {
        console.log('Socket Server disconnected');
        mediator.remove('pattern');
    });
    c.write('Connected\r\n');
    c.pipe(c);
});

server.listen(serverPort, function() { //'listening' listener
    console.log('Socket Server listening on %s', serverPort);
});
