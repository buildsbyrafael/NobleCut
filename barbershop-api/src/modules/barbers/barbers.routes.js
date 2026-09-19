const express = require("express");
const barbersController = require("./barbers.controller");
const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const authorizationMiddleware = require("../../middlewares/authorization.middleware");
const validationMiddleware = require("../../middlewares/validation.middleware");
const {
  createBarberSchema,
  updateBarberSchema,
  updateBarberServicesSchema
} = require("./barbers.schema");
const USER_TYPES = require("../../constants/user-types");

const router = express.Router();

router.get(
  "/",
  authenticationMiddleware,
  barbersController.list
);

router.get(
  "/:id/services",
  authenticationMiddleware,
  barbersController.getServices
);

router.get(
  "/:id/reviews",
  authenticationMiddleware,
  barbersController.getReviews
);

router.get(
  "/:id",
  authenticationMiddleware,
  barbersController.getById
);

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(createBarberSchema),
  barbersController.create
);

router.patch(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(updateBarberSchema),
  barbersController.update
);

router.put(
  "/:id/services",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(updateBarberServicesSchema),
  barbersController.updateServices
);

module.exports = router;