const axios = require("axios");

exports.setParams = function (
  access_token,
  state = [],
  include = [],
  page = 1
) {
  return {
    access_token,
    per_page: 100,
    page,
    state,
    include,
  };
};

exports.apiPagination = async function (url, params, array) {
  const results = await axios({
    method: "GET",
    url,
    headers: {
      Accept: "application/json+canvas-string-ids",
    },
    params,
  });
  results.data.forEach((item) => {
    array.push(item);
  });
  if (results.data.length === 100) {
    params.page += 1;
    await apiPagination(url, params, array);
  } else {
    return array;
  }
};
