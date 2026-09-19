require("dotenv").config();

module.exports = {
  mode: process.env.MAIL_MODE || "console",
  from: process.env.MAIL_FROM || "NobleCut <no-reply@noblecut.local>",
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === "true",
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS
};