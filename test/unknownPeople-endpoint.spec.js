const knex = require("knex");
const app = require("../src/app");
const { TEST_DB_URL } = require("../src/config");

const helpers = require("./test-helpers");
describe("people not in db enpoint", () => {
  let db;
  before("make knex instane", done => {
    db = knex({
      client: "pg",
      connection: TEST_DB_URL
    });
    app.set("db", db);
    done();
  });
  after("disconnect from db", () => db.destroy());
  describe("GET api/not-in-db", () => {
    context("given no people in database", () => {
      it("responds with 200 and empty list", () => {
        //run command 'TRUNCATE TABLE people;' before running
        return supertest(app)
          .get("/api/not_in_db")
          .expect(200, []);
      });
      context("given there are people in the database", () => {
        beforeEach("insert people", () => {
          const unknownPeopleArray = helpers.userNotInDB();
          return db.into("not_in_db").insert(unknownPeopleArray);
        });

        it("responds with 200 and array of people", () => {
          return supertest(app)
            .get("/api/not_in_db")
            .expect(200, unknownPeopleArray);
        });
        describe("GET /api/not_in_db/:id", () => {
          context("given no people in db", () => {
            it("responds with 404", () => {
              const personId = 12345;
              return supertest(app)
                .get(`/api/not_in_db/${personId}`)
                .expect(404, {
                  error: { message: "Person does not exist" }
                });
            });
          });
          context("Given there are people in the database", () => {
            it("responds with 200 the specified person", () => {
              const personId = 2;
              const expectedPerson = unknownPeopleArray[personId - 1];
              supertest(app)
                .get(`/api/not_in_db/${personId}`)
                .expect(200, expectedPerson);
            });
            describe(`POST /api/not_in_db`, () => {
              it(`creates a person, responding with 201 and the person information`, () => {
                const personNotInDb = {
                  id: 1,
                  person_name: "Namey McName"
                };
                return supertest(app)
                  .post("/api/not_in_db")
                  .send(personNotInDb)
                  .expect(201)
                  .expect(res => {
                    expect(res.body.person_name).to.eql(
                      personNotInDb.person_name
                    );
                  });
              });
            });
            const newPerson = { person_name: null };
            it("responds with 400 when person name is missing", () => {
              return supertest(app)
                .post("/api/not_in_db")
                .send(newPerson)
                .expect(400, {
                  error: { message: "Missing person_name in request body" }
                });
            });
          });
        });
        describe("DELETE /api/not_in_db/:id", () => {
          context("Given no people", () => {
            it.only("responds with 404", () => {
              const reviewId = 1234;
              return supertest(app)
                .delete(`/api/not_in_db/${reviewId}`)
                .expect(404, {
                  error: {
                    message: `Person with ID ${reviewId} doesn't exist`
                  }
                });
            });
          });
        });
        context("Given there are people in db", () => {
          it("responds with 204 and removes review", () => {
            const idToRemove = 1;
            const unknownPeopleArray = helpers.userNotInDB();
            const expected = unknownPeopleArray.filter(
              person => person.id !== idToRemove
            );
            return supertest(app)
              .delete(`/api/not_in_db/${idToRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get("/api/not_in_db")
                  .expect(expected)
              );
          });
        });
        describe("PUT /api/reviews/:id", () => {
          context("Given no people", () => {
            it("responds with 404", () => {
              const personId = 12345;
              return supertest(app)
                .delete(`/api/not_in_db/${personId}`)
                .expect(404, {
                  error: { message: `Person with ID ${personId} doesn't exist` }
                });
            });
          });
        });
      });
    });
  });
});
