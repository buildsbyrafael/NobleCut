const express = require("express");
const usersController = require("./users.controller");
const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const validationMiddleware = require("../../middlewares/validation.middleware");
const { updateMeSchema } = require("./users.schema");

const router = express.Router();

router.get(
  "/me",
  authenticationMiddleware,
  usersController.me
);

router.patch(
  "/me",
  authenticationMiddleware,
  validationMiddleware(updateMeSchema),
  usersController.updateMe
);

module.exports = router;