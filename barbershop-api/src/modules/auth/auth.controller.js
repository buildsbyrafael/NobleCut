const authService = require("./auth.service");

async function register(req, res) {
  const usuario = await authService.registerClient(req.body);

  return res.status(201).json({
    data: usuario
  });
}

async function login(req, res) {
  const result = await authService.login(req.body);

  return res.status(200).json({
    data: result
  });
}

async function passwordRecovery(req, res) {
  await authService.requestPasswordRecovery(req.body);

  return res.status(202).json({
    data: {
      message:
        "Se houver uma conta associada ao e-mail informado, as instruções de recuperação serão enviadas."
    }
  });
}

async function passwordReset(req, res) {
  await authService.resetPassword(req.body);

  return res.status(204).send();
}

module.exports = {
  register,
  login,
  passwordRecovery,
  passwordReset
};