const { registerStudent } = require('../controllers/student.controllers');

const studentRoute = require('express').Router();

studentRoute.post('/register', registerStudent);

module.exports = studentRoute;
