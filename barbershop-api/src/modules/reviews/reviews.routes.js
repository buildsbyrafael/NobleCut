const express = require("express");

const authenticationMiddleware = require("../../middlewares/authentication.middleware");
const authorizationMiddleware = require("../../middlewares/authorization.middleware");
const USER_TYPES = require("../../constants/user-types");

const reviewsController = require("./reviews.controller");
const { validateCreateReview } = require("./reviews.schema");

const router = express.Router();

router.post(
  "/:id/review",
  authenticationMiddleware,
  authorizationMiddleware(USER_TYPES.CLIENTE),
  validateCreateReview,
  reviewsController.create
);

module.exports = router;