var express = require("express");
var fs = require("fs");
var request = require("request");
var net = require('net');

var rnd = Math.random();

var r = request.defaults({'proxy':'http://localhost:18080'})


var app = new express();

app.get("/", (req,res) => {
	var map = fs.readFileSync("/data/testnode-mapping", "utf-8");
	var config = JSON.parse(map);
	res.header("Content-Type", "text/plain");

	res.status(200).end("Yellow world (" + rnd + "): \n\n" + JSON.stringify(config) + "\n\n" + JSON.stringify(req.headers));
});

//Dangerous code ahead
app.get("/:host", (req, res) => {
	r.get("http://" + req.params.host + "/").pipe(res);
});

app.listen(8080);



var server = net.createServer(function(socket) {
	socket.write('Echo server ' + rnd + '\r\n');
	socket.pipe(socket);
});

server.listen(1337);


