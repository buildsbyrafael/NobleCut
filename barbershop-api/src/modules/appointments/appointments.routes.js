const express = require("express");
const appointmentsController = require("./appointments.controller");
const {
  validateCreateAppointment,
  validateListAppointments,
  validateAppointmentId
} = require("./appointments.schema");
const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const authorizationMiddleware = require("../../middlewares/authorization.middleware");
const USER_TYPES = require("../../constants/user-types");

const router = express.Router();

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateCreateAppointment,
  appointmentsController.create
);

router.get(
  "/",
  authenticationMiddleware,
  validateListAppointments,
  appointmentsController.list
);

router.get(
  "/:id",
  authenticationMiddleware,
  validateAppointmentId,
  appointmentsController.getById
);

router.patch(
  "/:id/cancel",
  authenticationMiddleware,
  validateAppointmentId,
  appointmentsController.cancel
);

router.patch(
  "/:id/complete",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateAppointmentId,
  appointmentsController.complete
);

module.exports = router;