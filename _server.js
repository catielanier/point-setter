"use strict";
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const path = require("path");
require("dotenv").config();

const { PORT, MONGODB_URI, ENVIRONMENT } = require("./api/_utils/constants");

const router = express();

const middleWare = require("./api/_middleware");

const { applyMiddleware } = require("./api/_utils");

const { router: courseRoutes } = require("./api/_routes/courseRoutes");
const { router: assignmentRoutes } = require("./api/_routes/assignmentRoutes");
const { router: userRoutes } = require("./api/_routes/userRoutes");
const { router: teacherRoutes } = require("./api/_routes/teacherRoutes");

// import routers above this line
applyMiddleware(middleWare, router);

// use routes below this line
router.use("/api/courses", courseRoutes);
router.use("/api/assignments", assignmentRoutes);
router.use("/api/users", userRoutes);
router.use("/api/teachers", teacherRoutes);
router.use("/", express.static(path.join(__dirname, "./dist")));

const server = http.createServer(router);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(ENVIRONMENT === "prod" ? PORT : 4000, () => {
      console.log(`server running on port 4000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
