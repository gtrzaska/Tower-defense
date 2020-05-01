var http = require("http");
var fs = require("fs");
var socketio = require("socket.io");
var mongoose = require("mongoose");
var Models = require("./database/models.js")(mongoose);
var Operations = require("./database/operations.js");
var db;

var players = 0;

var server = http.createServer(function (req, res) {
	switch (req.method) {
		case "GET":
			if (req.url === "/") {
				fs.readFile("static/index.html", function (error, data) {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.write(data);
					res.end();
				})
			} else if (req.url.indexOf(".js") != -1) {
				if (req.url.substring(0, 8) == "static/Models") {		//gdy zapytanie dotyczy modeli jest inna sciezka
					fs.readFile(req.url.substring(1, req.url.length), function (error, data) {
						res.writeHead(200, { 'Content-Type': 'application/javascript' });
						res.write(data);
						res.end();
					})
				} else {
					fs.readFile("static" + req.url, function (error, data) {
						res.writeHead(200, { 'Content-Type': 'application/javascript' });
						res.write(data);
						res.end();
					})
				}
			} else if (req.url.indexOf(".png") != -1) {
				fs.readFile(req.url.substring(1, req.url.length), function (error, data) {
					res.writeHead(200, { 'Content-Type': 'image/png' });
					res.write(data);
					res.end();
				})
			} else if (req.url.indexOf(".xml") != -1) {
			    fs.readFile("static" + req.url, function (error, data) {
			        res.writeHead(200, { 'Content-Type': 'application/xml' });
			        res.write(data);
			        res.end();
			    })
			} else if (req.url.indexOf(".jpg") != -1) {
				fs.readFile(req.url.substring(1, req.url.length), function (error, data) {
					res.writeHead(200, { 'Content-Type': 'image/jpg' });
					res.write(data);
					res.end();
				})
			} 
			break;
		case "POST":
			playerSide(req, res);
			break;
	}
})

function playerSide(req, res) {
	var allData = "";

	req.on("data", function (data) {
		allData += data;
	})

	req.on("end", function (data) {
		if (players < 2) {
			if (players == 0) {
				res.end("1");
			} else if (players == 1) {
				res.end("2");
			}
		} else {
			res.end("twoplayers");
		}

		players++;
	})
}

var io = socketio.listen(server);

io.sockets.on("connection", function (client) {
	//console.log("GRACZ SIE PODLACZYL ---------------------------");

	//opers.deleteAll(Models.User)

	client.on("isTwoPlayers", function(data) {
		if (players == 2) {
			io.sockets.emit("twoPlayers", {});
		}
	})

	client.on("name", function(data) {
		user = new Models.User({
			name: data.name
		})

		user.validate(function (err) {
		     console.log(err);
		});

		opers.createUser(Models.User, user);

		client.broadcast.emit("enemyName", data)

		opers.getStats(Models.User, data.name, function(data) {
			if (typeof(data.data[0]) == "object") {
				console.log(data.data[0].name + "'s stats: " + data.data[0].wins + "/" + data.data[0].loses);
				client.emit("stats", {wins: data.data[0].wins, loses: data.data[0].loses});
			} else {
				client.emit("stats", {wins: 0, loses: 0});
			}
		})
	})

	client.on("soldierAdded", function(data) {
		client.broadcast.emit("addSoldier", data);
	})

	client.on("towerAdded", function(data) {
		client.broadcast.emit("addTower", data);
	})

	client.on("bulletAdded", function(data) {
		client.broadcast.emit("addBullet", data);
	})

	client.on("lifeLost", function(data) {
		client.broadcast.emit("substractLife", {});
	})

	client.on("defeat", function(data) {
		players = 0;
		client.broadcast.emit("win", {});
	})

	//zapisywanie statow
	client.on("win", function(data) {
		opers.updateWins(Models.User, data.name, data.wins + 1);
	})

	client.on("loss", function(data) {
		opers.updateLoses(Models.User, data.name, data.loses + 1);
	})

	//przy rozlaczeniu gracz wygrywa walkowerem i gra sie konczy
	client.on("disconnect", function () {
		if (players == 2) {
			players = 0;
			client.broadcast.emit("win", {});
		}
	})
})

mongoose.connect('mongodb://localhost/test5');

function connectToMongo() {
	db = mongoose.connection;

	db.on("error", function () {
		console.log("problem z mongo")
	});

	db.once("open", function () {
		console.log("mongo smiga");
		opers = new Operations();
	});

	db.once("close", function () {
		console.log("mongodb zostało odłączone");
	});
}

connectToMongo();

server.listen(3000);