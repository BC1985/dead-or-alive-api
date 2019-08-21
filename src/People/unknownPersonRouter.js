const express = require("express");
const jsonParser = express.json();
const unknownPersonRouter = express.Router();
const { peopleServices } = require("./peopleServices");

unknownPersonRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    peopleServices
      .getUnknownPeople(knexInstance)
      .then(people => {
        res.json(people);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { person_name } = req.body;
    const newPerson = { person_name };
    for (const [key, value] of Object.entries(newPerson))
      if (value === null) {
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request body` } });
      }
    peopleServices
      .personNotInDB(knexInstance, newPerson)
      .then(person => {
        const newPerson = person[0];
        res.status(201).json(newPerson);
      })
      .catch(next);
  });

unknownPersonRouter
  .route("/:id")
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    peopleServices
      .deleteUnknownPerson(knexInstance, id)
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
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    peopleServices
      .getUnknownPersonById(knexInstance, id)
      .then(person => {
        res.json(person[0]);
      })
      .catch(next);
  });

module.exports = unknownPersonRouter;
