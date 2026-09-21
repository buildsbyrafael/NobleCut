const express = require("express");
const swaggerUi = require("swagger-ui-express");

const openapiDocument = require("../docs/openapi");

const authRoutes = require("../modules/auth/auth.routes");
const usersRoutes = require("../modules/users/users.routes");
const barbersRoutes = require("../modules/barbers/barbers.routes");
const servicesRoutes = require("../modules/services/services.routes");
const availabilityRoutes = require("../modules/availability/availability.routes");
const appointmentsRoutes = require("../modules/appointments/appointments.routes");
const reviewsRoutes = require("../modules/reviews/reviews.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    data: {
      status: "ok"
    }
  });
});

router.get("/docs.json", (req, res) => {
  return res.status(200).json(openapiDocument);
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument, {
    customSiteTitle: "NobleCut API Docs",
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/barbers", barbersRoutes);
router.use("/services", servicesRoutes);
router.use("/availability", availabilityRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/appointments", reviewsRoutes);

module.exports = router;