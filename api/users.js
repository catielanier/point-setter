const express = require("express");
const mongoose = require("mongoose");
const { router: userRouter } = require("./_routes/userRoutes");
const { MONGODB_URI } = process.env;

const middleWare = require("./_middleware");

const { applyMiddleware } = require("./_utils");

mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

const app = express();

applyMiddleware(middleWare, app);

app.use("/api/users", userRouter);

module.exports = app;
