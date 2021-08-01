const axios = require("axios");

exports.setParams = function(
  access_token,
  state = [],
  include = [],
  order_by = null,
  page = 1
) {
  return {
    access_token,
    per_page: 100,
    page,
    state,
    include,
    order_by,
  };
};

const apiPagination = async function(url, params, array) {
  let lastLength = 0;
  do {
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
    lastLength = results.data.length;
    params.page += 1;
  } while (lastLength % 100 === 0);
  return array;
};

exports.apiPagination = apiPagination;
