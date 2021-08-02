const express = require("express");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token, course } = req.query;
  try {
    const quizWeight = 0.1,
      discussionWeight = 0.1,
      finalExamWeight = 0.15;
    let labWeight, unitExamWeight, classworkWeight;
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
      drafts = [],
      lessons = [],
      classwork = [],
      preTests = [],
      totalPoints = filteredAssignments.length * 100;
    filteredAssignments.forEach((assignment) => {
      if (assignment.name.indexOf("Lesson") !== -1) {
        lessons.push(assignment);
      } else {
        if (
          assignment.name.indexOf("Rough Draft") !== -1 ||
          assignment.name.indexOf("1st Draft") !== -1
        ) {
          drafts.push(assignment);
        } else {
          if (assignment.name.indexOf("Lab") !== -1) {
            labs.push(assignment);
          }
          if (
            assignment.name.indexOf("Writing Assignment") !== -1 ||
            assignment.name.indexOf("Writing") !== -1 ||
            assignment.name.indexOf("Project") !== -1 ||
            assignment.name.indexOf("Assignment") !== -1
          ) {
            classwork.push(assignment);
          }
          if (
            assignment.name.indexOf("Discussion") !== -1 ||
            assignment.name.indexOf("Discuss") !== -1
          ) {
            discussions.push(assignment);
          }
          if (assignment.name.indexOf("Quiz") !== -1) {
            quizzes.push(assignment);
          }
          if (
            assignment.name.indexOf("Unit Exam") !== -1 ||
            assignment.name.indexOf("Midterm") !== -1 ||
            assignment.name.indexOf("Test") !== -1
          ) {
            unitExams.push(assignment);
          }
          if (assignment.name.indexOf("Final Exam") !== -1) {
            finalExams.push(assignment);
          }
        }
      }
    });
    if (labs.length === 0) {
      labWeight = 0.25;
      classworkWeight = 0.15;
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
      classworkPoints = Math.round(
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
    });
    classwork.forEach((writingAssignment) => {
      writingAssignment.points_possible = classworkPoints;
    });
    finalExams[0].points_possible = finalExamPoints;
    unitExams.forEach((exam) => {
      exam.points_possible = unitExamPoints;
    });
    drafts.forEach((draft) => {
      draft.points_possible = 0;
    });
    preTests.forEach((preTest) => {
      preTest.points_possible = 0;
    });
    if (labWeight) {
      labs.forEach((lab) => {
        lab.points_possible = labPoints;
      });
    }
    lessons.forEach((lesson) => {
      lesson.points_possible = 0;
    });
    res.status(200).json({
      labs,
      quizzes,
      finalExams,
      unitExams,
      discussions,
      classwork,
      drafts,
      lessons,
      preTests,
    });
  } catch (e) {
    res.status(400);
  }
});

exports.router = router;
