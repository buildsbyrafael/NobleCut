const usersService = require("./users.service");

async function me(req, res) {
  const usuario = await usersService.getAuthenticatedUser(req.user.id);

  return res.status(200).json({
    data: usuario
  });
}

async function updateMe(req, res) {
  const usuario = await usersService.updateAuthenticatedUser(
    req.user.id,
    req.body
  );

  return res.status(200).json({
    data: usuario
  });
}

module.exports = {
  me,
  updateMe
};