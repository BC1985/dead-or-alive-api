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
    describe("GET /api/people/:id", () => {
      context("given no people in db", () => {
        beforeEach("clean tables", () => {
          helpers.cleanTables();
        });

        it("responds with 404", () => {
          const personId = 12345;
          return supertest(app)
            .get(`/api/people/${personId}`)
            .expect(404, { error: { message: "Person does not exist" } });
        });
      });
      context("Given there are people in the database", () => {
        const peopleArray = helpers.makePeopleArray();
        beforeEach("insert people", () => {
          return db.into("people").insert(peopleArray);
        });
        it("responds with 200 the specified person", () => {
          const personId = 2;
          const expectedPerson = peopleArray[personId - 1];
          supertest(app)
            .get(`/api/reviews/${personId}`)
            .expect(200, expectedPerson);
        });
      });
    });
    describe(`POST /api/reviews`, () => {
      // beforeEach("clean tables", () => {
      //   helpers.cleanTables();
      // });
      it("creates an instance of a person, responds with 201 and the person info", () => {
        const newPerson = {
          person_name: "Namey McName",
          status: "status",
          description: "description",
          dates: "dates",
          image: "image.jpg"
        };
        return supertest(app)
          .post("/api/people")
          .send(newPerson)
          .expect(201)
          .expect(res => {
            expect(res.body.person_name).to.eql(newPerson.person_name);
            expect(res.body.status).to.eql(newPerson.status);
            expect(res.body.description).to.eql(newPerson.description);
            expect(res.body.dates).to.eql(newPerson.dates);
            expect(res.body.image).to.eql(newPerson.image);
            expect(res.body).to.have.property("id");
          });
        // .then(res =>
        //   supertest(app)
        //     .get(`/api/people/${res.body.id}`)
        //     .expect(res.body)
        // );
      });
      const requiredFields = [
        "person_name",
        "status",
        "description",
        "dates",
        "image"
      ];
      requiredFields.forEach(field => {
        const newPerson = {
          person_name: "Namey McName",
          status: "status",
          description: "description",
          dates: "dates",
          image: "image.jpg"
        };
        it(`responds with 500 and error message when ${field} is missing`, () => {
          delete newPerson[field];
          return supertest(app)
            .post("/api/people")
            .send(newPerson)
            .expect(500);
        });
      });
    });
    describe(`DELETE /api/people/:id`, () => {
      context(`Given no people`, () => {
        it(`responds with 404`, () => {
          const personId = 123456;
          return supertest(app)
            .delete(`/api/people/${personId}`)
            .expect(404, {
              error: { message: `person with ID ${personId} doesn't exist` }
            });
        });
      });

      context("Given there are people in the database", () => {
        // If no people in table, uncomment below

        const peopleArray = helpers.makePeopleArray();
        beforeEach("insert people", () => {
          return db.into("people").insert(peopleArray);
        });
        ////
        it("responds with 204 and removes the review", () => {
          const idToRemove = 1;
          const expectedPeople = peopleArray.filter(
            Review => Review.id !== idToRemove
          );
          return supertest(app)
            .delete(`/api/people/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/people`)
                .expect(expectedPeople)
            );
        });
        describe(`PUT /api/people/:review_id`, () => {
          context(`Given no people in db`, () => {
            it(`responds with 404`, () => {
              const personId = 123456;
              return supertest(app)
                .delete(`/api/people/${personId}`)
                .expect(404, {
                  error: { message: `person with Id ${personId} doesn't exist` }
                });
            });
          });

          context("Given there are people in the database", () => {
            const peopleArray = helpers.makePeopleArray();

            //   beforeEach("insert reviews", () => {
            //     return db.into("reviews").insert(testReviews);
            //   });

            it("responds with 204 and updates the person information", () => {
              const idToUpdate = 1;

              const updatedPerson = {
                id: 1,
                person_name: "updated name",
                status: "updated status",
                description: "updated description",
                dates: "updated date",
                image: "image.jpg"
              };

              const expected = {
                ...peopleArray[idToUpdate - 1],
                ...updatedPerson
              };
              return supertest(app)
                .put(`/api/people/${idToUpdate}`)
                .send(updatedPerson)
                .expect(204)
                .then(() =>
                  supertest(app)
                    .get(`/api/people/${idToUpdate}`)
                    .expect(expected)
                );
            });

            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2;
              return supertest(app)
                .put(`/api/people/${idToUpdate}`)
                .send({ irrelevantField: "foo" })
                .expect(400, {
                  error: {
                    message:
                      "Request body must contain either dates, name, description or status"
                  }
                });
            });
          });
        });
      });
    });
  });
});
