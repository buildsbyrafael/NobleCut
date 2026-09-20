const AppError = require("../../utils/AppError");
const appointmentsRepository = require("./appointments.repository");
const mailService = require("../../infrastructure/mail/mail.service");
const APPOINTMENT_STATUS = require("../../constants/appointment-status");
const USER_TYPES = require("../../constants/user-types");
const COMPLETION_TYPES = require("../../constants/completion-types");

const TIME_ZONE = "America/Fortaleza";
const OPENING_HOUR = 9;
const CLOSING_HOUR = 21;
const CANCELLATION_MINUTES = 60;

function getLocalParts(date) {
  const value = date instanceof Date ? date : new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(value);

  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return {
    year: Number(result.year),
    month: Number(result.month),
    day: Number(result.day),
    hour: Number(result.hour),
    minute: Number(result.minute),
    second: Number(result.second),
    weekday: result.weekday
  };
}

function sameLocalDate(first, second) {
  return (
    first.year === second.year &&
    first.month === second.month &&
    first.day === second.day
  );
}

function validateStartTime(date) {
  const parts = getLocalParts(date);

  if (parts.weekday === "Sun") {
    throw new AppError(
      "Não é permitido realizar agendamentos aos domingos.",
      409,
      "APPOINTMENT_NOT_ALLOWED_ON_SUNDAY"
    );
  }

  if (parts.hour < OPENING_HOUR || parts.hour >= CLOSING_HOUR) {
    throw new AppError(
      "O horário informado está fora do funcionamento da barbearia.",
      409,
      "APPOINTMENT_OUTSIDE_BUSINESS_HOURS"
    );
  }

  if (
    (parts.minute !== 0 && parts.minute !== 30) ||
    parts.second !== 0
  ) {
    throw new AppError(
      "O início do atendimento deve respeitar intervalos de 30 minutos.",
      409,
      "INVALID_APPOINTMENT_SLOT"
    );
  }
}

