const { Sequelize } = require("sequelize");
const env = require("../config/env");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: env.databasePath,
  logging: false
});

module.exports = sequelize;
