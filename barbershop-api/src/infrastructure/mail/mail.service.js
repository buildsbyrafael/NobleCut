const nodemailer = require("nodemailer");
const mailConfig = require("../../config/mail");
const passwordRecoveryTemplate = require("./templates/password-recovery");

let transporter = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass
    }
  });

  return transporter;
}

async function sendPasswordRecovery({ to, nome, token }) {
  const template = passwordRecoveryTemplate({
    nome,
    token
  });

  if (mailConfig.mode === "console") {
    console.log("");
    console.log("=== NobleCut Password Recovery ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${template.subject}`);
    console.log(template.text);
    console.log("==================================");
    console.log("");

    return;
  }

  const mailer = getTransporter();

  await mailer.sendMail({
    from: mailConfig.from,
    to,
    subject: template.subject,
    text: template.text
  });
}

module.exports = {
  sendPasswordRecovery
};