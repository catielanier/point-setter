const express = require("express");
const router = express.Router();
const userService = require("../_services/userService");
const tokenService = require("../_utils/tokenService");

router.route("/signup").post(async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await userService.createUser(req.body.data);
    res.status(201).json({
      data: [user],
    });
  } catch (e) {
    next(e);
  }
});

router.route("/login").post(async (req, res, next) => {
  try {
    const user = await userService.isUser(req.body.data);
    if (user) {
      const token = await tokenService.issueToken(user);
      res.status(200).json({
        data: {
          token,
          id: user._id,
        },
      });
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
});

exports.router = router;
