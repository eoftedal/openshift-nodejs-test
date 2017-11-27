var express = require("express");

var app = new express();

app.get("/", (req,res) => {
	res.status(200).end("Yellow world");
});

app.listen(8080);

