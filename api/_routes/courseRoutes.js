const express = require("express");
const axios = require("axios");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const { apiKey: access_token } = req.query;
  try {
    const courses = [];
    const canvasResults = await axios({
      method: "GET",
      url: "https://canvas.instructure.com/api/v1/courses",
      headers: {
        Accept: "application/json+canvas-string-ids",
      },
      params: {
        access_token,
        per_page: 100,
        state: ["available", "unpublished"],
        include: ["term"],
      },
    });
    canvasResults.data.forEach((course) => {
      courses.push(course);
    });
    if (canvasResults.data.length === 100) {
      let page = 1;
      async function apiPagination() {
        const nextPageResults = await axios({
          method: "GET",
          url: "https://canvas.instructure.com/api/v1/courses",
          headers: {
            Accept: "application/json+canvas-string-ids",
          },
          params: {
            access_token,
            per_page: 100,
            state: ["available", "unpublished"],
            include: ["term"],
            page,
          },
        });
        nextPageResults.data.forEach((course) => {
          courses.push(course);
        });
        if (nextPageResults.data.length === 100) {
          page++;
          await apiPagination();
        }
      }
      await apiPagination();
    }
    res.status(200).json({
      courses,
    });
  } catch (e) {
    res.status(400);
  }
});

exports.router = router;
