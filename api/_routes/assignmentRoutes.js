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
      });
    res.status(200).json({
      assignments: filteredAssignments,
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
