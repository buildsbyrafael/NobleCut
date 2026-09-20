const APPOINTMENT_STATUS = require("../../constants/appointment-status");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ISO_WITH_TIMEZONE_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validationError(res, details) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Existem campos inválidos.",
      details
    }
  });
}

function isValidDate(value) {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validateCreateAppointment(req, res, next) {
  const body = req.body || {};

  const allowedFields = [
    "barbeiroId",
    "servicoId",
    "dataHoraInicio"
  ];

  const details = [];

  for (const field of Object.keys(body)) {
    if (!allowedFields.includes(field)) {
      details.push({
        field,
        message: "Campo não permitido."
      });
    }
  }

  if (!body.barbeiroId) {
    details.push({
      field: "barbeiroId",
      message: "Barbeiro é obrigatório."
    });
  } else if (
    typeof body.barbeiroId !== "string" ||
    !UUID_REGEX.test(body.barbeiroId)
  ) {
    details.push({
      field: "barbeiroId",
      message: "Barbeiro deve possuir um UUID válido."
    });
  }

  if (!body.servicoId) {
    details.push({
      field: "servicoId",
      message: "Serviço é obrigatório."
    });
  } else if (
    typeof body.servicoId !== "string" ||
    !UUID_REGEX.test(body.servicoId)
  ) {
    details.push({
      field: "servicoId",
      message: "Serviço deve possuir um UUID válido."
    });
  }

  if (!body.dataHoraInicio) {
    details.push({
      field: "dataHoraInicio",
      message: "Data e horário de início são obrigatórios."
    });
  } else if (
    typeof body.dataHoraInicio !== "string" ||
    !ISO_WITH_TIMEZONE_REGEX.test(body.dataHoraInicio) ||
    Number.isNaN(Date.parse(body.dataHoraInicio))
  ) {
    details.push({
      field: "dataHoraInicio",
      message:
        "Data e horário de início devem estar em formato ISO 8601 com timezone."
    });
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateListAppointments(req, res, next) {
  const query = req.query || {};
  const allowedFields = ["date", "status", "barberId"];
  const details = [];

  for (const field of Object.keys(query)) {
    if (!allowedFields.includes(field)) {
      details.push({
        field,
        message: "Filtro não permitido."
      });
    }
  }

  if (query.date !== undefined) {
    if (
      typeof query.date !== "string" ||
      !isValidDate(query.date)
    ) {
      details.push({
        field: "date",
        message: "Data deve estar no formato YYYY-MM-DD e ser válida."
      });
    }
  }

  if (query.status !== undefined) {
    const validStatuses = Object.values(APPOINTMENT_STATUS);

    if (
      typeof query.status !== "string" ||
      !validStatuses.includes(query.status)
    ) {
      details.push({
        field: "status",
        message:
          "Status deve ser AGENDADO, CONCLUIDO ou CANCELADO."
      });
    }
  }

  if (query.barberId !== undefined) {
    if (
      typeof query.barberId !== "string" ||
      !UUID_REGEX.test(query.barberId)
    ) {
      details.push({
        field: "barberId",
        message: "Barbeiro deve possuir um UUID válido."
      });
    }
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateAppointmentId(req, res, next) {
  const { id } = req.params;

  if (!UUID_REGEX.test(id)) {
    return validationError(res, [
      {
        field: "id",
        message: "Agendamento deve possuir um UUID válido."
      }
    ]);
  }

  return next();
}

module.exports = {
  validateCreateAppointment,
  validateListAppointments,
  validateAppointmentId
};