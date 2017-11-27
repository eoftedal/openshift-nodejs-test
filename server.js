var express = require("express");
var fs = require("fs");




var app = new express();






app.get("/", (req,res) => {
	var map = fs.readFileSync("/data/testnode-mapping", "utf-8");
	var config = JSON.parse(map);


	res.status(200).end("Yellow world: " + JSON.stringify(config));
});

app.listen(8080);

