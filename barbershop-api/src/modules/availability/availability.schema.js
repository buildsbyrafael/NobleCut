function validationError(res, details) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Existem campos inválidos.",
      details
    }
  });
}

function hasOnlyAllowedFields(object, allowedFields) {
  return Object.keys(object).filter(
    (field) => !allowedFields.includes(field)
  );
}

function isValidDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidIsoDateTime(value) {
  if (typeof value !== "string") {
    return false;
  }

  const isoPattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (!isoPattern.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

function isValidUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function validateSlots(req, res, next) {
  const details = [];

  const extraFields = hasOnlyAllowedFields(
    req.query,
    ["date"]
  );

  for (const field of extraFields) {
    details.push({
      field,
      message: "Parâmetro não permitido."
    });
  }

  if (!req.query.date) {
    details.push({
      field: "date",
      message: "Data é obrigatória."
    });
  } else if (!isValidDate(req.query.date)) {
    details.push({
      field: "date",
      message: "Data inválida. Utilize o formato YYYY-MM-DD."
    });
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateBarbers(req, res, next) {
  const details = [];

  const extraFields = hasOnlyAllowedFields(
    req.query,
    ["startAt"]
  );

  for (const field of extraFields) {
    details.push({
      field,
      message: "Parâmetro não permitido."
    });
  }

  if (!req.query.startAt) {
    details.push({
      field: "startAt",
      message: "Horário inicial é obrigatório."
    });
  } else if (!isValidIsoDateTime(req.query.startAt)) {
    details.push({
      field: "startAt",
      message: "Data e horário inválidos. Utilize o formato ISO 8601."
    });
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

function validateBarberServices(req, res, next) {
  const details = [];

  if (!isValidUuid(req.params.barberId)) {
    details.push({
      field: "barberId",
      message: "Identificador do barbeiro inválido."
    });
  }

  const extraFields = hasOnlyAllowedFields(
    req.query,
    ["startAt"]
  );

  for (const field of extraFields) {
    details.push({
      field,
      message: "Parâmetro não permitido."
    });
  }

  if (!req.query.startAt) {
    details.push({
      field: "startAt",
      message: "Horário inicial é obrigatório."
    });
  } else if (!isValidIsoDateTime(req.query.startAt)) {
    details.push({
      field: "startAt",
      message: "Data e horário inválidos. Utilize o formato ISO 8601."
    });
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

module.exports = {
  validateSlots,
  validateBarbers,
  validateBarberServices
};