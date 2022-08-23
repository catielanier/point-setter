const express = require("express");
const axios = require("axios");

const router = express.Router();

const { API_KEY: access_token } = require("../_utils/constants");

router.route("/").get(async (req, res) => {
  const { course } = req.query;
  try {
    const results = await axios({
      method: "GET",
      url: `https://vpa.instructure.com/api/v1/courses/${course}/assignments`,
      headers: {
        Accept: "application/json+canvas-string-ids",
      },
      params: {
        access_token,
        per_page: 100,
        order_by: "position",
      },
    });
    const assignments = [];
    const regex = /([A-Za-z\s])/;
    await results.data.forEach((assignment) => {
      const index = assignment.name.indexOf("Extra Credit");
      const index2 = assignment.name.indexOf("Bonus");
      const index3 = assignment.name.indexOf("Get Started");
      const index4 = assignment.name.indexOf("Resubmission");
      const isPublished = assignment.published;
      const isNumbered = !regex.test(assignment.name.charAt(0));
      const isExtraCredit =
        index !== -1 || index2 !== -1 || index3 !== -1 || index4 !== -1;
      if (isPublished && isNumbered && !isExtraCredit) {
        assignments.push(assignment);
      }
    });
    console.log(results.data.length);
    if (results.data.length === 100) {
      let currentPage = 2;
      async function apiPagination() {
        const assignmentRes = await axios({
          method: "GET",
          url: `https://vpa.instructure.com/api/v1/courses/${course}/assignments`,
          headers: {
            Accept: "application/json+canvas-string-ids",
          },
          params: {
            access_token,
            per_page: 100,
            include: ["overrides", "observed_users"],
            order_by: "position",
            page: currentPage,
          },
        });
        assignmentRes.data.forEach((assignment) => {
          const index = assignment.name.indexOf("Extra Credit");
          const index2 = assignment.name.indexOf("Bonus");
          const index3 = assignment.name.indexOf("Get Started");
          const index4 = assignment.name.indexOf("Resubmission");
          const isPublished = assignment.published;
          const isNumbered = !regex.test(assignment.name.charAt(0));
          const isExtraCredit =
            index !== -1 || index2 !== -1 || index3 !== -1 || index4 !== -1;
          if (isPublished && isNumbered && !isExtraCredit) {
            assignments.push(assignment);
          }
        });
        if (assignmentRes.data.length === 100) {
          currentPage += 1;
          apiPagination();
        }
      }
      apiPagination();
    }
    res.status(200).json({
      assignments,
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
      url: `https://vpa.instructure.com/api/v1/courses/${course}/assignments/${assignment.id}`,
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
