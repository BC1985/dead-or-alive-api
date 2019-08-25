require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const peopleRouter = require("./People/peopleRouter");
const unknownPersonRouter = require("./People/unknownPersonRouter");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use("/api/people", peopleRouter);
app.use("/api/not_in_db", unknownPersonRouter);
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

module.exports = app;
