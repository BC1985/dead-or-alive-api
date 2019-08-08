const knex = require("knex");
const app = require("../src/app");

describe("people endpoints", () => {
  let db;
  before("make knex instane", done => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
    done();
  });
  after("disconnect from db", () => db.destroy());
  describe("GET api/people", () => {
    context("given no people in database", () => {
      it("responds with 200 and empty list", () => {
        //run command 'TRUNCATE TABLE people;' before running
        return supertest(app)
          .get("api/people")
          .expect(200, []);
      });
    });
  });
});
