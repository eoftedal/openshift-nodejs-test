var express = require("express");
var fs = require("fs");
var https = require("https");
var clientCertificateAuth = require('client-certificate-auth');

var app = new express();


var opts = {
  key: fs.readFileSync('/conf/key.pem'),
  cert: fs.readFileSync('/conf/cert-chain.pem'),
  ca: fs.readFileSync('/conf/root-cert.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

var checkAuth = function(cert) {
	console.log(cert);
	console.log(JSON.stringify(cert));
  return true; //allow all client certs signed by CA
};

app.use(clientCertificateAuth(checkAuth));








app.get("/", (req,res) => {
	var map = fs.readFileSync("/data/testnode-mapping", "utf-8");
	var config = JSON.parse(map);
	res.header("Content-Type", "text/plain");

	res.status(200).end("Yellow world: \n\n" + JSON.stringify(config) + "\n\n" + JSON.stringify(req.headers));
});

https.createServer(opts, app).listen(8080);

