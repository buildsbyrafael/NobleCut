const express = require("express");
const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const authorizationMiddleware = require("../../middlewares/authorization.middleware");
const USER_TYPES = require("../../constants/user-types");
const availabilityController = require("./availability.controller");
const {
  validateSlots,
  validateBarbers,
  validateBarberServices
} = require("./availability.schema");

const router = express.Router();

router.get(
  "/slots",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateSlots,
  availabilityController.listSlots
);

router.get(
  "/barbers",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateBarbers,
  availabilityController.listBarbers
);

router.get(
  "/barbers/:barberId/services",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateBarberServices,
  availabilityController.listBarberServices
);

module.exports = router;