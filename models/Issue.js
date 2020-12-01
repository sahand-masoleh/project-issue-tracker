const mongoose = require("mongoose");

const issueSchema = mongoose.Schema({
	open: {
		type: Boolean,
		default: true,
	},
	issue_title: {
		type: String,
		required: true,
	},
	issue_text: {
		type: String,
		required: true,
	},
	created_by: {
		type: String,
		required: true,
	},
	created_on: {
		type: Date,
		default: Date.now,
	},
	updated_on: {
		type: Date,
		default: Date.now,
	},
	assigned_to: {
		type: String,
		default: "",
	},
	status_text: {
		type: String,
		default: "",
	},
});

module.exports = issueSchema;
