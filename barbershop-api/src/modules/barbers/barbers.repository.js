const { Op } = require("sequelize");
const {
  sequelize,
  Usuario,
  Barbeiro,
  Servico,
  BarbeiroServico,
  Agendamento,
  Avaliacao
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

async function findUserById(id, transaction) {
  return Usuario.findByPk(id, {
    transaction
  });
}

async function findUsersByIds(userIds) {
  if (userIds.length === 0) {
    return [];
  }

  return Usuario.findAll({
    where: {
      id: {
        [Op.in]: userIds
      }
    }
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

async function createBarberServices(
  barbeiroId,
  serviceIds,
  transaction
) {
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

async function deleteBarberServices(barbeiroId, transaction) {
  return BarbeiroServico.destroy({
    where: {
      barbeiroId
    },
    transaction
  });
}

async function findAllBarbers() {
  return Barbeiro.findAll();
}

async function findBarberById(id, transaction) {
  return Barbeiro.findByPk(id, {
    transaction
  });
}

async function findBarberServiceLinks(barbeiroId) {
  return BarbeiroServico.findAll({
    where: {
      barbeiroId
    }
  });
}

async function findAppointmentsByBarberIds(barberIds) {
  if (barberIds.length === 0) {
    return [];
  }

  return Agendamento.findAll({
    where: {
      barbeiroId: {
        [Op.in]: barberIds
      }
    }
  });
}

async function findReviewsByAppointmentIds(appointmentIds) {
  if (appointmentIds.length === 0) {
    return [];
  }

  return Avaliacao.findAll({
    where: {
      agendamentoId: {
        [Op.in]: appointmentIds
      }
    }
  });
}

async function updateUser(usuario, data, transaction) {
  return usuario.update(data, {
    transaction
  });
}

async function updateBarber(barbeiro, data, transaction) {
  return barbeiro.update(data, {
    transaction
  });
}

module.exports = {
  runInTransaction,
  findUserByEmail,
  findUserById,
  findUsersByIds,
  findServicesByIds,
  createUser,
  createBarber,
  createBarberServices,
  deleteBarberServices,
  findAllBarbers,
  findBarberById,
  findBarberServiceLinks,
  findAppointmentsByBarberIds,
  findReviewsByAppointmentIds,
  updateUser,
  updateBarber
};