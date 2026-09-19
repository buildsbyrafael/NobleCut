const AppError = require("../utils/AppError");

function validationMiddleware(schema) {
  return (req, res, next) => {
    const errors = schema.validate(req.body);

    if (errors.length > 0) {
      throw new AppError(
        "Existem campos inválidos.",
        400,
        "VALIDATION_ERROR",
        errors
      );
    }

    next();
  };
}

module.exports = validationMiddleware;