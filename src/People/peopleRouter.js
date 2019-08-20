const express = require("express");
const jsonParser = express.json();
const peopleRouter = express.Router();
const { peopleServices } = require("./peopleServices");

peopleRouter.route("/").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  peopleServices
    .getPeople(knexInstance)
    .then(people => {
      res.json(people);
    })
    .catch(next);
});
peopleRouter.route("/").post(jsonParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { person_name, dates, status, description, image } = req.body;
  const newPerson = { person_name, dates, status, description, image };
  for (const [key, value] of Object.entries(newPerson))
    if (value === null) {
      return res
        .status(400)
        .json({ error: { message: `Missing ${key} in request body` } });
    }

  peopleServices
    .postPerson(knexInstance, newPerson)
    .then(person => {
      const newPerson = person[0];
      res.status(201).json(newPerson);
    })
    .catch(next);
});
peopleRouter
  .route("/:id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    peopleServices
      .getPersonById(knexInstance, id)
      .then(person => {
        if (!person || person.length === 0) {
          res.status(404).json({ error: { message: "Person does not exist" } });
        }
        res.status(200).json(person[0]);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    peopleServices
      .deletePerson(knexInstance, id)
      .then(dbId => {
        if (!dbId) {
          res.status(404).json({
            error: { message: `person with ID ${id} doesn't exist ` }
          });
        }
        res.status(200).json({ message: `person with ID ${id} deleted` });
      })
      .catch(next);
  })
  .put(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    const { person_name, dates, status, description, image } = req.body;
    const personToUpdate = { person_name, dates, status, description, image };
    const numberOfValues = Object.values(personToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      res.status(400).json({
        error: {
          message:
            "Request body must contain either dates, name, description or status"
        }
      });
    }
    peopleServices
      .updatePerson(knexInstance, id, personToUpdate)
      .then(dbId => {
        if (!dbId) {
          res.status(404).json({
            message: `Person with id ${id} does not exist`
          });
        }
        res.status(201).json({ message: `Person with Id ${id} updated` });
      })
      .catch(next);
  });

module.exports = peopleRouter;
