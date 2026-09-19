const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const usersRoutes = require("../modules/users/users.routes");
const barbersRoutes = require("../modules/barbers/barbers.routes");

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

module.exports = router;