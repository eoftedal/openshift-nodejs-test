var express = require("express");
var fs = require("fs");
var URL = require("url");
var app = new express();

var failedBefore = {};
var server;
var status = "active";




function handleRequest(req,res) {
	let address = req.socket.address().address;
	console.log(new Date() + " " + address + " " + req.method + " " + req.url + " " + req.headers["user-agent"]);
	res.header("Content-Type", "text/plain");
	let url = URL.parse(req.url);
	let delay = 0;
	if (url.query) {
		var m = {}; url.query.split("&").map(x => x.split("=")).map(x => m[x[0]] = x[1]);
		delay = parseInt(m["delay"] || "0");
		if (m["failid"]) {
			var id = m["failid"];
			if (!failedBefore[id]) {
				failedBefore[id] = true;
				console.log("Killing this the first time: " + id);
				req.socket.destroy();
				return;
			}
		}
	}
	setTimeout(() => {
		res.status(200).end("Yellow world: " + address + "\n\n" + JSON.stringify(req.headers));	
	}, delay);
};

app.post("/", handleRequest);

app.get("/", handleRequest); 

app.get("/ready", (req, res) => {
	let address = req.socket.address().address;
	console.log(new Date() + " " + address + " " + req.method + " " + req.url + " " + req.headers["user-agent"] + " " + status);
	if (status !== "active") {
		if (status === "shutting down") {
			status = "leftTheBuilding";
			setTimeout(() => {
				log(`Closing...`);
				server.close(function() { 
					log('All connections closed'); 
					process.exit(0);
				});
			}, 5000);
		}
		return res.status(503).end();
	}
	return res.status(200).end("Okelidokeli");
});

function log(msg) {
	console.log(new Date() + " : " + msg);
}

process.on('beforeExit', () => {
	console.log('before exit');
});
process.on('exit', (code) => {
	console.log('exit with ' + code);
});
process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});

function handle(signal) {
  log(`Received ${signal}`);
  status = "shutting down";
	setTimeout(() => {
		log(`Closing...`);
		setTimeout(() => process.exit(1), 30000);
		server.close(function() { 
			log('All connections closed'); 
			process.exit(0);
		});
	}, 15000);
}
process.on('SIGINT', () => handle('SIGINT'));
process.on('SIGTERM', () => handle('SIGTERM'));


function start() {
	log("Planning to listen...")
	server = app.listen(8080, () => log("Now I'm listening!"));
}

if (process.env.DELAY) {
	log("There seems to be a delay... " + process.env.DELAY);
	setTimeout(start, parseInt(process.env.DELAY));
} else {
	start();
}
