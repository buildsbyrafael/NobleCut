const AppError = require("../../utils/AppError");
const servicesRepository = require("./services.repository");

function serializeService(service) {
  return {
    id: service.id,
    nome: service.nome,
    descricao: service.descricao,
    duracaoMinutos: service.duracaoMinutos,
    preco: Number(service.preco)
  };
}

function normalizeServiceData(data) {
  const normalized = {};

  if (data.nome !== undefined) {
    normalized.nome = data.nome.trim();
  }

  if (data.descricao !== undefined) {
    normalized.descricao =
      data.descricao === null ? null : data.descricao.trim();
  }

  if (data.duracaoMinutos !== undefined) {
    normalized.duracaoMinutos = data.duracaoMinutos;
  }

  if (data.preco !== undefined) {
    normalized.preco = data.preco;
  }

  return normalized;
}

async function createService(data) {
  const service = await servicesRepository.createService(
    normalizeServiceData(data)
  );

  return serializeService(service);
}

async function listServices() {
  const services = await servicesRepository.findAllServices();

  return services.map(serializeService);
}

async function getServiceById(id) {
  const service = await servicesRepository.findServiceById(id);

  if (!service) {
    throw new AppError(
      "Serviço não encontrado.",
      404,
      "SERVICE_NOT_FOUND"
    );
  }

  return serializeService(service);
}

async function updateService(id, data) {
  return servicesRepository.runInTransaction(async (transaction) => {
    const service = await servicesRepository.findServiceById(
      id,
      transaction
    );

    if (!service) {
      throw new AppError(
        "Serviço não encontrado.",
        404,
        "SERVICE_NOT_FOUND"
      );
    }

    const scheduledAppointment =
      await servicesRepository.findScheduledAppointmentByServiceId(
        id,
        transaction
      );

    if (scheduledAppointment) {
      throw new AppError(
        "O serviço possui atendimentos agendados e não pode ser atualizado.",
        409,
        "SERVICE_HAS_SCHEDULED_APPOINTMENTS"
      );
    }

    const updatedService = await servicesRepository.updateService(
      service,
      normalizeServiceData(data),
      transaction
    );

    return serializeService(updatedService);
  });
}

async function deleteService(id) {
  return servicesRepository.runInTransaction(async (transaction) => {
    const service = await servicesRepository.findServiceById(
      id,
      transaction
    );

    if (!service) {
      throw new AppError(
        "Serviço não encontrado.",
        404,
        "SERVICE_NOT_FOUND"
      );
    }

    const scheduledAppointment =
      await servicesRepository.findScheduledAppointmentByServiceId(
        id,
        transaction
      );

    if (scheduledAppointment) {
      throw new AppError(
        "O serviço possui atendimentos agendados e não pode ser removido.",
        409,
        "SERVICE_HAS_SCHEDULED_APPOINTMENTS"
      );
    }

    await servicesRepository.deleteService(
      service,
      transaction
    );
  });
}

module.exports = {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService
};