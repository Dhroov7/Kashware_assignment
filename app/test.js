const expect = require("chai").expect,
  axios = require("axios");

var token = "";

describe("Kashware Assignment API tests", function() {
  it("Test of endpoint for signUp", function(done) {
    axios.post(
      "http://localhost:9090/signup",
      { username: "Dhroov", password: "Gupta" },
      (err, res) => {
        expect(res).to.equal("User Created");
      }
    );
    done();
  });

  it("Test of endpoint for login", function(done) {
    axios.post(
      "http://localhost:9090/login",
      { username: "Dhroov", password: "Gupta" },
      (err, res) => {
        if (res) {
          token = res.token;
          expect(res.success).to.equal(true);
          expect(res.message).to.equal("Authentication successful!");
        }
      }
    );
    done();
  });

  it("Test of endpoint for publishing books", function(done) {
    axios.post(
      "http://localhost:9090/publish",
      {
        headers: {
          Authorization: "Bearer " + token
        },
        title: "To kill a mocking bird",
        description:
          "To Kill a Mockingbird is a novel by Harper Lee published in 1960",
        cover: "Haper lee: to kill a mocking bird",
        author: "Harper lee",
        price: 4000
      },
      (err, res) => {
        if (res) {
          expect(res.title).to.equal("To kill a mocking bird");
          expect(res.description).to.equal(
            "To Kill a Mockingbird is a novel by Harper Lee published in 1960"
          );
          expect(res.cover).to.equal("Haper lee: to kill a mocking bird");
          expect(res.author).to.equal("Haper lee");
          expect(res.price).to.equal(4000);
        }
      }
    );
    done();
  });

  it("Test of endpoint for getting all the published books", function(done) {
    axios.get("http://localhost:9090/publish", (err, res) => {
      if (res) {
        expect(res).to.have.lengthOf(1);
        expect(res[0].title).to.equal("To kill a mocking bird");
        expect(res[0].description).to.equal(
          "To Kill a Mockingbird is a novel by Harper Lee published in 1960"
        );
        expect(res[0].cover).to.equal("Haper lee: to kill a mocking bird");
        expect(res[0].author).to.equal("Haper lee");
        expect(res[0].price).to.equal(4000);
      }
    });
    done();
  });

  it("Test of endpoint for searching of book by title", function(done) {
    axios.get(
      "http://localhost:9090/search/To kill a mocking bird",
      (err, res) => {
        if (res) {
          expect(res).to.have.lengthOf(1);
          expect(res[0].title).to.equal("To kill a mocking bird");
          expect(res[0].description).to.equal(
            "To Kill a Mockingbird is a novel by Harper Lee published in 1960"
          );
          expect(res[0].cover).to.equal("Haper lee: to kill a mocking bird");
          expect(res[0].author).to.equal("Haper lee");
          expect(res[0].price).to.equal(4000);
        }
      }
    );
    done();
  });

  it("Test of endpoint for listing all books of the logged in user", function(done) {
    axios.get("http://localhost:9090/list", (err, res) => {
      if (res) {
        expect(res).to.have.lengthOf(1);
        expect(res[0].title).to.equal("To kill a mocking bird");
        expect(res[0].description).to.equal(
          "To Kill a Mockingbird is a novel by Harper Lee published in 1960"
        );
        expect(res[0].cover).to.equal("Haper lee: to kill a mocking bird");
        expect(res[0].author).to.equal("Haper lee");
        expect(res[0].price).to.equal(4000);
      }
    });
    done();
  });

  it("Test of endpoint unpublish book of a logged in user", function(done) {
    axios.post(
      "http://localhost:9090/unpublish",
      {
        headers: {
          Authorization: "Bearer " + token
        },
        title: "To kill a mocking bird"
      },
      (err, res) => {
        if (res) {
          expect(res.title).to.equal("To kill a mocking bird");
          expect(res.description).to.equal(
            "To Kill a Mockingbird is a novel by Harper Lee published in 1960"
          );
          expect(res.cover).to.equal("Haper lee: to kill a mocking bird");
          expect(res.author).to.equal("Haper lee");
          expect(res.price).to.equal(4000);
        }
      }
    );
    done();
  });
});
