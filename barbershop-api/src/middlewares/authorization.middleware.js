const AppError = require("../utils/AppError");

function authorizationMiddleware(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Usuário não autenticado.",
          401,
          "UNAUTHORIZED"
        )
      );
    }

    if (!allowedTypes.includes(req.user.tipo)) {
      return next(
        new AppError(
          "Você não possui permissão para realizar esta operação.",
          403,
          "FORBIDDEN"
        )
      );
    }

    return next();
  };
}

module.exports = authorizationMiddleware;