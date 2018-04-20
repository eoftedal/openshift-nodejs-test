var express = require("express");
var fs = require("fs");

var app = new express();

app.get("/", (req,res) => {
	res.header("Content-Type", "text/plain");
	res.status(200).end("Yellow world: " + req.socket.getAddress().address + "\n\n" + JSON.stringify(req.headers));
});

function log(msg) {
	console.log(new Date() + " : " + msg);
}

function start() {
	log("Planning to listen...")
	app.listen(8080, () => log("Now I'm listening!"));
}

if (process.env.DELAY) {
	log("There seems to be a delay... " + process.env.DELAY);
	setTimeout(start, parseInt(process.env.DELAY));
} else {
	start();
}
