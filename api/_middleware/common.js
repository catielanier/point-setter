const bodyParser = require("body-parser");
const cors = require("cors");

exports.handleBodyRequestParsing = (router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json({ limit: "100mb" }));
};

exports.handleCors = (router) => {
  router.use(cors());
};
