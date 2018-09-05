const mongoose = require("mongoose");
const shortId = require("shortid");

mongoose.connect(
  process.env.MLAB_URI || "mongodb://localhost/exercise-track",
  { useNewUrlParser: true }
);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    shortId: { type: String, unique: true, default: shortId.generate },
    exercices: [
      {
        description: String,
        duration: Number,
        date: String
      }
    ]
  },
  { usePushEach: true }
);

let Student = mongoose.model("Student", StudentSchema);

const createStudent = (name, done) => {
  let student = new Student({ name: name });
  student.save((err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findStudentById = (studentId, done) => {
  Student.findOne({ shortId: studentId }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const findStudentByName = (studentName, done) => {
  Student.findOne({ name: studentName }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const addExercice = (studentId, exercice, done) => {
  Student.findOne({ shortId: studentId }, (err, data) => {
    if (err) {
      return done(err);
    }
    data.exercices.push(exercice);
    data.save((err, data) => {
      if (err) {
        return done(err);
      }
      return done(null, data);
    });
  });
};

const findExercices = (studentId, done) => {
  Student.findOne({ shortId: studentId }, (err, data) => {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

const remove = (id, done) => {
  Student.deleteOne({ _id: id }, function(err) {});
};

exports.StudentModel = Student;
exports.createStudent = createStudent;
exports.addExercice = addExercice;
exports.findStudentById = findStudentById;
exports.findStudentByName = findStudentByName;
exports.findExercices = findExercices;
exports.remove = remove;
