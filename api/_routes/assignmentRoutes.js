const express = require("express");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token, course } = req.query;
  try {
    const quizWeight = 0.1,
      discussionWeight = 0.1,
      finalExamWeight = 0.15;
    let labWeight,
      unitExamWeight,
      writingAssignmentWeight,
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
      discussions = [],
      writingAssignments = [],
      totalPoints = filteredAssignments.length * 100;
    filteredAssignments.forEach((assignment) => {
      if (assignment.name.indexOf("Project:") !== -1) {
        if (assignment.name.indexOf("Lab") !== -1) {
          labs.push(assignment);
        } else if (assignment.name.indexOf("Writing Assignment") !== -1) {
          writingAssignments.push(assignment);
        } else {
          discussions.push(assignment);
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
      writingAssignmentWeight = 0.15;
      unitExamWeight = 0.25;
    } else {
      writingAssignmentWeight = 0.3;
      unitExamWeight = 0.35;
    }
    const quizPoints = Math.round((totalPoints * quizWeight) / quizzes.length),
      discussionPoints = Math.round(
        (totalPoints * discussionWeight) / discussions.length
      ),
      finalExamPoints = Math.round(totalPoints * finalExamWeight),
      unitExamPoints = Math.round(
        (totalPoints * unitExamWeight) / unitExams.length
      ),
      writingAssignmentPoints = Math.round(
        (totalPoints * writingAssignmentWeight) / writingAssignments.length
      );
    labPoints = labWeight
      ? Math.round((totalPoints * labWeight) / labs.length)
      : null;
    quizzes.forEach((quiz) => {
      quiz.points_possible = quizPoints;
      assignments.push(quiz);
    });
    discussions.forEach((project) => {
      project.points_possible = discussionPoints;
      assignments.push(project);
    });
    writingAssignments.forEach((writingAssignment) => {
      writingAssignment.points_possible = writingAssignmentPoints;
      assignments.push(writingAssignment);
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
