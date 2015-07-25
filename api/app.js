var express = require('express');
var cors = require('cors')
var app = express();
var Parse = require('parse').Parse;
var nodemailer = require('nodemailer');

Parse.initialize("6BS6xIGHDqZY9I7DnT3rbnk39NRNe7WInFnxntBa", "XajKXAcvte8PziVdLK0hu8dBP2Q2Z9k3sewhMxEM");

app.use(cors());

/*app.get('/', function (req, res) {
	res.statusCode = 200;
	Parse.initialize("6BS6xIGHDqZY9I7DnT3rbnk39NRNe7WInFnxntBa", "XajKXAcvte8PziVdLK0hu8dBP2Q2Z9k3sewhMxEM");
	Parse.Push.send({
		channels: [ "floor_2" ],
		data: {
			alert: "get test"
		  }
		},
		{
			success: function() {
			console.log('success');
		},
		error: function(error) {
			// Handle error
			}
	});
	res.setHeader('Content-Type', 'application/json');
	res.send('{"kek": 1}');
	console.log("[200] " + req.method + " to " + req.url);
});*/

app.get('/make_reservation', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	var errors = [];
	var reservationInfo = {};

	if (req.query.game) {
		switch(req.query.game) {
			case "pool":
			case "ping1":
			case "ping2":
			case "soccer":
			case "arcade":
				var maxPlayers = 4;
				break;
			case "race":
			case "pinball":
			case "hockey":
				var maxPlayers = 2;
				break;
			default:
				errors.push("Invalid game. ");
		}
		reservationInfo.game = req.query.game;
	} else {
		errors.puch("No game selected. ");
	}

	if (req.query.startTime) {
        var date = new Date(parseInt(req.query.startTime));
		var minutes = date.getMinutes();
		if (minutes != 0 && minutes != 15 && minutes != 30 && minutes != 45) {
			errors.push("Time is not a 15 min interval. ");
		}
		reservationInfo.startTime = parseInt(req.query.startTime);
	} else {
		errors.push("No start time. ");
	}

	if (req.query.email) {
		if (true) { // validate email
			reservationInfo.email = req.query.email;
		}
	} else {
		errors.push("No email. ");
	}

	if (req.query.players) {
		var players = parseInt(req.query.players); //try catch for wrong format
		if (players > maxPlayers) {
			errors.push("Player count exceeds max. ");
		} else {
			var leftover = maxPlayers - players;
		}
		reservationInfo.players = players;
	}

	if (req.query.needed) {
		if (true) { //validate
			reservationInfo.needed = parseInt(req.query.needed);
			if (reservationInfo.needed == 0) {
				reservationInfo.gameStatus = "closed";
			} else {
				reservationInfo.gameStatus = "reserved";
			}
		}
	}

	if (req.query.gameDescription) {
		reservationInfo.gameDescription = req.query.gameDescription;
	} else {
		reservationInfo.gameDescription = "";
	}

	reservationInfo.confirmed = false;

	if (errors.length == 0) {

		var Reservations = Parse.Object.extend("Reservations");
		var reservation = new Reservations();

		reservation.save(reservationInfo, {
			success: function(reservation) {
				console.log(reservation);
				res.send("{'status': 'success'}");

				var transporter = nodemailer.createTransport({service: 'Gmail',auth: {user: 'stapinskirafal@gmail.com', pass: ''}});

				var mailOptions = {
				    from: 'Rafal Stapinski ✔ <stapinskirafal@gmail.com>', // sender address
				    to: reservation.email, // list of receivers
				    subject: 'Reservation ✔', // Subject line
				    text: 'You have made a reservation. This is the url to cancel your reservation: localhost:3000/cancel?id= ' + reservation.objectId // plaintext body
				};

			},
			error: function(reservation, error) {
				console.log(error);
				res.send("{'status': 'error', 'error': }")
			}
 		});
	}
});

app.get("/open_until", function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	if(req.query.game) {
		//validate

		var query = new Parse.Query("Reservations");
		query.equalTo({"game": req.query.game});
		query.first({
			success: function(reservation) { //check for if is not open
				res.send("{'status': 'success', 'timestamp': " + reservation.startTime + "}");
			},
			error: function(error) {
				console.log(error);
			}
		});
	}
});

app.get("/join_request", function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	var errors = [];
	var reservationInfo = {};

	if(req.query.game) {
		reservationInfo.game = req.query.game;
	} else {
		//error
	}

	if(req.query.startTime) {
		//val time

		reservationInto.startTime = req.query.startTime;
	} else {
		//error
	}

	if (req.query.players) {
		//val player count

		reservationInfo.players = req.query.players;
	} else {
		//error
	}


});

app.get("/confirm_game", function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	if(req.query.objectId) {
		//var x;
	}
});

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
