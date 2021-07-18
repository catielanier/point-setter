"use strict";
const express = require("express");
const http = require("http");

const router = express();

const middleWare = require("./_middleware");

const { applyMiddleware } = require("./_utils");

// import routers above this line
applyMiddleware(middleWare, router);

// use routes below this line

const server = http.createServer(router);

server.listen(4000, () => {
  console.log(`server running on port 4000`);
});
