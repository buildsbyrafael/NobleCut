const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const usersRoutes = require("../modules/users/users.routes");
const barbersRoutes = require("../modules/barbers/barbers.routes");
const servicesRoutes = require("../modules/services/services.routes");
const availabilityRoutes = require("../modules/availability/availability.routes");
const appointmentsRoutes = require("../modules/appointments/appointments.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    data: {
      status: "ok"
    }
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/barbers", barbersRoutes);
router.use("/services", servicesRoutes);
router.use("/availability", availabilityRoutes);
router.use("/appointments", appointmentsRoutes);

module.exports = router;