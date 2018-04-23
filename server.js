var express = require("express");
var fs = require("fs");

var app = new express();

app.get("/", (req,res) => {
	let address = req.socket.address().address;
	console.log(new Date() + " " + address + " " + req.method + " " + req.url + " " + req.headers["user-agent"]);
	res.header("Content-Type", "text/plain");

	res.status(200).end("Yellow world: " + address + "\n\n" + JSON.stringify(req.headers));
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
  console.log(`Received ${signal}`);
  process.exit(0);
}
process.on('SIGINT', handle);
process.on('SIGTERM', handle);


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
