const knex = require("knex");
const app = require("../src/app");
const { TEST_DB_URL } = require("../src/config");

const helpers = require("./test-helpers");
describe("people endpoints", () => {
  let db;
  before("make knex instane", done => {
    db = knex({
      client: "pg",
      connection: TEST_DB_URL
    });
    app.set("db", db);
    done();
    helpers.cleanTables();
  });
  after("disconnect from db", () => db.destroy());
  describe("GET api/people", () => {
    context("given no people in database", () => {
      it("responds with 200 and empty list", () => {
        //run command 'TRUNCATE TABLE people;' before running
        return supertest(app)
          .get("/api/people")
          .expect(200, []);
      });
    });
    context("given there are people in the database", () => {
      const peopleArray = helpers.makePeopleArray();
      beforeEach("insert people", () => {
        return db.into("people").insert(peopleArray);
      });
      afterEach("clean tables", () => {
        helpers.cleanTables();
      });
      it("responds with 200 and array of people", () => {
        return supertest(app)
          .get("/api/people")
          .expect(200, peopleArray);
      });
    });
    // describe("GET /api/people/:id", () => {
    //   context("given no people in db", () => {
    //     it("responds with 404", () => {
    //       const personId = 12345;
    //       return supertest(app)
    //         .get(`/api/people/${personId}`)
    //         .expect(404, { error: { message: "Person does not exist" } });
    //     });
    //   });
    //   context("Given there are people in the database", () => {
    //     const peopleArray = helpers.makePeopleArray();
    //     beforeEach("insert people", () => {
    //       return db.into("people").insert(peopleArray);
    //     });
    //     it("responds with 200 the specified person", () => {
    //       const personId = 2;
    //       const expectedPerson = peopleArray[personId - 1];
    //       supertest(app)
    //         .get(`/api/reviews/${personId}`)
    //         .expect(200, expectedPerson);
    //     });
    //   });
    // });
  });
});
