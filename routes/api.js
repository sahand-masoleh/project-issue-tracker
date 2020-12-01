"use strict";
const mongoose = require("mongoose");
mongoose.connect(
	process.env.DB,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	console.log("connected to DB")
);

const issueSchema = require("../models/Issue");

module.exports = function (app) {
	app
		.route("/api/issues/:project")

		.get(async (req, res) => {
			let project = req.params.project;
			let queries = {};
			for (let query in req.query) {
				queries[query] = req.query[query];
			}
			let Issue = mongoose.model("Issue", issueSchema, project);
			let result = await Issue.find(queries);
			try {
				res.status(200).json(result);
			} catch (error) {
				res.status(400).send(error.message);
			}
		})

		.post(async (req, res) => {
			let project = req.params.project;
			let Issue = mongoose.model("Issue", issueSchema, project);
			let issue = new Issue({
				issue_title: req.body.issue_title,
				issue_text: req.body.issue_text,
				created_by: req.body.created_by,
				assigend_to: req.body.assigend_to,
				status_text: req.body.status_text,
			});
			try {
				try {
					await Issue.validate(issue);
				} catch (error) {
					throw Error("required field(s) missing");
				}
				let result = await Issue.create(issue);
				res.status(200).json(result);
			} catch (error) {
				res.status(400).send(error.message);
			}
		})

		.put(async (req, res) => {
			let project = req.params.project;
			let Issue = mongoose.model("Issue", issueSchema, project);
			let queries = { updated_on: Date.now() };
			for (let query in req.body) {
				if (req.body[query] && query !== "_id") {
					queries[query] = req.body[query];
				}
			}
			try {
				if (!req.body._id) throw Error("missing id");
				let result = await Issue.findOneAndUpdate({ _id: req.body._id }, queries, {
					useFindAndModify: false,
					new: true,
				});
				if (!result) throw Error("invalid id");
				res.status(200).json(result);
			} catch (error) {
				res.status(400).send(error.message);
			}
		})

		.delete(async (req, res) => {
			let project = req.params.project;
			let Issue = mongoose.model("Issue", issueSchema, project);
			try {
				if (!req.body._id) throw Error("missing id");
				let result = await Issue.findOneAndDelete({ _id: req.body._id });
				if (!result) throw Error("invalid id");
				res.status(200).json(result);
			} catch (error) {
				res.status(400).send(error.message);
			}
		});
};
