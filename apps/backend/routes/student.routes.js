const {
  registerOrUpdateEvent,
  getStudentsByEventAndCollege,
  getStudentsByEachEvent,
  getStudentsByEachCollege,
  getStudentsBySpecificCollege,
  getStudentsBySpecificEvent,
  getStudentsWithSpecificEventAndCollege,
} = require("../controllers/student.controllers");

const studentRoute = require("express").Router();

studentRoute.post("/register", registerOrUpdateEvent);

studentRoute.get("/students-by-each-event", getStudentsByEachEvent);

studentRoute.get("/students-by-each-college", getStudentsByEachCollege);

studentRoute.post("/students-by-specific-event", getStudentsBySpecificEvent);

studentRoute.post(
  "/students-by-specific-college",
  getStudentsBySpecificCollege
);

studentRoute.post(
  "/students-with-specific-event-and-college",
  getStudentsWithSpecificEventAndCollege
);

module.exports = studentRoute;
