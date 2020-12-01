const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
	let _id = "";

	suite("POST /api/issues/{project}", () => {
		test("Create an issue with every field", (done) => {
			chai
				.request(server)
				.post("/api/issues/test")
				.send({
					issue_title: "test issue_title",
					issue_text: "test issue_test",
					created_by: "test created_by",
					assigned_to: "test assigned_to",
					status_text: "test status_text",
				})
				.end((err, res) => {
					assert.isString(res.body._id);

					// for PUT tests
					_id = res.body._id;

					assert.isBoolean(res.body.open);
					assert.equal(res.body.issue_title, "test issue_title");
					assert.equal(res.body.issue_text, "test issue_test");
					assert.isString(res.body.created_on);
					assert.isString(res.body.updated_on);
					assert.equal(res.body.created_by, "test created_by");
					assert.equal(res.body.assigned_to, "test assigned_to");
					assert.equal(res.body.status_text, "test status_text");
					done();
				});
		});

		test("Create an issue with only required fields", (done) => {
			chai
				.request(server)
				.post("/api/issues/test")
				.send({
					issue_title: "test issue_title",
					issue_text: "test issue_test",
					created_by: "test created_by",
				})
				.end((err, res) => {
					assert.isString(res.body._id);
					assert.isBoolean(res.body.open);
					assert.equal(res.body.issue_title, "test issue_title");
					assert.equal(res.body.issue_text, "test issue_test");
					assert.isString(res.body.created_on);
					assert.isString(res.body.updated_on);
					assert.equal(res.body.created_by, "test created_by");
					assert.equal(res.body.assigned_to, "");
					assert.equal(res.body.status_text, "");
					done();
				});
		});

		test("Create an issue with missing required fields", (done) => {
			chai
				.request(server)
				.post("/api/issues/test")
				.send({
					issue_title: "test issue_title",
					issue_text: "test issue_test",
				})
				.end((err, res) => {
					assert.equal(res.body.error, "required field(s) missing");
					done();
				});
		});
	});

	suite("GET /api/issues/{project}", () => {
		test("View issues on a project", (done) => {
			chai
				.request(server)
				.get("/api/issues/test")
				.end((err, res) => {
					res.body.forEach((element) => {
						assert.property(element, "open");
						assert.property(element, "issue_title");
						assert.property(element, "issue_text");
						assert.property(element, "created_by");
						assert.property(element, "created_on");
						assert.property(element, "updated_on");
						assert.property(element, "assigned_to");
						assert.property(element, "status_text");
					});
					done();
				});
		});

		test("View issues on a project with one filter", (done) => {
			chai
				.request(server)
				.get("/api/issues/test?open=true")
				.end((err, res) => {
					res.body.forEach((element) => {
						assert.property(element, "open");
						assert.property(element, "issue_title");
						assert.property(element, "issue_text");
						assert.property(element, "created_by");
						assert.property(element, "created_on");
						assert.property(element, "updated_on");
						assert.property(element, "assigned_to");
						assert.property(element, "status_text");
					});
					done();
				});
		});

		test("View issues on a project with multiple filters", (done) => {
			chai
				.request(server)
				.get("/api/issues/test?open=true&created_by=test created_by")
				.end((err, res) => {
					res.body.forEach((element) => {
						assert.property(element, "open");
						assert.property(element, "issue_title");
						assert.property(element, "issue_text");
						assert.property(element, "created_by");
						assert.property(element, "created_on");
						assert.property(element, "updated_on");
						assert.property(element, "assigned_to");
						assert.property(element, "status_text");
					});
					done();
				});
		});
	});

	suite("PUT /api/issues/{project}", () => {
		test("Update one field on an issue", (done) => {
			chai
				.request(server)
				.put("/api/issues/test")
				.send({ _id: _id, status_text: "post test" })
				.end((err, res) => {
					assert.equal(res.body.result, "successfully updated");
					assert.equal(res.body._id, _id);
					done();
				});
		});

		test("Update multiple fields on an issue", (done) => {
			chai
				.request(server)
				.put("/api/issues/test")
				.send({ _id: _id, status_text: "post test 2", open: false })
				.end((err, res) => {
					assert.equal(res.body.result, "successfully updated");
					assert.equal(res.body._id, _id);
					done();
				});
		});

		test("Update an issue with missing _id", (done) => {
			chai
				.request(server)
				.put("/api/issues/test")
				.send({ status_text: "post test 2", open: false })
				.end((err, res) => {
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});

		test("Update an issue with no fields to update", (done) => {
			chai
				.request(server)
				.put("/api/issues/test")
				.send({ _id: _id })
				.end((err, res) => {
					assert.equal(res.body.error, "no update field(s) sent");
					assert.equal(res.body._id, _id);
					done();
				});
		});

		test("Update an issue with an invalid _id", (done) => {
			chai
				.request(server)
				.put("/api/issues/test")
				.send({ _id: "1234567890", status_text: "post test 2", open: false })
				.end((err, res) => {
					assert.equal(res.body.error, "could not update");
					assert.equal(res.body._id, "1234567890");
					done();
				});
		});
	});

	suite("DELETE /api/issues/{project}", () => {
		test("Delete an issue", (done) => {
			chai
				.request(server)
				.delete("/api/issues/test")
				.send({ _id: _id })
				.end((err, res) => {
					assert.equal(res.body.result, "successfully deleted");
					assert.equal(res.body._id, _id);
					done();
				});
		});

		test("Delete an issue with an invalid _id", (done) => {
			chai
				.request(server)
				.delete("/api/issues/test")
				.send({ _id: "1234567890" })
				.end((err, res) => {
					assert.equal(res.body.error, "could not delete");
					assert.equal(res.body._id, "1234567890");
					done();
				});
		});

		test("Delete an issue with missing _id", (done) => {
			chai
				.request(server)
				.delete("/api/issues/test")
				.end((err, res) => {
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});
	});
});
