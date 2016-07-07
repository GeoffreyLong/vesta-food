// var seed = require('./init_db');
var request = require('supertest');
var assert = require('chai').assert;
var app = require('../src/app');

describe("status endpoint", function () {
  it("returns status 200", function (done) {
    request(app)
      .get("/api/status")
      .expect(200, done);
  });
});

describe("store endpoint", function () {
  it("returns status 200", function (done) {
    request(app)
      .get("/api/stores")
      .expect(200)
      .end(function (err, res) {
        var stores = res.body;
        assert.lengthOf(stores, 0);
        done();
      });
  });
});
