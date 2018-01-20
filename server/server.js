const http = require("http");
const express = require("express");
const ses = require("node-ses");
const xml2js = require("xml2js");

const config = require("../config/config");

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var mailClient = ses.createClient(
			{
				key: config.credential.key,
				secret: config.credential.secret
			});
var parser = new xml2js.Parser();

parser.on("error", (err) => 
	{
		console.log("Parser eror ", err);
	});

app.get("/", (req,res) =>
	{

	// GET Fields

		var to = req.query.to;
		var message = req.query.message;
		var from = req.query.from || config.email.from;
		var subject = req.query.subject || config.email.subject;

	//Send Email
		mailClient.sendEmail(
			{
				to,
				from,
				subject,
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
						parser.parseString(data.toString(), (err,res) => 
						{
							var RequestId = res.SendEmailResponse.ResponseMetadata[0].RequestId[0];
							var emailSent = 
								{
									RequestId,
									to,
									from,
									subject,
									message
								};
							console.log("Message sent:");
							console.log(emailSent);
						});
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
