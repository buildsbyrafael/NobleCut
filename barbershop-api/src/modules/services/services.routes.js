const express = require("express");

const servicesController = require("./services.controller");
const {
  createServiceSchema,
  updateServiceSchema
} = require("./services.schema");

const authenticationMiddleware = require(
  "../../middlewares/authentication.middleware"
);

const authorizationMiddleware = require(
  "../../middlewares/authorization.middleware"
);

const validationMiddleware = require(
  "../../middlewares/validation.middleware"
);

const USER_TYPES = require("../../constants/user-types");

const router = express.Router();

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(createServiceSchema),
  servicesController.create
);

router.get(
  "/",
  authenticationMiddleware,
  servicesController.list
);

router.get(
  "/:id",
  authenticationMiddleware,
  servicesController.getById
);

router.patch(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  validationMiddleware(updateServiceSchema),
  servicesController.update
);

router.delete(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.ADMINISTRADOR),
  servicesController.remove
);

module.exports = router;