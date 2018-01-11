var express = require("express");
var fs = require("fs");
var https = require("https");
var clientCertificateAuth = require('client-certificate-auth');

var app = new express();


var opts = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.pem'),
  ca: fs.readFileSync('cacert.pem'),
  requestCert: true,
  rejectUnauthorized: false
};


app.use(clientCertificateAuth(checkAuth));

var checkAuth = function(cert) {
	console.log(cert);
	console.log(JSON.stringify(cert));
  return true; //allow all client certs signed by CA
};






app.get("/", (req,res) => {
	var map = fs.readFileSync("/data/testnode-mapping", "utf-8");
	var config = JSON.parse(map);
	res.header("Content-Type", "text/plain");

	res.status(200).end("Yellow world: \n\n" + JSON.stringify(config) + "\n\n" + JSON.stringify(req.headers));
});

https.createServer(opts, app).listen(8080);

