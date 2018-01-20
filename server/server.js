const http = require("http");
const express = require("express");
const ses = require("node-ses");

const config = require("../config/config");

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var mailClient = ses.createClient(
			{
				key: config.credential.key,
				secret: config.credential.secret
			});

app.get("/", (req,res) =>
	{

	// GET Fields

		var to = req.query.to;
		var message = req.query.message;

	//Send Email
		mailClient.sendEmail(
			{
				to,
				from: config.email.from,
				subject: config.email.subject,
				message
			}, (err, data, res) => 
			{
				if(err)
					{
						console.log("Error");
						console.log(err.Message);
					}
				else
					{
						console.log("Message sent to " + to);
					}
			});

		res.send("server is running");
	}
);

// Start Server

server.listen(port, () =>
	{
		console.log("Server is up on port " + port);
	}
);
