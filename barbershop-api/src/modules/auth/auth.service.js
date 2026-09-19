const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize");
const authRepository = require("./auth.repository");
const AppError = require("../../utils/AppError");
const { generateAccessToken } = require("../../utils/token");
const USER_TYPES = require("../../constants/user-types");
const mailService = require("../../infrastructure/mail/mail.service");

function hashRecoveryToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

async function registerClient({ nome, email, senha, telefone }) {
  const normalizedName = nome.trim();
  const normalizedEmail = email.trim();
  const normalizedPhone = telefone.trim();

  const existingUser =
    await authRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(
      "E-mail já cadastrado.",
      409,
      "EMAIL_ALREADY_REGISTERED"
    );
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  try {
    const usuario = await authRepository.createUser({
      nome: normalizedName,
      email: normalizedEmail,
      senhaHash,
      telefone: normalizedPhone,
      tipo: USER_TYPES.CLIENTE
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo
    };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "E-mail já cadastrado.",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    throw error;
  }
}

async function login({ email, senha }) {
  const normalizedEmail = email.trim();

  const usuario =
    await authRepository.findUserByEmail(normalizedEmail);

  if (!usuario) {
    throw new AppError(
      "Credenciais inválidas.",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const senhaValida =
    await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaValida) {
    throw new AppError(
      "Credenciais inválidas.",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  const accessToken = generateAccessToken(usuario);

  return {
    accessToken,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    }
  };
}

async function requestPasswordRecovery({ email }) {
  const normalizedEmail = email.trim();

  const usuario =
    await authRepository.findUserByEmail(normalizedEmail);

  if (!usuario) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashRecoveryToken(token);

  const criadoEm = new Date();
  const expiraEm = new Date(
    criadoEm.getTime() + 10 * 60 * 1000
  );

  await authRepository.createPasswordRecovery({
    usuarioId: usuario.id,
    tokenHash,
    expiraEm
  });

  await mailService.sendPasswordRecovery({
    to: usuario.email,
    nome: usuario.nome,
    token
  });
}

async function resetPassword({ token, novaSenha }) {
  const normalizedToken = token.trim();
  const tokenHash = hashRecoveryToken(normalizedToken);

  const recuperacao =
    await authRepository.findPasswordRecoveryByHash(tokenHash);

  const agora = new Date();

  if (
    !recuperacao ||
    recuperacao.utilizadoEm ||
    recuperacao.invalidadoEm ||
    recuperacao.expiraEm <= agora
  ) {
    throw new AppError(
      "Token inválido, expirado ou já utilizado.",
      400,
      "INVALID_PASSWORD_RECOVERY_TOKEN"
    );
  }

  const novaSenhaHash = await bcrypt.hash(novaSenha, 12);

  await authRepository.runInTransaction(
    async (transaction) => {
      await authRepository.updateUserPassword(
        recuperacao.usuarioId,
        novaSenhaHash,
        transaction
      );

      await authRepository.markPasswordRecoveryAsUsed(
        recuperacao.id,
        agora,
        transaction
      );

      await authRepository.invalidateOtherRecoveries(
        recuperacao.usuarioId,
        recuperacao.id,
        agora,
        transaction
      );
    }
  );
}

module.exports = {
  registerClient,
  login,
  requestPasswordRecovery,
  resetPassword
};