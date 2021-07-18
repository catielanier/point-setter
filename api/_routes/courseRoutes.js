const express = require("express");
const axios = require("axios");

const { setParams, apiPagination } = require("../_helpers/pagination");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token } = req.query;
  try {
    let courses = [];
    const state = ["available", "unpublished"];
    const include = ["term"];
    const url = "https://canvas.instructure.com/api/v1/courses";

    const params = setParams(access_token, state, include);
    const canvasResults = await axios({
      method: "GET",
      url,
      headers: {
        Accept: "application/json+canvas-string-ids",
      },
      params,
    });
    canvasResults.data.forEach((course) => {
      courses.push(course);
    });
    if (canvasResults.data.length === 100) {
      params.page = 2;
      courses = await apiPagination(url, params, courses);
    }
    res.status(200).json({
      courses,
    });
  } catch (e) {
    res.status(400);
  }
});

exports.router = router;
