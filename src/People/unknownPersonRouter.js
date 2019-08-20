const express = require("express");
const jsonParser = express.json();
const unknownPersonRouter = express.Router();
const { peopleServices } = require("./peopleServices");

unknownPersonRouter.route("/").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  peopleServices
    .getUnknownPerson(knexInstance)
    .then(people => {
      res.json(people);
    })
    .catch(next);
});
unknownPersonRouter.route("/").post(jsonParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { person_name } = req.body;
  const newPerson = { person_name };
  for (const [key, value] of Object.entries(newPerson))
    if (value === null) {
      return res
        .status(400)
        .json({ error: { message: `Missing ${key} in request body` } });
    }
  newPerson.person_name = req.person_name;
  peopleServices
    .personNotInDB(knexInstance, newPerson)
    .then(person => {
      const newPerson = person[0];
      res.status(201).json(newPerson);
    })
    .catch(next);
  console.log(newPerson);
});

module.exports = unknownPersonRouter;