function validateEndTime(startDate, endDate) {
  const startParts = getLocalParts(startDate);
  const endParts = getLocalParts(endDate);

  if (!sameLocalDate(startParts, endParts)) {
    throw new AppError(
      "O serviço deve ser concluído dentro do horário de funcionamento da barbearia.",
      409,
      "APPOINTMENT_OUTSIDE_BUSINESS_HOURS"
    );
  }

  const endMinutes = endParts.hour * 60 + endParts.minute;
  const closingMinutes = CLOSING_HOUR * 60;

  if (endMinutes > closingMinutes) {
    throw new AppError(
      "O serviço deve ser concluído até as 21:00.",
      409,
      "APPOINTMENT_OUTSIDE_BUSINESS_HOURS"
    );
  }
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateTime(date) {
  const parts = getLocalParts(date);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(
    parts.hour
  )}:${pad(parts.minute)}:${pad(parts.second)}-03:00`;
}

function serializeCreatedAppointment(appointment) {
  return {
    id: appointment.id,
    status: appointment.status,
    dataHoraInicio: formatDateTime(appointment.dataHoraInicio),
    dataHoraFim: formatDateTime(appointment.dataHoraFim),
    servico: {
      nome: appointment.servicoNome,
      duracaoMinutos: appointment.servicoDuracaoMinutos,
      preco: Number(appointment.servicoPreco)
    }
  };
}

function serializeAppointment(
  appointment,
  clientsById,
  barbersById,
  barberUsersById
) {
  const cliente = clientsById.get(appointment.clienteId);
  const barbeiro = barbersById.get(appointment.barbeiroId);
  const barbeiroUsuario = barbeiro
    ? barberUsersById.get(barbeiro.usuarioId)
    : null;

  return {
    id: appointment.id,
    status: appointment.status,
    dataHoraInicio: formatDateTime(appointment.dataHoraInicio),
    dataHoraFim: formatDateTime(appointment.dataHoraFim),
    cliente: {
      id: appointment.clienteId,
      nome: cliente ? cliente.nome : null
    },
    barbeiro: {
      id: appointment.barbeiroId,
      nome: barbeiroUsuario ? barbeiroUsuario.nome : null
    },
    servico: {
      id: appointment.servicoId,
      nome: appointment.servicoNome,
      duracaoMinutos: appointment.servicoDuracaoMinutos,
      preco: Number(appointment.servicoPreco)
    }
  };
}

function serializeCancelledAppointment(appointment) {
  return {
    id: appointment.id,
    status: appointment.status,
    dataHoraInicio: formatDateTime(appointment.dataHoraInicio),
    dataHoraFim: formatDateTime(appointment.dataHoraFim),
    servico: {
      id: appointment.servicoId,
      nome: appointment.servicoNome,
      duracaoMinutos: appointment.servicoDuracaoMinutos,
      preco: Number(appointment.servicoPreco)
    },
    cancelamento: {
      porTipo: appointment.canceladoPorTipo,
      porUsuarioId: appointment.canceladoPorUsuarioId,
      canceladoEm: formatDateTime(appointment.canceladoEm)
    }
  };
}

function serializeCompletedAppointment(appointment) {
  return {
    id: appointment.id,
    status: appointment.status,
    dataHoraInicio: formatDateTime(appointment.dataHoraInicio),
    dataHoraFim: formatDateTime(appointment.dataHoraFim),
    servico: {
      id: appointment.servicoId,
      nome: appointment.servicoNome,
      duracaoMinutos: appointment.servicoDuracaoMinutos,
      preco: Number(appointment.servicoPreco)
    },
    conclusao: {
      por: appointment.concluidoPor,
      concluidoEm: formatDateTime(appointment.concluidoEm)
    }
  };
}

async function enrichAppointments(appointments) {
  if (!appointments.length) {
    return [];
  }

  const clienteIds = [
    ...new Set(appointments.map((appointment) => appointment.clienteId))
  ];

  const barbeiroIds = [
    ...new Set(appointments.map((appointment) => appointment.barbeiroId))
  ];

  const [clientes, barbeiros] = await Promise.all([
    appointmentsRepository.findUsersByIds(clienteIds),
    appointmentsRepository.findBarbersByIds(barbeiroIds)
  ]);

  const barbeiroUsuarioIds = [
    ...new Set(barbeiros.map((barbeiro) => barbeiro.usuarioId))
  ];

  const barbeiroUsuarios =
    await appointmentsRepository.findUsersByIds(barbeiroUsuarioIds);

  const clientsById = new Map(
    clientes.map((cliente) => [cliente.id, cliente])
  );

  const barbersById = new Map(
    barbeiros.map((barbeiro) => [barbeiro.id, barbeiro])
  );

  const barberUsersById = new Map(
    barbeiroUsuarios.map((usuario) => [usuario.id, usuario])
  );

  return appointments.map((appointment) =>
    serializeAppointment(
      appointment,
      clientsById,
      barbersById,
      barberUsersById
    )
  );
}

function getDateRange(date) {
  if (!date) {
    return {
      startAt: null,
      endAt: null
    };
  }

  const startAt = new Date(`${date}T00:00:00-03:00`);
  const endAt = new Date(startAt.getTime() + 24 * 60 * 60 * 1000);

  return {
    startAt,
    endAt
  };
}

async function create(clienteId, input) {
  const { barbeiroId, servicoId, dataHoraInicio } = input;

  const inicio = new Date(dataHoraInicio);

  const result = await appointmentsRepository.runInTransaction(
    async (transaction) => {
      const cliente = await appointmentsRepository.findUserById(
        clienteId,
        transaction
      );

      if (!cliente) {
        throw new AppError(
          "Cliente não encontrado.",
          404,
          "CLIENT_NOT_FOUND"
        );
      }

      const barbeiro = await appointmentsRepository.findBarberById(
        barbeiroId,
        transaction
      );

      if (!barbeiro) {
        throw new AppError(
          "Barbeiro não encontrado.",
          404,
          "BARBER_NOT_FOUND"
        );
      }

      const barbeiroUsuario =
        await appointmentsRepository.findUserById(
          barbeiro.usuarioId,
          transaction
        );

      if (!barbeiroUsuario) {
        throw new AppError(
          "Usuário associado ao barbeiro não encontrado.",
          404,
          "BARBER_USER_NOT_FOUND"
        );
      }

      const servico = await appointmentsRepository.findServiceById(
        servicoId,
        transaction
      );

      if (!servico) {
        throw new AppError(
          "Serviço não encontrado.",
          404,
          "SERVICE_NOT_FOUND"
        );
      }

      const barberService =
        await appointmentsRepository.findBarberService(
          barbeiroId,
          servicoId,
          transaction
        );

      if (!barberService) {
        throw new AppError(
          "O barbeiro selecionado não realiza este serviço.",
          409,
          "BARBER_SERVICE_NOT_AVAILABLE"
        );
      }

      validateStartTime(inicio);

      const fim = new Date(
        inicio.getTime() + servico.duracaoMinutos * 60 * 1000
      );

      validateEndTime(inicio, fim);

      const barberConflict =
        await appointmentsRepository.findBarberConflict(
          barbeiroId,
          inicio,
          fim,
          transaction
        );

      if (barberConflict) {
        throw new AppError(
          "O barbeiro não está disponível durante todo o período informado.",
          409,
          "BARBER_UNAVAILABLE"
        );
      }

      const clientConflict =
        await appointmentsRepository.findClientConflict(
          clienteId,
          inicio,
          fim,
          transaction
        );

      if (clientConflict) {
        throw new AppError(
          "O cliente já possui um atendimento conflitante com este horário.",
          409,
          "CLIENT_UNAVAILABLE"
        );
      }

      const appointment =
        await appointmentsRepository.createAppointment(
          {
            clienteId,
            barbeiroId,
            servicoId,
            dataHoraInicio: inicio,
            dataHoraFim: fim,
            status: APPOINTMENT_STATUS.AGENDADO,
            servicoNome: servico.nome,
            servicoDuracaoMinutos: servico.duracaoMinutos,
            servicoPreco: servico.preco
          },
          transaction
        );

      return {
        appointment: serializeCreatedAppointment(appointment),
        email: {
          cliente: {
            nome: cliente.nome,
            email: cliente.email
          },
          barbeiro: {
            nome: barbeiroUsuario.nome,
            email: barbeiroUsuario.email
          },
          servicoNome: servico.nome,
          preco: Number(servico.preco),
          dataHoraInicio: formatDateTime(inicio),
          dataHoraFim: formatDateTime(fim)
        }
      };
    }
  );

  await Promise.all([
    mailService.sendAppointmentConfirmation({
      to: result.email.cliente.email,
      nome: result.email.cliente.nome,
      tipoDestinatario: "CLIENTE",
      clienteNome: result.email.cliente.nome,
      barbeiroNome: result.email.barbeiro.nome,
      servicoNome: result.email.servicoNome,
      dataHoraInicio: result.email.dataHoraInicio,
      dataHoraFim: result.email.dataHoraFim,
      preco: result.email.preco
    }),
    mailService.sendAppointmentConfirmation({
      to: result.email.barbeiro.email,
      nome: result.email.barbeiro.nome,
      tipoDestinatario: "BARBEIRO",
      clienteNome: result.email.cliente.nome,
      barbeiroNome: result.email.barbeiro.nome,
      servicoNome: result.email.servicoNome,
      dataHoraInicio: result.email.dataHoraInicio,
      dataHoraFim: result.email.dataHoraFim,
      preco: result.email.preco
    })
  ]);

  return result.appointment;
}

async function list(authenticatedUser, filters) {
  const repositoryFilters = {
    status: filters.status || null,
    barbeiroId: null,
    clienteId: null,
    ...getDateRange(filters.date)
  };

  if (authenticatedUser.tipo === USER_TYPES.CLIENTE) {
    repositoryFilters.clienteId = authenticatedUser.id;

    if (filters.barberId) {
      repositoryFilters.barbeiroId = filters.barberId;
    }
  } else if (authenticatedUser.tipo === USER_TYPES.BARBEIRO) {
    const barbeiro =
      await appointmentsRepository.findBarberByUserId(
        authenticatedUser.id
      );

    if (!barbeiro) {
      throw new AppError(
        "Barbeiro não encontrado.",
        404,
        "BARBER_NOT_FOUND"
      );
    }

    if (filters.barberId && filters.barberId !== barbeiro.id) {
      return [];
    }

    repositoryFilters.barbeiroId = barbeiro.id;
  } else if (authenticatedUser.tipo === USER_TYPES.ADMINISTRADOR) {
    if (filters.barberId) {
      repositoryFilters.barbeiroId = filters.barberId;
    }
  }

  const appointments =
    await appointmentsRepository.findAppointments(repositoryFilters);

  return enrichAppointments(appointments);
}

async function getById(authenticatedUser, appointmentId) {
  const appointment =
    await appointmentsRepository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError(
      "Agendamento não encontrado.",
      404,
      "APPOINTMENT_NOT_FOUND"
    );
  }

  if (authenticatedUser.tipo === USER_TYPES.CLIENTE) {
    if (appointment.clienteId !== authenticatedUser.id) {
      throw new AppError(
        "Você não possui permissão para consultar este agendamento.",
        403,
        "FORBIDDEN"
      );
    }
  } else if (authenticatedUser.tipo === USER_TYPES.BARBEIRO) {
    const barbeiro =
      await appointmentsRepository.findBarberByUserId(
        authenticatedUser.id
      );

    if (!barbeiro || appointment.barbeiroId !== barbeiro.id) {
      throw new AppError(
        "Você não possui permissão para consultar este agendamento.",
        403,
        "FORBIDDEN"
      );
    }
  }

  const [serialized] = await enrichAppointments([appointment]);

  return serialized;
}

async function cancel(authenticatedUser, appointmentId) {
  const appointment = await appointmentsRepository.runInTransaction(
    async (transaction) => {
      const currentAppointment =
        await appointmentsRepository.findAppointmentById(
          appointmentId,
          transaction
        );

      if (!currentAppointment) {
        throw new AppError(
          "Agendamento não encontrado.",
          404,
          "APPOINTMENT_NOT_FOUND"
        );
      }

      if (currentAppointment.status !== APPOINTMENT_STATUS.AGENDADO) {
        throw new AppError(
          "Somente agendamentos com status AGENDADO podem ser cancelados.",
          409,
          "APPOINTMENT_NOT_CANCELLABLE"
        );
      }

      if (authenticatedUser.tipo === USER_TYPES.CLIENTE) {
        if (currentAppointment.clienteId !== authenticatedUser.id) {
          throw new AppError(
            "Você não possui permissão para cancelar este agendamento.",
            403,
            "FORBIDDEN"
          );
        }
      } else if (authenticatedUser.tipo === USER_TYPES.BARBEIRO) {
        const barbeiro =
          await appointmentsRepository.findBarberByUserId(
            authenticatedUser.id,
            transaction
          );

        if (
          !barbeiro ||
          currentAppointment.barbeiroId !== barbeiro.id
        ) {
          throw new AppError(
            "Você não possui permissão para cancelar este agendamento.",
            403,
            "FORBIDDEN"
          );
        }
      } else if (
        authenticatedUser.tipo !== USER_TYPES.ADMINISTRADOR
      ) {
        throw new AppError(
          "Você não possui permissão para cancelar este agendamento.",
          403,
          "FORBIDDEN"
        );
      }

      if (authenticatedUser.tipo !== USER_TYPES.ADMINISTRADOR) {
        const now = Date.now();
        const startAt = new Date(
          currentAppointment.dataHoraInicio
        ).getTime();

        const millisecondsUntilStart = startAt - now;
        const minimumMilliseconds =
          CANCELLATION_MINUTES * 60 * 1000;

        if (millisecondsUntilStart < minimumMilliseconds) {
          throw new AppError(
            "O cancelamento deve ser realizado com pelo menos 60 minutos de antecedência.",
            409,
            "APPOINTMENT_CANCELLATION_TOO_LATE"
          );
        }
      }

      return appointmentsRepository.updateAppointment(
        currentAppointment,
        {
          status: APPOINTMENT_STATUS.CANCELADO,
          canceladoPorTipo: authenticatedUser.tipo,
          canceladoPorUsuarioId: authenticatedUser.id,
          canceladoEm: new Date()
        },
        transaction
      );
    }
  );

  return serializeCancelledAppointment(appointment);
}

async function complete(authenticatedUser, appointmentId) {
  const appointment = await appointmentsRepository.runInTransaction(
    async (transaction) => {
      const currentAppointment =
        await appointmentsRepository.findAppointmentById(
          appointmentId,
          transaction
        );

      if (!currentAppointment) {
        throw new AppError(
          "Agendamento não encontrado.",
          404,
          "APPOINTMENT_NOT_FOUND"
        );
      }

      if (currentAppointment.clienteId !== authenticatedUser.id) {
        throw new AppError(
          "Você não possui permissão para concluir este agendamento.",
          403,
          "FORBIDDEN"
        );
      }

      if (currentAppointment.status !== APPOINTMENT_STATUS.AGENDADO) {
        throw new AppError(
          "Somente agendamentos com status AGENDADO podem ser concluídos.",
          409,
          "APPOINTMENT_NOT_COMPLETABLE"
        );
      }

      const now = new Date();
      const endAt = new Date(currentAppointment.dataHoraFim);

      if (now.getTime() < endAt.getTime()) {
        throw new AppError(
          "O atendimento somente pode ser concluído após o horário previsto para término.",
          409,
          "APPOINTMENT_COMPLETION_TOO_EARLY"
        );
      }

      return appointmentsRepository.updateAppointment(
        currentAppointment,
        {
          status: APPOINTMENT_STATUS.CONCLUIDO,
          concluidoPor: COMPLETION_TYPES.CLIENTE,
          concluidoEm: now
        },
        transaction
      );
    }
  );

  return serializeCompletedAppointment(appointment);
}

async function completeAutomaticallyEligible() {
  const now = new Date();

  const cutoff = new Date(
    now.getTime() - 3 * 60 * 60 * 1000
  );

  return appointmentsRepository.runInTransaction(
    async (transaction) => {
      const appointments =
        await appointmentsRepository
          .findAppointmentsEligibleForAutomaticCompletion(
            cutoff,
            transaction
          );

      for (const appointment of appointments) {
        await appointmentsRepository.updateAppointment(
          appointment,
          {
            status: APPOINTMENT_STATUS.CONCLUIDO,
            concluidoPor: COMPLETION_TYPES.SISTEMA,
            concluidoEm: now
          },
          transaction
        );
      }

      return appointments.length;
    }
  );
}

module.exports = {
  create,
  list,
  getById,
  cancel,
  complete,
  completeAutomaticallyEligible
};