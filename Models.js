const mongoose = require("mongoose");

mongoose.connect(
  process.env.MLAB_URI || "mongodb://localhost/exercise-track",
  { useNewUrlParser: true }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
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

var Student = mongoose.model("Student", StudentSchema);

var createStudent = function(name, done) {
  var student = new Student({ name: name });
  student.save(function(err, data) {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

var findStudentById = function(studentId, done) {
  Student.findById(studentId, function(err, data) {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

var findStudentByName = function(studentName, done) {
  Student.findOne({ name: studentName }, function(err, data) {
    if (err) {
      return done(err);
    }
    return done(null, data);
  });
};

var addExercice = function(personId, exercice, done) {
  Student.findById({ _id: personId }, function(err, data) {
    if (err) {
      return done(err);
    }
    data.exercices.push(exercice);
    data.save(function(err, data) {
      if (err) {
        return done(err);
      }
      return done(null, data);
    });
  });
};

var findExercices = function(personId, done) {
  Student.findById(
    {
      _id: personId
    },
    function(err, data) {
      if (err) {
        return done(err);
      }
      return done(null, data.exercices);
    }
  );
};

var remove = function(id, done) {
  Student.deleteOne({ _id: id }, function(err) {});
};

exports.StudentModel = Student;
exports.createStudent = createStudent;
exports.addExercice = addExercice;
exports.findStudentById = findStudentById;
exports.findStudentByName = findStudentByName;
exports.findExercices = findExercices;
exports.remove = remove;
