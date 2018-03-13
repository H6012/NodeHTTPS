var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');



var privateKey  = fs.readFileSync('privateKey.key', 'utf8');
var certificate = fs.readFileSync('certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();
var secure_app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
secure_app.use(bodyParser.urlencoded({ extended: false }));
secure_app.use(bodyParser.json());



// your express configuration here

app.get('/', function(req,res) {
        res.send('non secure channel!!!');
    });

app.post('/StartCharge', function(req,res) {
	res.send( StartCharger(req.body.id, req.body.user) );
    });
app.post('/StopCharge', function(req,res) {
	console.log('request =' + JSON.stringify(req.body))
        res.send( StopCharger(req.body.id, req.body.user) );
    });



secure_app.get('/', function(req,res) {
        res.send('encrypted channel');
    });

secure_app.post('/StartCharge', function(req,res) {
	console.log(req.body.id);
	
	var chargerid = req.body.id;
        res.send( StartCharger(chargerid, req.body.user) );
	
    });

secure_app.post('/StopCharge', function(req,res) {
	console.log(req.body.id);
	var chargerid = req.body.id;
      res.send(StopCharger(chargerid, req.body.user));
    });



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, secure_app);

httpServer.listen(80);
httpsServer.listen(443);

console.log("Started listening on ports 80 and 443");



var chargers = [];


function StartCharger( chargerid,  user_id) { 
  	console.log(chargers.indexOf(chargerid));
	//check charger is not in use currently!
	if (chargers.indexOf(chargerid)>=0) {
		return '{return:"error charger already running"}';
	}
	chargers.push(chargerid);		 

	return '{return:"ok"}'; 
} 

function StopCharger( chargerid,  user_id) { 
  	
	//check charger is not in use currently!
	if (chargers.indexOf(chargerid)<0) {
		return '{return:"error, charger not started"}';
	}
	const index = chargers.indexOf(chargerid);
    	chargers.splice(index, 1);
			 

	return '{return:"ok"}'; 
} 
