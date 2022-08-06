const express = require("express");
const axios = require("axios");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

const { API_KEY: access_token } = require("../_utils/constants");

router.route("/").get(async (req, res) => {
  const { course } = req.query;
  try {
    const url = `https://icademymiddleeast.instructure.com/api/v1/courses/${course}/assignments`,
      params = setParams(access_token, [], [], "position"),
      allAssignments = await apiPagination(url, params, []),
      regex = /([A-Za-z\s])/,
      filteredAssignments = allAssignments.filter((assignment) => {
        return (
          !regex.test(assignment.name.charAt(0)) &&
          assignment.published === true &&
          assignment.name.indexOf("Extra Credit") === -1 &&
          assignment.name.indexOf("Bonus") === -1
        );
      }),
      unitExams = [],
      quizzes = [],
      finalExams = [],
      labs = [],
      drafts = [],
      lessons = [],
      speakingPractice = [],
      preTests = [];
    let labWeight,
      quizWeight = 0.1,
      finalExamWeight = 0.15,
      unitExamWeight,
      classworkWeight,
      discussions = [],
      classwork = [],
      totalPoints = 1000;
    filteredAssignments.forEach((assignment) => {
      if (
        assignment.name.toLowerCase().indexOf("lesson") !== -1 &&
        assignment.name.toLowerCase().indexOf("activity") === -1 &&
        assignment.name.toLowerCase().indexOf("discussion") === -1
      ) {
        lessons.push(assignment);
      } else {
        if (
          assignment.name.toLowerCase().indexOf("rough draft") !== -1 ||
          assignment.name.toLowerCase().indexOf("1st draft") !== -1
        ) {
          drafts.push(assignment);
        } else {
          if (
            (assignment.name.toLowerCase().indexOf("lab") !== -1 &&
              assignment.name.toLowerCase().indexOf("labor") === -1) ||
            (assignment.name.toLowerCase().indexOf("project") !== -1 &&
              assignment.name.toLowerCase().indexOf("writing") === -1) ||
            assignment.name.toLowerCase().indexOf("essay") !== -1 ||
            assignment.name.toLowerCase().indexOf("research paper") !== -1
          ) {
            labs.push(assignment);
          }
          if (
            (assignment.name.toLowerCase().indexOf("writing assignment") !==
              -1 ||
              (assignment.name.toLowerCase().indexOf("writing") !== -1 &&
                assignment.name.toLowerCase().indexOf("research paper") ===
                  -1 &&
                assignment.name.toLowerCase().indexOf("essay") === -1) ||
              assignment.name.toLowerCase().indexOf("assignment") !== -1 ||
              assignment.name.toLowerCase().indexOf("activity") !== -1) &&
            assignment.name.toLowerCase().indexOf("final exam") === -1 &&
            assignment.name.toLowerCase().indexOf("discussion") === -1
          ) {
            classwork.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("discussion") !== -1 ||
            assignment.name.toLowerCase().indexOf("discuss") !== -1 ||
            assignment.name.toLowerCase().indexOf("art talk") !== -1 ||
            assignment.name.toLowerCase().indexOf("art forum") !== -1
          ) {
            discussions.push(assignment);
          }
          if (assignment.name.toLowerCase().indexOf("quiz") !== -1) {
            quizzes.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("midterm") !== -1 ||
            assignment.name.toLowerCase().indexOf("test") !== -1
          ) {
            unitExams.push(assignment);
          }
          if (
            assignment.name.toLowerCase().indexOf("exam") !== -1 &&
            assignment.name.toLowerCase().indexOf("unit") !== -1 &&
            assignment.name.toLowerCase().indexOf("review") === -1
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
    if (discussions.length && discussions.length >= 30) {
      classwork = [...classwork, ...discussions];
      discussions = [];
    }
    if (labs.length !== 0) {
      labWeight = classwork.length ? 0.25 : 0.45;
      classworkWeight = classwork.length ? 0.2 : null;
      unitExamWeight = 0.25;
    } else {
      classworkWeight = 0.35;
      unitExamWeight = 0.35;
    }
    if (finalExams.length === 0) {
      classworkWeight += finalExamWeight;
      finalExamWeight = 0;
    }
    if (unitExams.length === 0) {
      quizWeight += unitExamWeight;
      unitExamWeight = 0;
    }
    if (discussions.length > 0) {
      discussions.forEach((discussion) => {
        discussion.points_possible = 20;
      });
      const totalDiscussionPoints = discussions.length * 20;
      totalPoints = totalDiscussionPoints * 20;
    } else {
      totalPoints = 1000;
      classworkWeight += 0.05;
    }
    const quizPoints = Math.round((totalPoints * quizWeight) / quizzes.length),
      finalExamPoints = Math.round(
        (totalPoints * finalExamWeight) / finalExams.length
      ),
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
    classwork.forEach((writingAssignment) => {
      writingAssignment.points_possible = classworkPoints;
    });
    finalExams.forEach((exam) => {
      exam.points_possible = finalExamPoints;
    });
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
    const labsTotal = labs.length ? labs[0].points_possible * labs.length : 0,
      classworkTotal = classwork.length
        ? classwork[0].points_possible * classwork.length
        : 0,
      discussionsTotal = discussions.length ? 20 * discussions.length : 0,
      quizzesTotal = quizzes.length
        ? quizzes[0].points_possible * quizzes.length
        : 0,
      unitExamsTotal = unitExams.length
        ? unitExams[0].points_possible * unitExams.length
        : 0,
      finalExamsTotal = finalExams.length
        ? finalExams[0].points_possible * finalExams.length
        : 0;

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
      totalPoints,
      labsTotal,
      classworkTotal,
      discussionsTotal,
      quizzesTotal,
      unitExamsTotal,
      finalExamsTotal,
    });
  } catch (e) {
    res.status(400);
  }
});

router.route("/").put(async (req, res) => {
  const { course, assignment } = req.body;
  try {
    const _ = await axios({
      method: "PUT",
      url: `https://icademymiddleeast.instructure.com/api/v1/courses/${course}/assignments/${assignment.id}`,
      params: {
        access_token,
      },
      data: {
        assignment: {
          points_possible: assignment.points_possible,
        },
      },
    });
    const returnedId = assignment.id;
    res.status(201).json({
      returnedId,
    });
  } catch (e) {
    res.status(401);
  }
});

exports.router = router;
