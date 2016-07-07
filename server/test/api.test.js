// var seed = require('./init_db');
var request = require('supertest');
var app = require('../src/app');

describe("authentication endpoint", function () {
  it("returns status 200", function (done) {
    request(app)
      .get("/api/status")
      .expect(200, done);
  });
});
