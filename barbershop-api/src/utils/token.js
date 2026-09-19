const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

function generateAccessToken(usuario) {
  return jwt.sign(
    {
      tipo: usuario.tipo
    },
    authConfig.secret,
    {
      subject: usuario.id,
      expiresIn: authConfig.expiresIn
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, authConfig.secret);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken
};