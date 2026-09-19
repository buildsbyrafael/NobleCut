const app = require("./app");
const { sequelize } = require("./database/models");
const env = require("./config/env");

async function startServer() {
  try {
    await sequelize.authenticate();

    app.listen(env.port, () => {
      console.log(`NobleCut API running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Unable to start the application:", error);
    process.exit(1);
  }
}

startServer();