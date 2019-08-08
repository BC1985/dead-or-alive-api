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

module.exports = peopleRouter;
