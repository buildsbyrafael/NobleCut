const express = require("express");
const barbersController = require("./barbers.controller");
const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const authorizationMiddleware = require("../../middlewares/authorization.middleware");
const validationMiddleware = require("../../middlewares/validation.middleware");
const { createBarberSchema } = require("./barbers.schema");
const USER_TYPES = require("../../constants/user-types");

const router = express.Router();

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(createBarberSchema),
  barbersController.create
);

module.exports = router;