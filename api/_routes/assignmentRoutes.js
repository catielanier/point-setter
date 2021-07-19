const express = require("express");
const { assign } = require("svelte/internal");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token, course } = req.query;
  try {
    const unitExamWeight = 0.25,
      quizWeight = 0.1,
      finalExamWeight = 0.15;
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
      projects = [],
      totalPoints = filteredAssignments.length * 100;
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
      labWeight = 0.25;
      projectWeight = 0.25;
    } else {
      projectWeight = 0.5;
    }
    const quizPoints = Math.round((totalPoints * quizWeight) / quizzes.length),
      projectPoints = Math.round(
        (totalPoints * projectWeight) / projects.length
      ),
      finalExamPoints = Math.round(totalPoints * finalExamWeight),
      unitExamPoints = Math.round(
        (totalPoints * unitExamWeight) / unitExams.length
      ),
      labPoints = labWeight
        ? Math.round((totalPoints * labWeight) / labs.length)
        : null;
    quizzes.forEach((quiz) => {
      quiz.points_possible = quizPoints;
      assignments.push(quiz);
    });
    projects.forEach((project) => {
      project.points_possible = projectPoints;
      assignments.push(project);
    });
    finalExams[0].points_possible = finalExamPoints;
    assignments.push(finalExams[0]);
    unitExams.forEach((exam) => {
      exam.points_possible = unitExamPoints;
      assignments.push(exam);
    });
    if (labWeight) {
      labs.forEach((lab) => {
        lab.points_possible = labPoints;
        assignments.push(lab);
      });
    }
    assignments.sort((x, y) => {
      return x.name - y.name;
    });
    res.status(200).json({
      assignments,
      labs,
      quizzes,
      finalExams,
      unitExams,
      projects,
    });
  } catch (e) {
    res.status(400);
  }
});

exports.router = router;
