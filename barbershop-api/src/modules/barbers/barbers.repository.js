const { Op } = require("sequelize");
const {
  sequelize,
  Usuario,
  Barbeiro,
  Servico,
  BarbeiroServico
} = require("../../database/models");

async function runInTransaction(callback) {
  return sequelize.transaction(callback);
}

async function findUserByEmail(email, transaction) {
  return Usuario.findOne({
    where: {
      email
    },
    transaction
  });
}

async function findServicesByIds(serviceIds, transaction) {
  if (serviceIds.length === 0) {
    return [];
  }

  return Servico.findAll({
    where: {
      id: {
        [Op.in]: serviceIds
      }
    },
    transaction
  });
}

async function createUser(data, transaction) {
  return Usuario.create(data, {
    transaction
  });
}

async function createBarber(data, transaction) {
  return Barbeiro.create(data, {
    transaction
  });
}

async function createBarberServices(barbeiroId, serviceIds, transaction) {
  if (serviceIds.length === 0) {
    return [];
  }

  return BarbeiroServico.bulkCreate(
    serviceIds.map((servicoId) => ({
      barbeiroId,
      servicoId
    })),
    {
      transaction
    }
  );
}

module.exports = {
  runInTransaction,
  findUserByEmail,
  findServicesByIds,
  createUser,
  createBarber,
  createBarberServices
};