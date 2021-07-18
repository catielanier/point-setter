"use strict";
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const router = express();

const middleWare = require("./_middleware");

const { applyMiddleware } = require("./_utils");
const { MONGODB_URI } = require("./_utils/constants");

const { router: courseRoutes } = require("./_routes/courseRoutes");

// import routers above this line
applyMiddleware(middleWare, router);

// use routes below this line
router.use("/api/courses", courseRoutes);

const server = http.createServer(router);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(4000, () => {
      console.log(`server running on port 4000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
