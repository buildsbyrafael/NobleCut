const { UniqueConstraintError } = require("sequelize");
const usersRepository = require("./users.repository");
const AppError = require("../../utils/AppError");

function serializeUser(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    tipo: usuario.tipo
  };
}

async function getAuthenticatedUser(userId) {
  const usuario = await usersRepository.findUserById(userId);

  if (!usuario) {
    throw new AppError(
      "Usuário autenticado não encontrado.",
      401,
      "UNAUTHORIZED"
    );
  }

  return serializeUser(usuario);
}

async function updateAuthenticatedUser(userId, data) {
  const usuario = await usersRepository.findUserById(userId);

  if (!usuario) {
    throw new AppError(
      "Usuário autenticado não encontrado.",
      401,
      "UNAUTHORIZED"
    );
  }

  const updateData = {};

  if (data.nome !== undefined) {
    updateData.nome = data.nome.trim();
  }

  if (data.telefone !== undefined) {
    updateData.telefone = data.telefone.trim();
  }

  if (data.email !== undefined) {
    const normalizedEmail = data.email.trim();

    if (normalizedEmail !== usuario.email) {
      const existingUser = await usersRepository.findUserByEmail(
        normalizedEmail
      );

      if (existingUser && existingUser.id !== usuario.id) {
        throw new AppError(
          "E-mail já cadastrado.",
          409,
          "EMAIL_ALREADY_REGISTERED"
        );
      }
    }

    updateData.email = normalizedEmail;
  }

  try {
    const updatedUser = await usersRepository.updateUser(
      usuario,
      updateData
    );

    return serializeUser(updatedUser);
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

module.exports = {
  getAuthenticatedUser,
  updateAuthenticatedUser
};