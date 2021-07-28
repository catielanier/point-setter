const { model: Teacher } = require("../_models/teacherModel");

exports.bulkAdd = async (arr) => {
  try {
    return await Teacher.insertMany(arr);
  } catch (e) {
    throw e;
  }
};

exports.addTeacher = async (teacher) => {
  try {
    return await Teacher.create(teacher);
  } catch (e) {
    throw e;
  }
};

exports.getAllTeachers = async () => {
  try {
    return await Teacher.find({});
  } catch (e) {
    throw e;
  }
};
