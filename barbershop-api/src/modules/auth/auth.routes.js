const express = require("express");
const authController = require("./auth.controller");
const validationMiddleware = require("../../middlewares/validation.middleware");
const {
  registerSchema,
  loginSchema,
  passwordRecoverySchema,
  passwordResetSchema
} = require("./auth.schema");

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(registerSchema),
  authController.register
);

router.post(
  "/login",
  validationMiddleware(loginSchema),
  authController.login
);

router.post(
  "/password-recovery",
  validationMiddleware(passwordRecoverySchema),
  authController.passwordRecovery
);

router.post(
  "/password-reset",
  validationMiddleware(passwordResetSchema),
  authController.passwordReset
);

module.exports = router;