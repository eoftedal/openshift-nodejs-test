var express = require("express");
var fs = require("fs");




var app = new express();






app.get("/", (req,res) => {
	var secrets = fs.readFileSync("/etc/test-secret/config", "utf-8");
	var config = JSON.parse(secrets);
	res.status(200).end("Yellow world: " + config.password);
});

app.listen(8080);

