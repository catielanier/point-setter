const express = require("express");
const { assign } = require("svelte/internal");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token, course } = req.query;
  try {
    const unitExamWeight = 25,
      quizWeight = 10,
      finalExamWeight = 15;
    let labWeight,
      projectWeight,
      assignments = [];
    const url = `https://icademymiddleeast.instructure.com/api/v1/courses/${course}/assignments`;
    const params = setParams(access_token, [], [], "position");
    const allAssignments = await apiPagination(url, params, []);
    const regex = /([A-Za-z\s])/;
    const filteredAssignments = allAssignments.filter((assignment) => {
      return (
        !regex.test(assignment.name.charAt(0)) &&
        assignment.published === true &&
        assignment.name.indexOf("Extra Credit") === -1 &&
        assignment.name.indexOf("Bonus") === -1
      );
    });
    const unitExams = [],
      quizzes = [],
      finalExams = [],
      labs = [],
      projects = [];
    filteredAssignments.forEach((assignment) => {
      if (assignment.name.indexOf("Project:") !== -1) {
        if (assignment.name.indexOf("Lab") !== -1) {
          labs.push(assignment);
        } else {
          projects.push(assignment);
        }
      }
      if (assignment.name.indexOf("Quiz") !== -1) {
        quizzes.push(assignment);
      }
      if (assignment.name.indexOf("Unit Exam") !== -1) {
        unitExams.push(assignment);
      }
      if (assignment.name.indexOf("Final Exam") !== -1) {
        finalExams.push(assignment);
      }
    });
    if (labs.length === 0) {
      labWeight = 25;
      projectWeight = 25;
    } else {
      projectWeight = 50;
    }
  } catch (e) {
    res.status(400);
  }
});

exports.router = router;
