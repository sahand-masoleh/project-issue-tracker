"use strict";

//Express
const express = require("express");
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Chai
const expect = require("chai").expect;

//Cors
const cors = require("cors");

//ENV
require("dotenv").config();

//Middleware
app.use("/public", express.static(process.cwd() + "/public"));

//For FCC testing purposes
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");
fccTestingRoutes(app);
app.use(cors({ origin: "*" })); //For FCC testing purposes only

//Sample front-end
app.route("/:project/").get(function (req, res) {
	res.sendFile(process.cwd() + "/views/issue.html");
});

//Index page (static HTML)
app.route("/").get(function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

//Routing for API
const apiRoutes = require("./routes/api.js");
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
	res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
	console.log("Listening on port " + process.env.PORT);
	if (process.env.NODE_ENV === "test") {
		console.log("Running Tests...");
		setTimeout(function () {
			try {
				runner.run();
			} catch (e) {
				let error = e;
				console.log("Tests are not valid:");
				console.log(error);
			}
		}, 3500);
	}
});

module.exports = app; //for testing
