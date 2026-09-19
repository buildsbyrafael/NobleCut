const { Op } = require("sequelize");
const {
  sequelize,
  Usuario,
  RecuperacaoSenha
} = require("../../database/models");

async function findUserByEmail(email, transaction) {
  return Usuario.findOne({
    where: {
      email
    },
    transaction
  });
}

async function createUser(data, transaction) {
  return Usuario.create(data, {
    transaction
  });
}

async function createPasswordRecovery(data, transaction) {
  return RecuperacaoSenha.create(data, {
    transaction
  });
}

async function findPasswordRecoveryByHash(tokenHash, transaction) {
  return RecuperacaoSenha.findOne({
    where: {
      tokenHash
    },
    transaction
  });
}

async function updateUserPassword(usuarioId, senhaHash, transaction) {
  return Usuario.update(
    {
      senhaHash
    },
    {
      where: {
        id: usuarioId
      },
      transaction
    }
  );
}

async function markPasswordRecoveryAsUsed(
  recoveryId,
  utilizadoEm,
  transaction
) {
  return RecuperacaoSenha.update(
    {
      utilizadoEm
    },
    {
      where: {
        id: recoveryId
      },
      transaction
    }
  );
}

async function invalidateOtherRecoveries(
  usuarioId,
  recoveryId,
  invalidadoEm,
  transaction
) {
  return RecuperacaoSenha.update(
    {
      invalidadoEm
    },
    {
      where: {
        usuarioId,
        id: {
          [Op.ne]: recoveryId
        },
        utilizadoEm: null,
        invalidadoEm: null,
        expiraEm: {
          [Op.gt]: invalidadoEm
        }
      },
      transaction
    }
  );
}

async function runInTransaction(callback) {
  return sequelize.transaction(callback);
}

module.exports = {
  findUserByEmail,
  createUser,
  createPasswordRecovery,
  findPasswordRecoveryByHash,
  updateUserPassword,
  markPasswordRecoveryAsUsed,
  invalidateOtherRecoveries,
  runInTransaction
};