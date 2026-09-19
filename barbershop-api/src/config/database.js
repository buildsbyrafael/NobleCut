require("dotenv").config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: process.env.DATABASE_PATH || "src/database/barbershop.sqlite",
    logging: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },
  production: {
    dialect: "sqlite",
    storage: process.env.DATABASE_PATH || "src/database/barbershop.sqlite",
    logging: false
  }
};
