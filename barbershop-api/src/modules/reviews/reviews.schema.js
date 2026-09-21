const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validationError(res, details) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Existem campos inválidos.",
      details
    }
  });
}

function validateCreateReview(req, res, next) {
  const details = [];
  const allowedFields = ["nota", "comentario"];
  const receivedFields = Object.keys(req.body || {});

  if (!UUID_REGEX.test(req.params.id || "")) {
    details.push({
      field: "id",
      message: "ID do agendamento inválido."
    });
  }

  for (const field of receivedFields) {
    if (!allowedFields.includes(field)) {
      details.push({
        field,
        message: "Campo não permitido."
      });
    }
  }

  if (req.body.nota === undefined || req.body.nota === null) {
    details.push({
      field: "nota",
      message: "Nota é obrigatória."
    });
  } else if (
    !Number.isInteger(req.body.nota) ||
    req.body.nota < 1 ||
    req.body.nota > 5
  ) {
    details.push({
      field: "nota",
      message: "Nota deve ser um número inteiro entre 1 e 5."
    });
  }

  if (
    req.body.comentario !== undefined &&
    req.body.comentario !== null &&
    typeof req.body.comentario !== "string"
  ) {
    details.push({
      field: "comentario",
      message: "Comentário deve ser uma string."
    });
  }

  if (details.length > 0) {
    return validationError(res, details);
  }

  return next();
}

module.exports = {
  validateCreateReview
};