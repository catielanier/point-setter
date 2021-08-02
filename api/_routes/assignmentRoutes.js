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
      speakingPractice = [];
    (preTests = []), (totalPoints = filteredAssignments.length * 100);
    filteredAssignments.forEach((assignment) => {
      if (assignment.name.indexOf("Lesson") !== -1) {
        lessons.push(assignment);
      } else {
        if (
          assignment.name.toLowerCase().indexOf("rough draft") !== -1 ||
          assignment.name.toLowerCase().indexOf("1st draft") !== -1
        ) {
          drafts.push(assignment);
        } else {
          if (assignment.name.toLowerCase().indexOf("lab") !== -1) {
            labs.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("writing assignment") !==
              -1 ||
            assignment.name.toLowerCase().indexOf("writing") !== -1 ||
            assignment.name.toLowerCase().indexOf("project") !== -1 ||
            assignment.name.toLowerCase().indexOf("assignment") !== -1 ||
            assignment.name.toLowerCase().indexOf("activity") !== -1 ||
            assignment.name.toLowerCase().indexOf("essay") !== -1
          ) {
            classwork.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("discussion") !== -1 ||
            assignment.name.toLowerCase().indexOf("discuss") !== -1
          ) {
            discussions.push(assignment);
          }
          if (assignment.name.toLowerCase().indexOf("quiz") !== -1) {
            quizzes.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("unit exam") !== -1 ||
            assignment.name.toLowerCase().indexOf("midterm") !== -1 ||
            assignment.name.toLowerCase().indexOf("test") !== -1
          ) {
            unitExams.push(assignment);
          }
          if (assignment.name.toLowerCase().indexOf("final exam") !== -1) {
            finalExams.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("pre-test") !== -1 ||
            assignment.name.toLowerCase().indexOf("pretest") !== -1
          ) {
            preTests.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("speaking practice") !== -1
          ) {
            speakingPractice.push(assignment);
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
        (totalPoints * classworkWeight) / classwork.length
      );
    labPoints = labWeight
      ? Math.round((totalPoints * labWeight) / labs.length)
      : null;
    quizzes.forEach((quiz) => {
      quiz.points_possible = quizPoints;
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
    speakingPractice.forEach((practice) => {
      practice.points_possible = 0;
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
      speakingPractice,
    });
  } catch (e) {
    res.status(400);
  }
});

router.route("/").put(async (req, res) => {
  const { apiKey: access_token, course, assignments } = req.body.data;
  try {
    const returnedIds = [];
    assignments.forEach(assignment => {
      await axios({
        method: 'PUT',
        url: `https://icademymiddleeast.instructure.com/api/v1/courses/${course}/assignments/${assignment.id}`,
        params: {
          access_token
        },
        data: {
          assignment: {
            points_possible: assignment.points_possible
          }
        }
      })
      returnedIds.push(assignment.id)
    })
    res.status(201).json({
      returnedIds
    })
  } catch (e) {
    res.status(401)
  }
});

exports.router = router;
