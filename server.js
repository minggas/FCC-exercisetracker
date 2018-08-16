const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var router = express.Router();

const cors = require("cors");

const mongoose = require("mongoose");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

var Student = require("./Models.js").Student;
var createStudent = require("./Models.js").createStudent;
var findStudentId = require("./Models.js").findStudentById;
var findStudentName = require("./Models.js").findStudentByName;
var addExercice = require("./Models.js").addExercice;
var findExercices = require("./Models.js").findExercices;
var remove = require("./Models.js").remove;

router.post("/new-user", function(req, res, next) {
  const name = req.body.username;
  findStudentName(req.body.username, function(err, data) {
    if (err) {
      return next(err);
    }
    if (!data) {
      createStudent(name, function(err, data) {
        if (err) {
          return next(err);
        }
        res.json({ username: data.name, id: data._id });
      });
    } else {
      res.json({ error: "username already in use" });
    }
  });
});

router.post("/add", function(req, res, next) {
  const exercice = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };
  addExercice(req.body.userId, exercice, function(err, data) {
    if (err) {
      return next(err);
    }
    res.json({
      username: data.name,
      description: exercice.description,
      duration: exercice.duration,
      id: data._id,
      date: exercice.date
    });
  });
});
router.get("/clear", (req, res, next) => {
  remove(req.query.userId, (err, data) => {
    if (err) {
      return next(err);
    }
  });
});

//{userId}[&from][&to][&limit]
router.get("/log", function(req, res, next) {
  const fromDate = req.query.from || "1700-01-01";
  const toDate = req.query.to || "2018-08-30";
  const resLimit = req.query.limit || 1;
  findExercices(req.query.userId, (err, data) => {
    if (err) {
      return next(err);
    }
    console.log(data, fromDate, toDate, resLimit);
    const exe = data
      .filter(date => date.date <= toDate && date.date >= fromDate)
      .slice(0, resLimit);
    res.json({
      username: req.query.userId,
      exercices: exe,
      id: req.query.userId
    });
  });
});

app.use("/api/exercise", router);

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
