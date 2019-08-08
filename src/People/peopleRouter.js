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

  peopleRouter.route("/").post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { person_name, dates, status, description } = req.body;
    const newPerson = { person_name, dates, status, description };
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
});

module.exports = peopleRouter;
