const { Op } = require("sequelize");
const {
  sequelize,
  Usuario,
  Barbeiro,
  Servico,
  BarbeiroServico,
  Agendamento
} = require("../../database/models");
const APPOINTMENT_STATUS = require("../../constants/appointment-status");

async function findUserById(id, transaction = null) {
  return Usuario.findByPk(id, {
    transaction
  });
}

async function findUsersByIds(ids, transaction = null) {
  if (!ids.length) {
    return [];
  }

  return Usuario.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    transaction
  });
}

async function findBarberById(id, transaction = null) {
  return Barbeiro.findByPk(id, {
    transaction
  });
}

async function findBarberByUserId(usuarioId, transaction = null) {
  return Barbeiro.findOne({
    where: {
      usuarioId
    },
    transaction
  });
}

async function findBarbersByIds(ids, transaction = null) {
  if (!ids.length) {
    return [];
  }

  return Barbeiro.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    },
    transaction
  });
}

async function findServiceById(id, transaction = null) {
  return Servico.findByPk(id, {
    transaction
  });
}

async function findBarberService(barbeiroId, servicoId, transaction = null) {
  return BarbeiroServico.findOne({
    where: {
      barbeiroId,
      servicoId
    },
    transaction
  });
}

async function findBarberConflict(
  barbeiroId,
  dataHoraInicio,
  dataHoraFim,
  transaction = null
) {
  return Agendamento.findOne({
    where: {
      barbeiroId,
      status: APPOINTMENT_STATUS.AGENDADO,
      dataHoraInicio: {
        [Op.lt]: dataHoraFim
      },
      dataHoraFim: {
        [Op.gt]: dataHoraInicio
      }
    },
    transaction
  });
}

async function findClientConflict(
  clienteId,
  dataHoraInicio,
  dataHoraFim,
  transaction = null
) {
  return Agendamento.findOne({
    where: {
      clienteId,
      status: APPOINTMENT_STATUS.AGENDADO,
      dataHoraInicio: {
        [Op.lt]: dataHoraFim
      },
      dataHoraFim: {
        [Op.gt]: dataHoraInicio
      }
    },
    transaction
  });
}

async function createAppointment(data, transaction = null) {
  return Agendamento.create(data, {
    transaction
  });
}

async function findAppointments(
  {
    clienteId,
    barbeiroId,
    status,
    startAt,
    endAt
  },
  transaction = null
) {
  const where = {};

  if (clienteId) {
    where.clienteId = clienteId;
  }

  if (barbeiroId) {
    where.barbeiroId = barbeiroId;
  }

  if (status) {
    where.status = status;
  }

  if (startAt && endAt) {
    where.dataHoraInicio = {
      [Op.gte]: startAt,
      [Op.lt]: endAt
    };
  }

  return Agendamento.findAll({
    where,
    order: [["dataHoraInicio", "ASC"]],
    transaction
  });
}

async function findAppointmentById(id, transaction = null) {
  return Agendamento.findByPk(id, {
    transaction
  });
}

async function findAppointmentsEligibleForAutomaticCompletion(
  cutoff,
  transaction = null
) {
  return Agendamento.findAll({
    where: {
      status: APPOINTMENT_STATUS.AGENDADO,
      dataHoraFim: {
        [Op.lte]: cutoff
      }
    },
    order: [["dataHoraFim", "ASC"]],
    transaction
  });
}

async function updateAppointment(
  appointment,
  data,
  transaction = null
) {
  return appointment.update(data, {
    transaction
  });
}

async function runInTransaction(callback) {
  return sequelize.transaction(callback);
}

module.exports = {
  findUserById,
  findUsersByIds,
  findBarberById,
  findBarberByUserId,
  findBarbersByIds,
  findServiceById,
  findBarberService,
  findBarberConflict,
  findClientConflict,
  createAppointment,
  findAppointments,
  findAppointmentById,
  findAppointmentsEligibleForAutomaticCompletion,
  updateAppointment,
  runInTransaction
};