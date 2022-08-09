const express = require("express");
const axios = require('axios')

const { API_KEY: access_token, ACCOUNT_NO: accountNo } = require("../_utils/constants");

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const courses = [];
		const result = await axios({
      method: "GET",
			url: `https://vpa.instructure.com/api/v1/accounts/${accountNo}/courses`,
			headers: {
        Accept: "application/json+canvas-string-ids"
			},
			params: {
        access_token,
				per_page: 100
			}
		});
		result.data.forEach(course => {
			courses.push(course);
		});
		if (result.data.length === 100) {
			let currentPage = 2;
			async function apiPagination() {
				const courseRes = await axios({
					method: "GET",
					url: `https://vpa.instructure.com/api/v1/accounts/${accountNo}/courses`,
					headers: {
						Accept: "application/json+canvas-string-ids"
					},
					params: {
						access_token,
						per_page: 100,
						page: currentPage
					}
				});
				courseRes.data.forEach(course => {
					courses.push(course);
				});
				if (courseRes.data.length === 100) {
					currentPage += 1;
					await apiPagination();
				}
			}
			await apiPagination();
		}
		res.status(200).json({
			data: courses
		});
	} catch (e) {
		res.status(400);
	}
});

exports.router = router;
