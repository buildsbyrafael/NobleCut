const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize");
const barbersRepository = require("./barbers.repository");
const AppError = require("../../utils/AppError");
const USER_TYPES = require("../../constants/user-types");

async function createBarber({
  nome,
  email,
  senha,
  telefone,
  descricao,
  fotoUrl,
  serviceIds
}) {
  const normalizedName = nome.trim();
  const normalizedEmail = email.trim();
  const normalizedPhone = telefone.trim();

  try {
    return await barbersRepository.runInTransaction(
      async (transaction) => {
        const existingUser = await barbersRepository.findUserByEmail(
          normalizedEmail,
          transaction
        );

        if (existingUser) {
          throw new AppError(
            "E-mail já cadastrado.",
            409,
            "EMAIL_ALREADY_REGISTERED"
          );
        }

        const servicos = await barbersRepository.findServicesByIds(
          serviceIds,
          transaction
        );

        if (servicos.length !== serviceIds.length) {
          throw new AppError(
            "Um ou mais serviços informados não existem.",
            404,
            "SERVICE_NOT_FOUND"
          );
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const usuario = await barbersRepository.createUser(
          {
            nome: normalizedName,
            email: normalizedEmail,
            senhaHash,
            telefone: normalizedPhone,
            tipo: USER_TYPES.BARBEIRO
          },
          transaction
        );

        const barbeiro = await barbersRepository.createBarber(
          {
            usuarioId: usuario.id,
            descricao:
              descricao !== undefined ? descricao.trim() : null,
            fotoUrl:
              fotoUrl !== undefined ? fotoUrl.trim() : null
          },
          transaction
        );

        await barbersRepository.createBarberServices(
          barbeiro.id,
          serviceIds,
          transaction
        );

        return {
          id: barbeiro.id,
          usuarioId: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          descricao: barbeiro.descricao,
          fotoUrl: barbeiro.fotoUrl,
          tipo: usuario.tipo,
          servicos: servicos.map((servico) => ({
            id: servico.id,
            nome: servico.nome
          }))
        };
      }
    );
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
  createBarber
};