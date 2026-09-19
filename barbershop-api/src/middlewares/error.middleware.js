const AppError = require("../utils/AppError");

function errorMiddleware(error, req, res, next) {
  if (error instanceof AppError) {
    const response = {
      error: {
        code: error.code,
        message: error.message
      }
    };

    if (error.details) {
      response.error.details = error.details;
    }

    return res.status(error.statusCode).json(response);
  }

  console.error(error);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno inesperado da aplicação."
    }
  });
}

module.exports = errorMiddleware;