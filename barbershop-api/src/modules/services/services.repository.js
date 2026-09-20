const {
  Servico,
  Agendamento,
  sequelize
} = require("../../database/models");

async function runInTransaction(callback) {
  return sequelize.transaction(callback);
}

async function createService(data, transaction = null) {
  return Servico.create(data, {
    transaction
  });
}

async function findAllServices() {
  return Servico.findAll();
}

async function findServiceById(id, transaction = null) {
  return Servico.findByPk(id, {
    transaction
  });
}

async function findScheduledAppointmentByServiceId(
  servicoId,
  transaction = null
) {
  return Agendamento.findOne({
    where: {
      servicoId,
      status: "AGENDADO"
    },
    transaction
  });
}

async function updateService(service, data, transaction = null) {
  return service.update(data, {
    transaction
  });
}

async function deleteService(service, transaction = null) {
  return service.destroy({
    transaction
  });
}

module.exports = {
  runInTransaction,
  createService,
  findAllServices,
  findServiceById,
  findScheduledAppointmentByServiceId,
  updateService,
  deleteService
};