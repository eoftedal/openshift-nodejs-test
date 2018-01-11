var express = require("express");
var fs = require("fs");

var app = new express();

app.get("/", (req,res) => {
	var map = fs.readFileSync("/data/testnode-mapping", "utf-8");
	var config = JSON.parse(map);
	res.header("Content-Type", "text/plain");

	res.status(200).end("Yellow world: \n\n" + JSON.stringify(config) + "\n\n" + JSON.stringify(req.headers));
});

app.listen(8080);

