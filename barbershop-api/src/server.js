const app = require("./app");
const sequelize = require("./database/connection");
const env = require("./config/env");
const {
  startAppointmentCompletionScheduler
} = require(
  "./infrastructure/scheduler/appointment-completion.scheduler"
);

async function startServer() {
  try {
    await sequelize.authenticate();

    app.listen(env.port, () => {
      console.log(`NobleCut API running on port ${env.port}`);

      startAppointmentCompletionScheduler();
    });
  } catch (error) {
    console.error("Unable to start the application:", error);
    process.exit(1);
  }
}

startServer();