const { Op } = require("sequelize");
const {
  Usuario,
  Barbeiro,
  Servico,
  BarbeiroServico,
  Agendamento
} = require("../../database/models");

async function findAllBarbers() {
  return Barbeiro.findAll({
    raw: true
  });
}

async function findBarberById(id) {
  return Barbeiro.findByPk(id, {
    raw: true
  });
}

async function findUsersByIds(ids) {
  if (ids.length === 0) {
    return [];
  }

  return Usuario.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    raw: true
  });
}

async function findAllBarberServices() {
  return BarbeiroServico.findAll({
    raw: true
  });
}

async function findBarberServicesByBarberId(barbeiroId) {
  return BarbeiroServico.findAll({
    where: {
      barbeiroId
    },
    raw: true
  });
}

async function findServicesByIds(ids) {
  if (ids.length === 0) {
    return [];
  }

  return Servico.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    raw: true
  });
}

async function findScheduledAppointmentsBetween(startAt, endAt) {
  return Agendamento.findAll({
    where: {
      status: "AGENDADO",
      dataHoraInicio: {
        [Op.lt]: endAt
      },
      dataHoraFim: {
        [Op.gt]: startAt
      }
    },
    raw: true
  });
}

module.exports = {
  findAllBarbers,
  findBarberById,
  findUsersByIds,
  findAllBarberServices,
  findBarberServicesByBarberId,
  findServicesByIds,
  findScheduledAppointmentsBetween
};