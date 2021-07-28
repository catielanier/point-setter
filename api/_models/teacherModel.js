"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

exports.model = mongoose.model("Teacher", teacherSchema);
